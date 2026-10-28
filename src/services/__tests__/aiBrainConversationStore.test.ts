import "fake-indexeddb/auto"
import { describe, expect, it } from "vitest"
import type { AIBrainQuestionAnswer, CreatorBrainLearningQuestion, CreatorBrainResponse } from "../../types"
import {
 answerAIBrainQuestionModule,
 recordAIBrainTurnInteraction,
 getAIBrainConversationTurn,
 reconcileBrainLearningQuestions,
 retryAIBrainTurn,
 beginAIBrainTurn,
 completeAIBrainTurn,
 listAIBrainConversationTurns,
 resumeAIBrainThread,
 saveAIBrainConversationTurn,
 sanitizeCreatorFacingBrainCopy,
} from "../aiBrainConversationStore"

const responseFixture: CreatorBrainResponse = {
 id: "response-1",
 mode: "strategy_brief",
 headline: "Strategy Brief",
 keyInsight: "Improve one title and thumbnail around the clearest viewer promise.",
 body: "Build the next upload around one clear viewer promise.",
 evidenceIds: [],
 evidenceChips: [],
 sections: [],
 modules: [
  {
   id: "what-to-do-next",
   title: "What To Do Next",
   body: "Rewrite the next upload title around one concrete viewer payoff.",
   tone: "yellow",
   source: "growth",
  },
 ],
 actions: ["Rewrite the title."],
 learningSummary: "The Brain learned the creator wants practical growth steps.",
 questions: [],
 confidence: "medium",
}

const questionFixture: CreatorBrainLearningQuestion = {
 id: "primary-goal",
 question: "Which result matters most this month: views, subscribers, revenue, watch time, consistency, or a better creative workflow?",
 reason: "A goal priority makes recommendations sharper.",
 category: "creator_goal",
 confidence: "medium",
}

describe("aiBrainConversationStore", () => {
 it("preserves original and latest retry model-input snapshots through fallback completion and thread restore", async () => {
  const pending = await beginAIBrainTurn({
   channelId: "channel-evidence-continuity",
   userText: "Why did my latest upload underperform?",
   metadata: { source: "brain_orchestrator" },
  })
  const originalSnapshot = {
   systemInstruction: "Original system instruction with analytics evidence.",
   history: [{ role: "user", content: "Earlier creator question" }],
   userText: "Why did my latest upload underperform?",
   evidenceRecords: [{ id: "analytics-evidence-original", metric: "views", value: 1200 }],
   creatorAnswerEvidenceRecords: [{ id: "creator-answer-original", metric: "goal", value: "subscribers" }],
  }
  const retrySnapshot = {
   systemInstruction: "Retry system instruction with fresh evidence.",
   history: [{ role: "user", content: "Retry context" }],
   userText: "Why did my latest upload underperform?",
   evidenceRecords: [{ id: "analytics-evidence-retry", metric: "views", value: 900 }],
   creatorAnswerEvidenceRecords: [{ id: "creator-answer-retry", metric: "goal", value: "watch time" }],
  }

  await recordAIBrainTurnInteraction(pending.id, {
   type: "model_input_snapshot",
   direction: "outbound",
   detail: { modelInputSnapshot: originalSnapshot },
  })
  await recordAIBrainTurnInteraction(pending.id, {
   type: "retry_model_input_snapshot",
   direction: "outbound",
   detail: { modelInputSnapshot: retrySnapshot, retryEvidenceMode: "fresh" },
  })
  await completeAIBrainTurn({
   turnId: pending.id,
   status: "fallback",
   assistantText: "I couldn't finish the evidence-backed answer, but your turn is saved.",
   metadata: { fallbackReason: "provider_error" },
  })

  const saved = await getAIBrainConversationTurn(pending.id)
  const restored = await resumeAIBrainThread("channel-evidence-continuity")
  const restoredTurn = restored.turns.find((turn) => turn.id === pending.id)
  const interactionLog = saved?.metadata?.interactionLog as Array<Record<string, unknown>>

  expect(saved?.status).toBe("fallback")
  expect(saved?.metadata?.fallbackReason).toBe("provider_error")
  expect(saved?.metadata?.originalModelInputSnapshot).toEqual(originalSnapshot)
  expect(saved?.metadata?.latestRetryModelInputSnapshot).toEqual(retrySnapshot)
  expect(interactionLog.map((event) => event.type)).toContain("model_input_snapshot")
  expect(interactionLog.map((event) => event.type)).toContain("retry_model_input_snapshot")
  expect(interactionLog.map((event) => event.type)).toContain("assistant_response")
  expect(restoredTurn?.metadata?.originalModelInputSnapshot).toEqual(originalSnapshot)
  expect(restoredTurn?.metadata?.latestRetryModelInputSnapshot).toEqual(retrySnapshot)
 })
 it("persists a pending turn before generation and completes the same record", async () => {
  const pending = await beginAIBrainTurn({
   channelId: "channel-lifecycle",
   userText: "What should I publish next?",
  })
  expect(pending.status).toBe("pending")

  const completed = await completeAIBrainTurn({
   turnId: pending.id,
   status: "complete",
   assistantText: "Build the next upload around your strongest repeatable topic.",
   response: responseFixture,
  })
  const restored = await resumeAIBrainThread("channel-lifecycle")

  expect(completed.id).toBe(pending.id)
  expect(restored.thread.turnIds).toEqual([pending.id])
  expect(restored.turns[0]?.status).toBe("complete")
  expect(restored.turns[0]?.assistantText).toContain("strongest repeatable topic")
 })

 it("preserves the exact creator message separately from presentation copy", async () => {
  const original = "The API failed with an error — please keep those exact words."
  const pending = await beginAIBrainTurn({
   channelId: "channel-raw-message",
   userText: original,
  })

  expect(pending.rawUserMessage).toBe(original)
  expect(pending.userText).toBe(original)
  expect(pending.displayUserMessage).not.toContain("API");
  expect(pending.displayUserMessage).not.toContain("failed");
  expect(pending.displayUserMessage).not.toContain("error");

  const completed = await completeAIBrainTurn({
   turnId: pending.id,
   status: "complete",
   assistantText: "I preserved your original report.",
   response: responseFixture,
  });
  const restored = await resumeAIBrainThread("channel-raw-message");
  expect(restored.turns[0]?.rawUserMessage).toBe(original)
  expect(restored.turns[0]?.userText).toBe(original)
  expect(restored.turns[0]?.digest?.userIntent.toLowerCase()).toContain("api");
  expect(restored.turns[0]?.digest?.userIntent).toContain("failed");
  expect(restored.turns[0]?.digest?.userIntent).toContain("error");
  expect(completed.id).toBe(pending.id)
 })


 it("converts an abandoned pending turn into a saved interrupted response", async () => {
  const pending = await beginAIBrainTurn({
   channelId: "channel-interrupted",
   userText: "Analyze this upload",
  })

  const restored = await resumeAIBrainThread("channel-interrupted")
  const turn = restored.turns.find((item) => item.id === pending.id)

  expect(turn?.status).toBe("interrupted")
  expect(turn?.assistantText).toContain("interrupted")
 })

 it("persists and reloads Brain conversation turns by channel id", async () => {
  const saved = await saveAIBrainConversationTurn({
   channelId: "channel-a",
   userText: "How should I improve my next upload?",
   assistantText: "Improve the title promise and first 30 seconds.",
   response: responseFixture,
   answerModules: responseFixture.modules,
  })
  await saveAIBrainConversationTurn({
   channelId: "channel-b",
   userText: "Different channel",
   assistantText: "Different answer",
  })

  const turns = await listAIBrainConversationTurns({ channelId: "channel-a" })

  expect(turns.map((turn) => turn.id)).toContain(saved.id)
  expect(turns.every((turn) => turn.channelId === "channel-a")).toBe(true)
  expect(turns[0]?.answerModules[0]?.title).toBe("What To Do Next")
 })

 it("saves answered question modules as learning-backed conversation turns", async () => {
  const answer = await answerAIBrainQuestionModule({
   channelId: "channel-question",
   question: questionFixture,
   answer: "Subscribers and watch time matter most this month.",
  })
  const turns = await listAIBrainConversationTurns({ channelId: "channel-question" })

  expect(answer.learningEntryId).toBeTruthy()
  expect(turns[0]?.questionAnswers[0]?.answer).toContain("Subscribers")
  expect(turns[0]?.metadata?.source).toBe("question_module")
  expect(turns[0]?.metadata?.learningReceiptSnapshot).toMatchObject({
   entryId: answer.learningEntryId,
   status: "reflected",
   scope: "learning_ledger_not_durable",
  })
 })

 it("does not create a duplicate learning receipt when the same saved answer is submitted twice", async () => {
  const first = await answerAIBrainQuestionModule({
   channelId: "channel-idempotent-answer",
   question: questionFixture,
   answer: "Subscribers matter most this month.",
  })
  const second = await answerAIBrainQuestionModule({
   channelId: "channel-idempotent-answer",
   question: questionFixture,
   answer: "Subscribers matter most this month.",
  })
  const turns = await listAIBrainConversationTurns({ channelId: "channel-idempotent-answer" })

  expect(second.id).toBe(first.id)
  expect(turns.filter((turn) => turn.metadata?.source === "question_module")).toHaveLength(1)
 })

 it("does not re-propose a valid saved goal or style answer unless the creator reopens it", () => {
  const questions: CreatorBrainLearningQuestion[] = [
   questionFixture,
   { ...questionFixture, id: "content-style", question: "What should your videos feel like?", category: "content_style" },
   { ...questionFixture, id: "confirm-niche", question: "What niche name would you use?", category: "channel_fact" },
  ]
  const savedAnswers = [
   { id: "answer-goal", questionId: "older-goal-id", channelId: "channel-question", question: "What result matters most?", answer: "Subscribers", category: "creator_goal" as const, createdAt: "2026-10-01T00:00:00.000Z" },
   { id: "answer-style", questionId: "content-style", channelId: "channel-question", question: "What should your videos feel like?", answer: "Practical", category: "content_style" as const, createdAt: "2026-10-02T00:00:00.000Z" },
  ]

  expect(reconcileBrainLearningQuestions(questions, savedAnswers).map((question) => question.id)).toEqual(["confirm-niche"])
  expect(reconcileBrainLearningQuestions(questions, savedAnswers, ["primary-goal"]).map((question) => question.id)).toContain("primary-goal")
 })

 it("retries an interrupted turn using the same canonical turn ID and saved evidence metadata", async () => {
  const pending = await beginAIBrainTurn({
   channelId: "channel-retry",
   userText: "Which videos grew fastest?",
   metadata: { evidencePackSnapshot: { evidenceIds: ["video:abc"] }, dataReadinessSnapshot: { dataStatus: "partial" } },
  })
  await completeAIBrainTurn({
   turnId: pending.id,
   status: "interrupted",
   assistantText: "That response was interrupted.",
  })

  const retry = await retryAIBrainTurn(pending.id)
  const turns = await listAIBrainConversationTurns({ channelId: "channel-retry" })

  expect(retry.id).toBe(pending.id)
  expect(retry.status).toBe("pending")
  expect(retry.rawUserMessage).toBe("Which videos grew fastest?")
  expect(retry.metadata?.evidencePackSnapshot).toEqual({ evidenceIds: ["video:abc"] })
  expect(turns).toHaveLength(1)
 })

 it("restores the exact evidence request filters from the saved turn metadata", async () => {
  const requestSpec = {
   count: 10,
   formats: ["long", "live"],
   since: "2025-10-22",
   until: "2026-10-22",
   rankBy: "views",
   filters: ["tutorial", "beginner"],
   selectionMode: "top",
  }
  const pending = await beginAIBrainTurn({
   channelId: "channel-evidence-restore",
   userText: "Show 10 long-form and live videos from the last year about tutorials, ranked by views.",
   metadata: {
   evidencePackSnapshot: { evidenceIds: ["video:abc"], requestSpec },
   promptEvidenceRecordIds: ["analytics:snapshot-restore:channel_summary:views"],
   evidenceRecords: [{
    id: "analytics:snapshot-restore:channel_summary:views",
    owner: "analytics-canon",
    sourceRef: "channel_summary",
    sourceSnapshotId: "snapshot-restore",
    channelId: "channel-evidence-restore",
    metric: "views",
    value: 2800,
    unit: "count",
    observedAt: null,
    updatedAt: "2026-10-22T10:00:00.000Z",
    freshness: "fresh",
    epistemicState: "OBSERVED",
    availability: "available",
    provenance: { evidenceIds: ["source-evidence-1"], sourceRoute: "/analytics", sourceVersion: "canon-v1" },
   }],
   contextRevision: 7,
   creatorContextSnapshot: {
    version: "creator-context-v1",
    channelId: "channel-evidence-restore",
    project: null,
    selection: null,
    profileLoadedAt: null,
    styleProfileAvailable: false,
    styleProfile: null,
    knowledgeItems: [],
    conflictIds: [],
    evidenceRefs: ["source-evidence-1"],
    projectSource: null,
   },
  },
  })
  await completeAIBrainTurn({
   turnId: pending.id,
   status: "complete",
   assistantText: "Here is the requested evidence.",
   response: responseFixture,
  })

  const restored = await resumeAIBrainThread("channel-evidence-restore")

  expect(restored.turns).toHaveLength(1)
  expect(restored.turns[0]?.metadata?.evidencePackSnapshot).toMatchObject({
   evidenceIds: ["video:abc"],
   requestSpec,
  })
  expect(restored.turns[0]?.metadata?.promptEvidenceRecordIds).toEqual(["analytics:snapshot-restore:channel_summary:views"])
  expect(restored.turns[0]?.metadata?.evidenceRecords).toMatchObject([{
   id: "analytics:snapshot-restore:channel_summary:views",
   owner: "analytics-canon",
   sourceSnapshotId: "snapshot-restore",
   observedAt: null,
   updatedAt: "2026-10-22T10:00:00.000Z",
   provenance: { evidenceIds: ["source-evidence-1"], sourceVersion: "canon-v1" },
  }])
  expect(restored.turns[0]?.metadata?.contextRevision).toBe(7)
  expect(restored.turns[0]?.metadata?.creatorContextSnapshot).toMatchObject({
   version: "creator-context-v1",
   channelId: "channel-evidence-restore",
   evidenceRefs: ["source-evidence-1"],
  })
 })
 it("does not suppress a question when its saved answer is marked outdated", () => {
  const outdated: AIBrainQuestionAnswer = {
   id: "answer-outdated",
   questionId: questionFixture.id,
   channelId: "channel-question-outdated",
   question: questionFixture.question,
   answer: "Views",
   category: "creator_goal",
   createdAt: "2026-10-01T00:00:00.000Z",
   status: "outdated",
   statusReason: "Creator goal changed after a newer planning session.",
  }

  expect(reconcileBrainLearningQuestions([questionFixture], [outdated])).toEqual([questionFixture])
 })

 it("supersedes an older creator-goal answer when a new answer is saved", async () => {
  const channelId = "channel-question-supersede"
  const previous: AIBrainQuestionAnswer = {
   id: "answer-old-goal",
   questionId: "older-goal-question",
   channelId,
   question: "What result matters most?",
   answer: "Views",
   category: "creator_goal",
   createdAt: "2026-09-01T00:00:00.000Z",
   status: "confirmed",
  }
  const oldTurn = await saveAIBrainConversationTurn({
   channelId,
   userText: previous.answer,
   assistantText: "Saved your earlier goal.",
   questionAnswers: [previous],
   metadata: { source: "question_module" },
  })

  const newer = await answerAIBrainQuestionModule({
   channelId,
   question: questionFixture,
   answer: "Subscribers and watch time matter most this month.",
  })
  const turns = await listAIBrainConversationTurns({ channelId })
  const restoredOldTurn = turns.find((turn) => turn.id === oldTurn.id)
  const savedNewTurn = turns.find((turn) => turn.questionAnswers.some((answer) => answer.id === newer.id))

  expect(restoredOldTurn?.questionAnswers[0]).toMatchObject({
   status: "superseded",
   supersededByAnswerId: newer.id,
  })
  expect(savedNewTurn?.questionAnswers[0]).toMatchObject({
   id: newer.id,
   status: "confirmed",
  })
  expect(reconcileBrainLearningQuestions([questionFixture], turns.flatMap((turn) => turn.questionAnswers))).toEqual([])
 })

 it("keeps creator-facing copy clear of internal data plumbing language", () => {
  const clean = sanitizeCreatorFacingBrainCopy("VT-SYNC sync bundle failed through the API diagnostics manifest.")

  expect(clean).not.toMatch(/VT-SYNC|sync bundle|failed|API|diagnostics|manifest/i)
  expect(clean).toMatch(/channel data|data areas|incomplete|notes|summary/i)
 })
})
