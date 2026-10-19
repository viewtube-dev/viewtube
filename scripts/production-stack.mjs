import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const VITE_CLI = path.join(ROOT, "node_modules", "vite", "bin", "vite.js")

const parsePort = (value, fallback, name) => {
  const port = Number(value || fallback)
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${name} must be an integer between 1 and 65535.`)
  }
  return port
}

export const getProductionStackConfig = (env = process.env) => {
  const publicPort = parsePort(env.PORT, "10000", "PORT")
  const apiPort = parsePort(env.BILLING_PORT, "3000", "BILLING_PORT")
  if (publicPort === apiPort) {
    throw new Error("PORT and BILLING_PORT must differ so the web and API servers can both bind.")
  }

  return {
    publicPort,
    apiPort,
    host: "0.0.0.0",
    billingOrigin: String(
      env.BILLING_ORIGIN || env.RENDER_EXTERNAL_URL || `http://localhost:${publicPort}`,
    ).replace(/\/$/, ""),
  }
}

const waitForApiReady = async (child, port, timeoutMs = 20_000) => {
  const startedAt = Date.now()
  let lastFailure = "no response"
  while (Date.now() - startedAt < timeoutMs) {
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(`API server exited before becoming healthy (code ${child.exitCode ?? child.signalCode}).`)
    }
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/release`, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(1_000),
      })
      if (response.ok) {
        const release = await response.json().catch(() => null)
        if (release && typeof release === "object") return
      }
      lastFailure = `HTTP ${response.status}`
    } catch (error) {
      lastFailure = error instanceof Error ? error.message : String(error)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  throw new Error(`API server failed its /api/release health check: ${lastFailure}`)
}

const stopChild = child => new Promise(resolve => {
  if (child.exitCode !== null || child.signalCode !== null) return resolve()
  child.once("exit", resolve)
  child.kill("SIGTERM")
  const timer = setTimeout(() => {
    if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL")
  }, 2_000)
  timer.unref()
})

export const startProductionStack = async (config = getProductionStackConfig()) => {
  let shuttingDown = false
  let api
  let web

  const shutdown = async exitCode => {
    if (shuttingDown) return
    shuttingDown = true
    await Promise.all([api, web].filter(Boolean).map(stopChild))
    process.exitCode = exitCode
  }

  const launch = (command, args, env = process.env) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env,
      stdio: "inherit",
      shell: false,
    })
    child.once("error", error => {
      process.stderr.write(`[production-stack] Failed to start process: ${error.message}\n`)
      void shutdown(1)
    })
    child.once("exit", (code, signal) => {
      if (!shuttingDown) {
        process.stderr.write(`[production-stack] Child exited unexpectedly (${code ?? signal ?? "unknown"}).\n`)
        void shutdown(code === 0 ? 1 : code ?? 1)
      }
    })
    return child
  }

  const handleSignal = () => void shutdown(0)
  process.once("SIGINT", handleSignal)
  process.once("SIGTERM", handleSignal)

  try {
    api = launch(process.execPath, [path.join(ROOT, "server", "billing-server.mjs")], {
      ...process.env,
      BILLING_PORT: String(config.apiPort),
      BILLING_ORIGIN: config.billingOrigin,
    })
    await waitForApiReady(api, config.apiPort)

    web = launch(process.execPath, [
      VITE_CLI,
      "preview",
      "--host", config.host,
      "--port", String(config.publicPort),
      "--strictPort",
    ])
    process.stdout.write(
      `[production-stack] API ready on 127.0.0.1:${config.apiPort}; web preview listening on ${config.host}:${config.publicPort}.\n`,
    )

    await new Promise(resolve => {
      api.once("exit", resolve)
      web.once("exit", resolve)
    })
    if (!shuttingDown) await shutdown(1)
  } catch (error) {
    process.stderr.write(`[production-stack] Startup failed: ${error instanceof Error ? error.message : String(error)}\n`)
    await shutdown(1)
  } finally {
    process.removeListener("SIGINT", handleSignal)
    process.removeListener("SIGTERM", handleSignal)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await startProductionStack()
}
