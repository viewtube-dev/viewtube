import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8");

describe("Vault and Studio Hub shared Studio Controls migration", () => {
  it("uses the canonical split-left input for Vault asset search", () => {
    const vault = read("src/views/CreatorVaultOS.tsx");
    expect(vault).toContain("<StudioSplitLeftInput");
    expect(vault).toContain('aria-label="Search Vault assets"');
    expect(vault).toContain('placeholder="Search assets…"');
    expect(vault).toContain("ref={searchInputRef}");
    expect(vault).not.toContain("SubToolboxSplitField");
    const styles = read("src/styles/subtoolbox-system.css");
    expect(styles).toContain('[data-vault-search-row] [data-vt-studio-username-input="true"]');
    expect(styles).not.toContain(".vault-library-search-field");
  });

  it("uses the canonical upload frame for Vault multi-file staging", () => {
    const vault = read("src/views/CreatorVaultOS.tsx");
    expect(vault).toContain("<StudioUploadFrame");
    expect(vault).toContain("multiple");
    expect(vault).toContain("onFilesChange={(files) => { void stageFiles(files) }}");
    expect(vault).not.toContain("SubToolboxFileTarget");
  });

  it("uses single-select mode for Vault Sort, View, and State", () => {
    const vault = read("src/views/CreatorVaultOS.tsx");
    const controls = read("src/studio-ui/primitives/StudioControls.tsx");
    expect(controls).toContain('selectionMode?: "single" | "multiple"');
    expect(vault.match(/selectionMode="single"/g)).toHaveLength(3);
    expect(controls).toContain("setSelected([option.value])");
  });

  it("uses canonical split-left search and upload specimens in Studio Hub", () => {
    const complete = read("src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx");
    const migration = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx");
    expect(complete).toContain('if (name === "Split Search")');
    expect(complete).toContain("<StudioSplitLeftInput");
    expect(complete).toContain("<StudioUploadFrame");
    expect(complete).not.toContain("SubToolboxFileTarget");
    const splitSearch = migration.slice(migration.indexOf('if (name === "Split Search")'), migration.indexOf('if (name === "Input Action")'));
    expect(splitSearch).toContain("<StudioSplitLeftInput");
    expect(migration).toContain('return <StudioUploadFrame');
    expect(migration).not.toContain("SubToolboxFileTarget");
  });

  it("uses the canonical split-left input for the Project Kanban search sibling", () => {
    const projects = read("src/components/projects/ProjectKanbanWorkspace.tsx");
    expect(projects).toContain("<StudioSplitLeftInput");
    expect(projects).not.toContain("SubToolboxSplitField");
  });
});
