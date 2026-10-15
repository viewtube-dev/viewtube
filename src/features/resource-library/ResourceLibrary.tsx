import React from "react"
import { BookOpenText, FileText, Search, Sparkles } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { SubToolbox, ToolboxScaffold } from "../../components/Toolbox"
import { VT_SPECTRUM_PALETTE_06, getToolboxPaletteColors } from "../../styles/toolboxPalette"
import ResourceDocumentRenderer from "./ResourceDocumentRenderer"
import {
  RESOURCE_LIBRARY_ENTRIES,
  RESOURCE_LEARNING_PATHS,
  getResourceById,
  normalizeResourceProgress,
  searchResourceLibrary,
} from "./resourceLibraryRegistry"
import "./resource-library.css"

const getResourcePaletteStyle = (index: number): React.CSSProperties => {
  const pair = getToolboxPaletteColors(index)
  return {
    "--vt-resource-pair-primary": pair.header,
    "--vt-resource-pair-secondary": pair.icon,
  } as React.CSSProperties
}

const canonicalSpectrumStyle = Object.fromEntries(
  VT_SPECTRUM_PALETTE_06.map((color, index) => [`--vt-spectrum-${index}`, color]),
) as React.CSSProperties

const RESOURCE_PROGRESS_STORAGE_KEY = "viewtube:resource-library:completed:v1"

const getResourceWorkflowLinks = (resource: (typeof RESOURCE_LIBRARY_ENTRIES)[number]) => {
  const tags = resource.tags.join(" ").toLocaleLowerCase()
  const aiBrainHref = `/ai-brain?ask=${encodeURIComponent(`Help me apply the Resource Library guide "${resource.title}" (${resource.id}) to my current creator workflow. Use available channel context, identify missing evidence, and do not assume the guide has changed my project data.`)}`
  if (/copyright|licensing|rights|synthetic-media/.test(tags)) {
    return [{ label: "Open Creator Vault", href: "/vault" }, { label: "Open Publisher", href: "/video-publisher" }]
  }
  if (/analytics|retention|traffic-sources|metrics|data-quality/.test(tags) || resource.category === "Analytics") {
    return [{ label: "Open Analytics", href: "/analytics" }, { label: "Apply guide with AI Brain", href: aiBrainHref }]
  }
  if (/planning|content-calendar|live-streaming|preflight/.test(tags)) {
    return [{ label: "Open Projects", href: "/projects" }, { label: "Open Studio", href: "/studio" }]
  }
  if (/thumbnail|packaging|click-through-rate|metadata|visibility/.test(tags)) {
    return [{ label: "Open Publisher", href: "/video-publisher" }, { label: "Open Studio", href: "/studio" }]
  }
  if (/community|comments|audience|subscribers|returning-viewers/.test(tags) || resource.category === "Audience") {
    return [{ label: "Open Studio", href: "/studio" }, { label: "Open AI Brain", href: "/ai-brain" }]
  }
  return [{ label: "Open Studio", href: "/studio" }, { label: "Open Projects", href: "/projects" }]
}

const ResourceLibrary: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedResource = getResourceById(searchParams.get("resource"))
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState("All")
  const [selectedPathId, setSelectedPathId] = React.useState("")
  const [completedResources, setCompletedResources] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try {
      return normalizeResourceProgress(JSON.parse(window.localStorage.getItem(RESOURCE_PROGRESS_STORAGE_KEY) || "[]"))
    } catch {
      return []
    }
  })

  React.useEffect(() => {
    try {
      window.localStorage.setItem(RESOURCE_PROGRESS_STORAGE_KEY, JSON.stringify(completedResources))
    } catch {
      // Private browsing or storage policy may block persistence; in-session progress still works.
    }
  }, [completedResources])

  const categories = React.useMemo(
    () => ["All", ...Array.from(new Set(RESOURCE_LIBRARY_ENTRIES.map((resource) => resource.category)))],
    [],
  )

  const filteredResources = React.useMemo(
    () => searchResourceLibrary(query, { category, learningPathId: selectedPathId || undefined }),
    [category, query, selectedPathId],
  )

  const selectedResource =
    requestedResource && filteredResources.some((resource) => resource.id === requestedResource.id)
      ? requestedResource
      : filteredResources[0] || null

  const selectResource = (resourceId: string) => {
    const next = new URLSearchParams(searchParams)
    next.set("resource", resourceId)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="vt-resource-library-page" style={{ ...canonicalSpectrumStyle, ...getResourcePaletteStyle(selectedResource?.accentPaletteIndex ?? 8) }}>
      <ToolboxScaffold
        title="RESOURCE LIBRARY"
        subtitle="Source-grounded creator references, guides, playbooks and reusable learning resources."
        icon={<BookOpenText />}
        paletteIndex={8}
        collapsible={false}
        contentClassName="vt-resource-library-shell"
        helpText="Browse creator-facing references. Each document is stored as canonical Markdown and rendered through ViewTube Toolbox/SubToolbox primitives."
      >
        <section className="vt-resource-library-overview" aria-label="Resource Library overview">
          <div className="vt-resource-overview-module">
            <span>LIBRARY</span>
            <strong>{RESOURCE_LIBRARY_ENTRIES.length}</strong>
            <small>published resource{RESOURCE_LIBRARY_ENTRIES.length === 1 ? "" : "s"}</small>
          </div>
          <div className="vt-resource-overview-module">
            <span>FORMAT</span>
            <strong>MD</strong>
            <small>canonical editable source</small>
          </div>
          <div className="vt-resource-overview-module">
            <span>DESIGN</span>
            <strong>VT UI</strong>
            <small>Toolbox document renderer</small>
          </div>
          <div className="vt-resource-overview-module">
            <span>FIRST SERIES</span>
            <strong>15</strong>
            <small>creator references planned</small>
          </div>
        </section>

        <section className="vt-resource-learning-paths" aria-labelledby="vt-resource-paths-title">
          <div className="vt-resource-section-heading">
            <div>
              <span>GUIDED LEARNING</span>
              <h2 id="vt-resource-paths-title">Choose an outcome</h2>
            </div>
            <button type="button" className={`vt-resource-path-reset ${selectedPathId ? "" : "is-active"}`}
              onClick={() => setSelectedPathId("")} aria-pressed={!selectedPathId}>All resources</button>
          </div>
          <div className="vt-resource-path-grid">
            {RESOURCE_LEARNING_PATHS.map((path, pathIndex) => {
              const completedCount = path.resourceIds.filter((id) => completedResources.includes(id)).length
              const active = selectedPathId === path.id
              return (
                <button key={path.id} type="button"
                  className={`vt-resource-path-card ${active ? "is-active" : ""}`}
                  style={getResourcePaletteStyle(pathIndex % 12)}
                  onClick={() => {
                    setSelectedPathId(active ? "" : path.id)
                    setCategory("All")
                    setQuery("")
                  }}
                  aria-pressed={active}>
                  <span className="vt-resource-path-meta">{path.level} · {path.resourceIds.length} guides</span>
                  <strong>{path.title}</strong>
                  <span className="vt-resource-path-description">{path.description}</span>
                  <span className="vt-resource-path-outcome">{path.outcome}</span>
                  <span className="vt-resource-path-progress">
                    <span><i style={{ width: `${(completedCount / path.resourceIds.length) * 100}%` }} /></span>
                    <small>{completedCount} of {path.resourceIds.length} completed</small>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="vt-resource-library-layout">
          <aside className="vt-resource-library-index">
            <SubToolbox
              title="RESOURCE INDEX"
              icon={<Search />}
              isOpenInitial
              unmountOnClose={false}
              contentClassName="vt-resource-index-content"
              persistenceId="resource-library:index"
              helpText="Search by creator question, task, topic, or metric. Select a learning path to narrow the index."
            >
              <label className="vt-resource-search-field">
                <span>SEARCH</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="e.g. why am I not getting views?"
                />
              </label>

              <label className="vt-resource-filter-field">
                <span>CATEGORY</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <div className="vt-resource-index-results">
                {selectedPathId ? (
                  <div className="vt-resource-active-path">
                    <strong>{RESOURCE_LEARNING_PATHS.find((path) => path.id === selectedPathId)?.title}</strong>
                    <button type="button" onClick={() => setSelectedPathId("")}>Clear path</button>
                  </div>
                ) : null}
                {filteredResources.map((resource) => {
                  const active = selectedResource?.id === resource.id
                  return (
                    <button
                      key={resource.id}
                      type="button"
                      className={`vt-resource-card ${active ? "is-active" : ""}`}
                      style={getResourcePaletteStyle(resource.accentPaletteIndex)}
                      onClick={() => selectResource(resource.id)}
                      aria-pressed={active}
                    >
                      <div className="vt-resource-card-icon"><FileText aria-hidden="true" /></div>
                      <div className="vt-resource-card-copy">
                        <span>{resource.category}</span>
                        <strong>{resource.shortTitle}</strong>
                        <small>{resource.readTime} · {resource.difficulty}</small>
                        {completedResources.includes(resource.id) ? <em className="vt-resource-complete-mark">COMPLETED</em> : null}
                      </div>
                    </button>
                  )
                })}

                {filteredResources.length === 0 ? (
                  <div className="vt-resource-empty">
                    <Sparkles aria-hidden="true" />
                    <strong>No matching resources</strong>
                    <span>Clear the search or choose another category.</span>
                  </div>
                ) : null}
              </div>
            </SubToolbox>
          </aside>

          <main className="vt-resource-library-reader">
            {selectedResource ? (
              <>
                <div className="vt-resource-reader-actions">
                  <button type="button"
                    className={`vt-resource-completion-toggle ${completedResources.includes(selectedResource.id) ? "is-complete" : ""}`}
                    onClick={() => setCompletedResources((current) => current.includes(selectedResource.id)
                      ? current.filter((id) => id !== selectedResource.id)
                      : [...current, selectedResource.id])}
                    aria-pressed={completedResources.includes(selectedResource.id)}>
                    <span aria-hidden="true">{completedResources.includes(selectedResource.id) ? "✓" : "○"}</span>
                    {completedResources.includes(selectedResource.id) ? "Completed · mark for review" : "Mark guide complete"}
                  </button>
                  <span className="vt-resource-progress-note">Progress is saved in this browser when storage is available.</span>
                </div>
                <ResourceDocumentRenderer resource={selectedResource} />
                <section className="vt-resource-workflow-links" aria-labelledby="vt-resource-apply-title">
                  <div>
                    <span>PUT IT INTO PRACTICE</span>
                    <h2 id="vt-resource-apply-title">Apply in ViewTube</h2>
                    <p>Continue in a related workspace. These links open the workspace; they do not automatically copy guide content or change project data.</p>
                  </div>
                  <div className="vt-resource-workflow-link-row">
                    {getResourceWorkflowLinks(selectedResource).map((link) => (
                      <a key={link.href} href={link.href}>{link.label} <span aria-hidden="true">↗</span></a>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="vt-resource-empty vt-resource-empty--reader">
                <BookOpenText aria-hidden="true" />
                <strong>Select a resource</strong>
                <span>The document will open here without leaving the Resource Library.</span>
              </div>
            )}
          </main>
        </div>
      </ToolboxScaffold>
    </div>
  )
}

export default ResourceLibrary
