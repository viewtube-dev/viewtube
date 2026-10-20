import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { BrainQuestionPrompt } from "./BrainQuestionPrompt"
import type { CreatorBrainLearningQuestion } from "../../types"

const contentStyleQuestion: CreatorBrainLearningQuestion = {
 id: "question-style-1",
 question: "What style should the next video use?",
 reason: "Tailor future drafts to the creator.",
 category: "content_style",
 confidence: "medium",
}

describe("BrainQuestionPrompt text ownership", () => {
 it("attaches question copy and style options to the named prompt composition", () => {
  const html = renderToStaticMarkup(
   <BrainQuestionPrompt question={contentStyleQuestion} onAnswer={() => undefined} />,
  )

  expect(html).toContain('data-vt-brain-component="BrainQuestionPrompt"')
  expect(html).toContain('data-vt-brain-question-category="content_style"')
  expect(html).toContain('data-vt-brain-part="question-heading"')
  expect(html).toContain('data-vt-brain-part="question-copy"')
  expect(html).toContain('data-vt-brain-part="question-answer-options"')
  expect(html).toContain('data-vt-brain-part="free-text-answer"')
  expect(html).toContain("Practical")
  expect(html).toContain("Cinematic")
  expect(html).toContain('data-vt-studio-button="true"')
  expect(html).not.toContain("What topic or working video title")
 })

 it("keeps a required topic/title question separate from content-style choices", () => {
  const topicQuestion: CreatorBrainLearningQuestion = {
   id: "question-direction-1",
   question: "What topic or working video title should these drafts be about?",
   reason: "A subject is required before drafts can be prepared.",
   category: "preference",
   confidence: "high",
  }
  const html = renderToStaticMarkup(
   <BrainQuestionPrompt question={topicQuestion} onAnswer={() => undefined} />,
  )

  expect(html).toContain("What topic or working video title should these drafts be about?")
  expect(html).not.toContain("Practical")
  expect(html).not.toContain("Cinematic")
 })
})
