import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { CONCEPTS } from "./glass/concepts";
import { MATERIAL_DEFAULTS, materialStyle } from "./glass/materials";
import { COMPONENT_CONTRACTS } from "./glass/contracts";
import "./styles.css";

const COMPONENTS = Object.keys(COMPONENT_CONTRACTS);

function App() {
  const [concept, setConcept] = useState(CONCEPTS[0]);
  const [component, setComponent] = useState("button");
  const [tier, setTier] = useState("balanced");
  const [material, setMaterial] = useState(MATERIAL_DEFAULTS);
  const [reduced, setReduced] = useState(false);

  const style = useMemo(
    () => materialStyle({ ...material, motion: reduced ? 0 : material.motion }, tier),
    [material, tier, reduced]
  );

  const set = (key, value) => setMaterial((m) => ({ ...m, [key]: value }));

  return (
    <main className="lab" style={style}>
      <header className="topbar glass">
        <div>
          <span className="eyebrow">VIEWTUBE / EXPERIMENTAL SYSTEM</span>
          <h1>Glass Lab</h1>
          <p>Explore independent Liquid Glass component directions before they enter the canonical ViewTube library.</p>
        </div>
        <div className="status">LAB ONLY</div>
      </header>

      <section className="workspace">
        <aside className="controls glass">
          <div className="section-title">CONCEPT</div>
          <div className="concepts">
            {CONCEPTS.map((item) => (
              <button
                key={item.id}
                className={item.id === concept.id ? "choice active" : "choice"}
                onClick={() => setConcept(item)}
              >
                <strong>{item.name}</strong>
                <span>{item.purpose}</span>
              </button>
            ))}
          </div>

          <label>Component
            <select value={component} onChange={(e) => setComponent(e.target.value)}>
              {COMPONENTS.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>

          <label>Performance
            <select value={tier} onChange={(e) => setTier(e.target.value)}>
              <option value="high">High</option>
              <option value="balanced">Balanced</option>
              <option value="lite">Lite</option>
              <option value="fallback">Fallback</option>
            </select>
          </label>

          <label>Opacity <input type="range" min="0.12" max="0.8" step="0.01" value={material.opacity} onChange={(e) => set("opacity", Number(e.target.value))} /></label>
          <label>Blur <input type="range" min="0" max="40" value={material.blur} onChange={(e) => set("blur", Number(e.target.value))} /></label>
          <label>Refraction <input type="range" min="0" max="1" step="0.01" value={material.refraction} onChange={(e) => set("refraction", Number(e.target.value))} /></label>
          <label>Edge light <input type="range" min="0" max="1" step="0.01" value={material.edgeLight} onChange={(e) => set("edgeLight", Number(e.target.value))} /></label>
          <label>Glare <input type="range" min="0" max="1" step="0.01" value={material.glare} onChange={(e) => set("glare", Number(e.target.value))} /></label>
          <label>Depth <input type="range" min="0" max="1" step="0.01" value={material.depth} onChange={(e) => set("depth", Number(e.target.value))} /></label>

          <label className="check"><input type="checkbox" checked={reduced} onChange={(e) => setReduced(e.target.checked)} /> Reduced motion</label>
        </aside>

        <section className="stage">
          <div className="scene">
            <div className="blob one" />
            <div className="blob two" />
            <div className="blob three" />

            <article className={"demo glass " + concept.geometry}>
              <span className="eyebrow">{concept.geometry.toUpperCase()} / {component.toUpperCase()}</span>
              <h2>{concept.name}</h2>
              <p>{concept.treatment}</p>

              {component === "button" && <button className="demo-button">EXECUTE ACTION</button>}
              {component === "slider" && <input aria-label="Glass slider" className="demo-slider" type="range" defaultValue="62" />}
              {component === "input" && <input aria-label="Glass text input" className="demo-input" placeholder="Enter value" />}
              {component === "panel" && <div className="mini-panel">Dynamic content surface</div>}

              <div className="material-readout">
                <span>REFRACTION {material.refraction.toFixed(2)}</span>
                <span>BLUR {Math.round(material.blur)}PX</span>
                <span>TIER {tier.toUpperCase()}</span>
              </div>
            </article>
          </div>

          <aside className="inspector glass">
            <div className="section-title">CONTRACT</div>
            <strong>{component}</strong>
            <dl>
              <dt>Role</dt><dd>{COMPONENT_CONTRACTS[component].role}</dd>
              <dt>States</dt><dd>{COMPONENT_CONTRACTS[component].states.join(" · ")}</dd>
              <dt>Events</dt><dd>{COMPONENT_CONTRACTS[component].events.join(" · ") || "none"}</dd>
              <dt>Fallback</dt><dd>{COMPONENT_CONTRACTS[component].fallbackRenderer}</dd>
            </dl>
            <button className="export">EXPORT CONCEPT SPEC</button>
          </aside>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
