import { describe, expect, it, vi } from "vitest"
import {
  buildMetadataHistoryEvents,
  diffMetadataPackageFields,
  type MetadataHistoryOperation,
} from "./metadataHistory"
import { createEmptyMetadataMasterPackage } from "./metadataMaster"

describe("metadata history foundation", () => {
  it("records field-level previous and next values without treating an unchanged package as a change", () => {
    const previous = createEmptyMetadataMasterPackage({
      id: "package-1",
      contentBuildId: "build-1",
      projectId: "project-1",
      videoId: "video-1",
      title: "Old title",
      description: "Same description",
      tags: ["one"],
    })
    const next = {
      ...previous,
      version: 2,
      title: "New title",
      tags: ["one", "two"],
    }

    expect(diffMetadataPackageFields(previous, next)).toEqual([
      { field: "title", previousValue: "Old title", nextValue: "New title" },
      { field: "tags", previousValue: ["one"], nextValue: ["one", "two"] },
    ])
    expect(diffMetadataPackageFields(next, { ...next })).toEqual([])
  })

  it("builds a canonical ContentBuild event for a package version and its changed fields", () => {
    const previous = createEmptyMetadataMasterPackage({
      id: "package-1",
      contentBuildId: "build-1",
      projectId: "project-1",
      title: "Old title",
    })
    const next = {
      ...previous,
      version: 2,
      title: "New title",
    }

    const events = buildMetadataHistoryEvents({
      contentBuildId: "build-1",
      projectId: "project-1",
      videoId: "video-1",
      operation: "manual",
      actorType: "creator",
      operationId: "operation-1",
      previousPackage: previous,
      package: next,
      timestamp: "2026-10-13T22:00:00.000Z",
    })

    expect(events).toHaveLength(2)
    expect(events[0]).toMatchObject({
      contentBuildId: "build-1",
      eventType: "package.versioned",
      entityType: "metadata-package",
      entityId: "package-1",
      actorType: "creator",
      toolId: "metadata-master",
      timestamp: "2026-10-13T22:00:00.000Z",
      previousState: expect.objectContaining({ title: "Old title" }),
      resultingState: expect.objectContaining({ title: "New title", version: 2 }),
      metadata: expect.objectContaining({
        projectId: "project-1",
        videoId: "video-1",
        operation: "manual",
        operationId: "operation-1",
      }),
    })
    expect(events[1]).toMatchObject({
      eventType: "title.changed",
      entityType: "metadata-field",
      entityId: "title",
      previousState: "Old title",
      resultingState: "New title",
      metadata: expect.objectContaining({ packageId: "package-1", operationId: "operation-1" }),
    })
  })

  it("marks initial package creation and selected candidates without inventing a previous state", () => {
    const pkg = createEmptyMetadataMasterPackage({
      id: "package-2",
      contentBuildId: "build-2",
      title: "Generated title",
    })
    const events = buildMetadataHistoryEvents({
      contentBuildId: "build-2",
      operation: "generated",
      actorType: "brain",
      operationId: "operation-2",
      package: pkg,
      timestamp: "2026-10-13T22:01:00.000Z",
    })

    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      eventType: "package.created",
      previousState: undefined,
      resultingState: expect.objectContaining({ title: "Generated title" }),
      metadata: expect.objectContaining({ operation: "generated", operationId: "operation-2" }),
    })

    const selected = buildMetadataHistoryEvents({
      contentBuildId: "build-2",
      operation: "selected",
      actorType: "creator",
      operationId: "operation-3",
      package: pkg,
      timestamp: "2026-10-13T22:02:00.000Z",
    })
    expect(selected[0]).toMatchObject({
      eventType: "metadata.selected",
      metadata: expect.objectContaining({ operation: "selected", operationId: "operation-3" }),
    })
  })

  it("does not create a private history store; event records target the canonical ContentBuild stream", () => {
    const pkg = createEmptyMetadataMasterPackage({
      id: "package-3",
      contentBuildId: "build-3",
      title: "History title",
    })
    const events = buildMetadataHistoryEvents({
      contentBuildId: "build-3",
      operation: "generated" satisfies MetadataHistoryOperation,
      package: pkg,
    })
    expect(events.every(event => event.contentBuildId === "build-3")).toBe(true)
    expect(events.every(event => event.toolId === "metadata-master")).toBe(true)
  })
})
