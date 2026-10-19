import "fake-indexeddb/auto"
import { describe, expect, it } from "vitest"
import type { CreatorBrainLearningQuestion, CreatorBrainResponse } from "../../types"
import {
 answerAIBrainQuestionModule,
 reconcileBrainLearningQuestions,
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

 it("keeps creator-facing copy clear of internal data plumbing language", () => {
  const clean = sanitizeCreatorFacingBrainCopy("VT-SYNC sync bundle failed through the API diagnostics manifest.")

  expect(clean).not.toMatch(/VT-SYNC|sync bundle|failed|API|diagnostics|manifest/i)
  expect(clean).toMatch(/channel data|data areas|incomplete|notes|summary/i)
 })
})
