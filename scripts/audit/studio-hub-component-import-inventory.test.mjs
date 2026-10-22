import test from "node:test";
import assert from "node:assert/strict";
import { analyzeSource } from "./studio-hub-component-import-inventory.mjs";

test("captures named imports, aliases, JSX usage, and dynamic imports", () => {
  const result = analyzeSource(
    `import { StudioButton as Button } from "../studio-ui";
     import LocalCard from "./LocalCard";
     const LazyTool = React.lazy(() => import("./LazyTool"));
     export function Example() { return <><Button /><LocalCard /></>; }`,
    "/repo/src/views/Example.tsx",
  );
  assert.deepEqual(result.imports.map((item) => item.source), ["../studio-ui", "./LocalCard", "./LazyTool"]);
  assert.equal(result.imports[0].bindings[0].imported, "StudioButton");
  assert.equal(result.imports[0].bindings[0].local, "Button");
  assert.deepEqual(result.jsxComponents.sort(), ["Button", "LocalCard"]);
  assert.equal(result.imports[2].kind, "dynamic");
});

test("records default and namespace imports without counting them as JSX instances", () => {
  const result = analyzeSource(
    `import React from "react"; import * as Controls from "./controls";`,
    "/repo/src/Example.tsx",
  );
  assert.equal(result.imports.length, 2);
  assert.equal(result.jsxComponents.length, 0);
});
