import { describe, expect, it, vi } from "vitest"
import {
 resolveCreatorContext,
 type CreatorContextResolverDependencies,
} from "../CreatorContextResolver"
import { DEFAULT_BRAIN_USER_CONTROLS } from "../BrainUserControls"

const profile = {
 channelId: "channel-1",
 personalizationEnabled: true,
 analyticsEnabled: true,
 knowledgeModel: null,
 toolContextPack: null,
 evidencePacket: null,
 nicheKnowledge: null,
 memoryClaims: [],
 loadedAt: "2026-09-26T10:00:00.000Z",
}

const knowledge = {
 records: [],
 contradictions: [],
 omitted: [],
 query: "title",
}

describe("CreatorContextResolver", () => {
 it("aggregates channel, project, style, surface and selection context behind one envelope", async () => {
  const deps: CreatorContextResolverDependencies = {
   readControls: () => ({ ...DEFAULT_BRAIN_USER_CONTROLS }),
   loadProfile: vi.fn(async () => profile),
   buildKnowledge: vi.fn(() => knowledge as any),
   resolveStyle: vi.fn(() => ({ id: "style-1", channelId: "channel-1" }) as any),
   buildProject: vi.fn(() => ({
    channelId: "channel-1",
    projectId: "project-1",
    contentBuildId: "content-1",
    title: "Austerlitz",
    topic: "Napoleonic history",
    format: "longform",
    plannedPublishAt: null,
    evidenceIds: ["asset-1", "asset-2"],
   })),
  }

  const result = await resolveCreatorContext({
   channelId: "channel-1",
   query: "Improve this title",
   projectId: "project-1",
   visibleContext: { contentBuildId: "content-1", title: "Austerlitz" },
   artifactRefs: ["asset-1", "asset-1", "asset-2"],
   assetType: "title",
   surface: {
    route: "/projects",
    projectId: "project-1",
    videoId: null,
    commentId: null,
    dateRange: null,
    capabilityIds: ["projects"],
    superToolIds: [],
    sourceOfTruth: ["Projects"],
    blockedCapabilities: [],
   },
   selection: {
    route: "/projects",
    sourceId: "project-1",
    label: "Austerlitz",
    projectId: "project-1",
    evidenceIds: ["asset-2", "selection-evidence"],
    updatedAt: "2026-09-26T10:01:00.000Z",
    locked: true,
   },
  }, deps)

  expect(result.version).toBe("vt-creator-context-v1")
  expect(result.channelId).toBe("channel-1")
  expect(result.profile?.channelId).toBe("channel-1")
  expect(result.channelKnowledge).toBe(knowledge)
  expect(result.styleProfile?.id).toBe("style-1")
  expect(result.project?.contentBuildId).toBe("content-1")
  expect(result.surface?.route).toBe("/projects")
  expect(result.selection?.sourceId).toBe("project-1")
  expect(result.selection?.locked).toBe(true)
  expect(result.evidenceRefs).toEqual(["asset-1", "asset-2", "selection-evidence"])
 })

 it("resolves the linked ContentBuild from the canonical Project snapshot", async () => {
  const canonicalProject = {
   id: "project-1",
   contentBuildId: "content-1",
   name: "Canonical Project",
   videoTitle: "Canonical title",
   status: "active",
   plan: { concept: "Project concept", niche: "history" },
  }
  const linkedBuild = {
   id: "content-1",
   legacyProjectId: "project-1",
   profile: { topic: "Canonical build topic", format: "long" },
  }

  const getContentBuild = vi.fn(() => linkedBuild as any)
  const buildProject = vi.fn((input: any) => ({
   channelId: input.channelId,
   projectId: input.project.id,
   contentBuildId: input.contentBuild.id,
   title: input.project.videoTitle,
   topic: input.contentBuild.profile.topic,
   format: input.contentBuild.profile.format,
   evidenceIds: input.artifactRefs,
  }))

  const deps: CreatorContextResolverDependencies = {
   readControls: () => ({ ...DEFAULT_BRAIN_USER_CONTROLS }),
   loadProfile: vi.fn(async () => profile),
   buildKnowledge: vi.fn(() => knowledge as any),
   resolveStyle: vi.fn(() => null),
   buildProject,
   getContentBuild,
  }

  const result = await resolveCreatorContext({
   channelId: "channel-1",
   query: "Plan this project",
   projectId: "project-1",
   project: canonicalProject as any,
   visibleContext: {
    contentBuildId: "stale-build",
    title: "Stale UI title",
    topic: "Stale UI topic",
   },
   artifactRefs: ["asset-1"],
  }, deps)

  expect(getContentBuild).toHaveBeenCalledWith("content-1")
  expect(buildProject).toHaveBeenCalledWith(expect.objectContaining({
   project: canonicalProject,
   contentBuild: linkedBuild,
  }))
  expect(result.project?.contentBuildId).toBe("content-1")
  expect(result.provenance.projectSource).toBe("canonical_project_content_build")
 })

 it("resolves the requested canonical project by exact ID when only projectId is passed", async () => {
  const indexedProject = {
   id: "project-target",
   contentBuildId: "content-target",
   name: "Indexed canonical project",
   videoTitle: "Target title",
   status: "active",
   plan: { concept: "Target concept", niche: "history" },
  }
  const linkedBuild = {
   id: "content-target",
   legacyProjectId: "project-target",
   stage: "package",
   profile: { topic: "Canonical indexed topic", format: "long" },
  }
  const buildProject = vi.fn((input: any) => ({
   channelId: input.channelId,
   projectId: input.project.id,
   contentBuildId: input.contentBuild.id,
   title: input.project.videoTitle,
   topic: input.contentBuild.profile.topic,
   format: input.contentBuild.profile.format,
   evidenceIds: input.artifactRefs,
  }))
  const deps: CreatorContextResolverDependencies = {
   readControls: () => ({ ...DEFAULT_BRAIN_USER_CONTROLS }),
   loadProfile: vi.fn(async () => profile),
   buildKnowledge: vi.fn(() => knowledge as any),
   resolveStyle: vi.fn(() => null),
   buildProject,
   getContentBuild: vi.fn(() => linkedBuild as any),
  }

  const result = await resolveCreatorContext({
   channelId: "channel-1",
   query: "Continue this project",
   projectId: "project-target",
   projects: [indexedProject as any, { id: "other-project", name: "Not this project" } as any],
   visibleContext: { projectId: "project-target", title: "Stale visible title" },
  }, deps)

  expect(buildProject).toHaveBeenCalledWith(expect.objectContaining({
   project: indexedProject,
   contentBuild: linkedBuild,
   projectId: "project-target",
  }))
  expect(result.project?.title).toBe("Target title")
  expect(result.provenance.projectSource).toBe("canonical_project_content_build")
 })

 it("honors creator controls instead of reconstructing disabled personalization or project context", async () => {
  const deps: CreatorContextResolverDependencies = {
   readControls: () => ({
    ...DEFAULT_BRAIN_USER_CONTROLS,
    personalization: false,
    allowProjects: false,
   }),
   loadProfile: vi.fn(async () => ({ ...profile, personalizationEnabled: false })),
   buildKnowledge: vi.fn(() => knowledge as any),
   resolveStyle: vi.fn(() => ({ id: "style-1" }) as any),
   buildProject: vi.fn(() => ({ projectId: "project-1" }) as any),
  }

  const result = await resolveCreatorContext({
   channelId: "channel-1",
   query: "What should I make?",
   projectId: "project-1",
   visibleContext: { title: "private project" },
  }, deps)

  expect(result.channelKnowledge).toBeNull()
  expect(result.styleProfile).toBeNull()
  expect(result.project).toBeNull()
  expect(deps.buildKnowledge).not.toHaveBeenCalled()
  expect(deps.resolveStyle).not.toHaveBeenCalled()
  expect(deps.buildProject).not.toHaveBeenCalled()
 })

 it("avoids channel-scoped reads when no channel is active", async () => {
  const deps: CreatorContextResolverDependencies = {
   readControls: () => ({ ...DEFAULT_BRAIN_USER_CONTROLS }),
   loadProfile: vi.fn(async () => profile),
   buildKnowledge: vi.fn(() => knowledge as any),
   resolveStyle: vi.fn(() => ({ id: "style-1" }) as any),
   buildProject: vi.fn(() => null),
  }

  const result = await resolveCreatorContext({
   channelId: null,
   query: "Help me plan",
  }, deps)

  expect(result.channelId).toBeNull()
  expect(result.profile).toBeNull()
  expect(result.channelKnowledge).toBeNull()
  expect(result.styleProfile).toBeNull()
  expect(deps.loadProfile).not.toHaveBeenCalled()
 })
 it("does not borrow visible context from a different or unidentified project", async () => {
  const buildProject = vi.fn((input: any) => ({
   channelId: input.channelId,
   projectId: input.projectId,
   title: input.visibleContext?.title || null,
   topic: input.visibleContext?.topic || null,
   evidenceIds: input.artifactRefs || [],
  }))
  const deps: CreatorContextResolverDependencies = {
   readControls: () => ({ ...DEFAULT_BRAIN_USER_CONTROLS }),
   loadProfile: vi.fn(async () => profile),
   buildKnowledge: vi.fn(() => knowledge as any),
   resolveStyle: vi.fn(() => null),
   buildProject,
  }

  await resolveCreatorContext({
   channelId: "channel-1",
   query: "Plan active project",
   projectId: "project-active",
   project: { id: "project-stale", name: "Stale project" } as any,
   visibleContext: { projectId: "project-stale", title: "Wrong project title", topic: "Wrong topic" },
  }, deps)
  expect(buildProject).toHaveBeenCalledWith(expect.objectContaining({ visibleContext: null, project: null }))

  await resolveCreatorContext({
   channelId: "channel-1",
   query: "Plan active project",
   projectId: "project-active",
   visibleContext: { title: "Unscoped stale title", topic: "Unscoped stale topic" },
  }, deps)
  expect(buildProject).toHaveBeenLastCalledWith(expect.objectContaining({ visibleContext: null }))
 })


 it("includes the channel-scoped creator answers in the resolved context envelope", async () => {
  const creatorAnswers = {
   channelDescription: "Documentaries about overlooked history",
   mainTopicFocus: "Military history",
   audienceDescription: "Curious adult learners",
   successDefinition: "Grow returning viewers",
   mainYoutubeGoal: "Increase returning viewers",
   recurringSeriesName: "History in Motion",
   recurringSeriesDescription: "One turning point per episode",
   biggestWeakness: "Inconsistent publishing",
   mostSuccessfulVideo: "The Siege of Vienna",
   signupReason: "Improve channel decisions",
   whatNext: "Grow returning viewers",
   primaryGoal: "views",
   audienceNiche: "Military history",
   oneMonthGoals: [],
   completedAt: "2026-10-28T00:00:00.000Z",
   deferredAt: null,
   updatedAt: "2026-10-28T00:00:00.000Z",
   source: "wizard",
   version: 2,
   channelContext: {
    identity: { name: "History Channel", niche: "Military history" },
    goals: { primaryGoal: "Increase returning viewers" },
    audience: { idealViewer: "Curious adult learners" },
    content: {}, brand: {}, intelligence: {},
   },
  }
  const deps: CreatorContextResolverDependencies = {
   readControls: () => ({ ...DEFAULT_BRAIN_USER_CONTROLS }),
   loadProfile: vi.fn(async () => profile),
   loadCreatorAnswers: vi.fn(() => creatorAnswers as any),
   buildKnowledge: vi.fn(() => knowledge as any),
   resolveStyle: vi.fn(() => null),
   buildProject: vi.fn(() => null),
  }

  const result = await resolveCreatorContext({ channelId: "channel-1", query: "Plan next upload" }, deps)

  expect(result.creatorAnswers?.channelContext.identity.niche).toBe("Military history")
  expect(result.creatorAnswers?.channelDescription).toBe("Documentaries about overlooked history")
  expect(deps.loadCreatorAnswers).toHaveBeenCalledWith("channel-1")
 })

})