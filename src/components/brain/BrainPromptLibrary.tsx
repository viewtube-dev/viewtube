import React, { useMemo, useState } from "react"
import { ArrowRight, LayoutGrid, Minus, Plus, Send } from "lucide-react"
import {
  StudioCollapsingTwoLineModule,
  StudioDropdown,
  StudioInterModule,
  StudioSplitTwoLineButton,
  StudioTextInput,
} from "../../studio-ui"
import { TOOLBOX_PALETTE } from "../../styles/toolboxPalette"
import type { CreatorBrainPromptCard } from "../../types"
import "./brain-tool-surface.css"

/** Short creator-facing summaries used in collapsed prompt rows and search. */
const PROMPT_CARD_SUMMARIES: Record<string, string> = {
  "analyze-channel-niche": "Find your niche and fuzzy edges.",
  "niche-growth-ideas": "Choose adjacent topics that still fit.",
  "analyze-formats": "Compare views, retention, and revenue.",
  "seo-script-drafter": "Draft a concept, hook, description, and tags.",
  "format-strategy": "Plan five repeatable uploads.",
  "clarify-channel-goals": "Confirm goals, audience, and direction.",
  "revenue-levers": "Find practical 30-day revenue moves.",
  "audience-language": "Identify audience interests and wording.",
  "why-views-changed": "Diagnose momentum and choose three moves.",
  "best-video-autopsy": "Explain and replicate your best video.",
  "title-thumbnail-test": "Create the next title and thumbnail test.",
  "daily-oracle": "Get today’s priority, quick win, and action.",
  "pinned-comments": "Engagement pinned comments for your top 10 videos.",
  "ten-video-ideas": "10 new titles and topics from your best long-form.",
  "shorts-funnel-plan": "Turn Shorts viewers into subscribers and long-form watch time.",
  "shorts-from-longform": "Find the best Short moments in your long-form videos.",
  "metric-correlations": "See what drives success across your metrics.",
  "uploader-assets": "Optimized title, description, and tags for your next video.",
  "thumbnail-brief": "A fresh, on-brand thumbnail concept for your next video.",
}

export type PromptCardSummaryFn = (card: CreatorBrainPromptCard) => string

export const promptCardSummary: PromptCardSummaryFn = (card) =>
  PROMPT_CARD_SUMMARIES[card.id] || card.prompt

const PROMPT_MODULE_COLOR_PAIRS = Array.from({ length: 12 }, (_, index) => [
  TOOLBOX_PALETTE[index],
  TOOLBOX_PALETTE[(index + 4) % TOOLBOX_PALETTE.length],
] as const)

export const filterCreatorBrainPromptCards = (
  cards: CreatorBrainPromptCard[],
  query: string,
  category = "all",
  summarize: PromptCardSummaryFn = promptCardSummary,
): CreatorBrainPromptCard[] => {
  const normalized = query.trim().toLowerCase()
  return cards.filter((card) => {
    if (category !== "all" && card.category !== category) return false
    if (!normalized) return true
    return [card.label, card.prompt, summarize(card), card.category, card.id].some((value) =>
      value.toLowerCase().includes(normalized),
    )
  })
}

export type BrainPromptLibraryProps = {
  cards: CreatorBrainPromptCard[]
  busy?: boolean
  headingId?: string
  onPrompt: (prompt: string, card?: CreatorBrainPromptCard) => void
  onEdit?: (prompt: string, card?: CreatorBrainPromptCard) => void
  /** Optional; pass `promptCardSummary` from AIBrainCommandInterface for richer blurbs */
  summarize?: PromptCardSummaryFn
}

/**
 * Prompt Library — extracted + Studio tool-surface layout.
 * Sticky filters, scrollable category modules, compact actions.
 */
export const BrainPromptLibrary: React.FC<BrainPromptLibraryProps> = ({
  cards,
  busy = false,
  headingId = "brain-prompt-library-title",
  onPrompt,
  onEdit,
  summarize = promptCardSummary,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const allCategories = useMemo(
    () => Array.from(new Set(cards.map((card) => card.category || "general"))),
    [cards],
  )
  const [openCategories, setOpenCategories] = useState<string[]>(() => allCategories)

  const filteredCards = useMemo(
    () => filterCreatorBrainPromptCards(cards, query, category, summarize),
    [cards, query, category, summarize],
  )

  const groupedCards = useMemo(() => {
    const groups = new Map<string, CreatorBrainPromptCard[]>()
    filteredCards.forEach((card) => {
      const key = card.category || "general"
      groups.set(key, [...(groups.get(key) || []), card])
    })
    const order = new Map(cards.map((card, index) => [card.id, index]))
    return Array.from(groups.entries())
      .map(
        ([key, items]) =>
          [key, [...items].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))] as const,
      )
      .sort(
        ([, left], [, right]) =>
          Math.min(...left.map((card) => order.get(card.id) ?? 0)) -
          Math.min(...right.map((card) => order.get(card.id) ?? 0)),
      )
  }, [filteredCards, cards])

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "All categories" },
      ...allCategories.map((item) => ({
        value: item,
        label: item.replace(/[-_]/g, " "),
      })),
    ],
    [allCategories],
  )

  const setCategoryOpen = (groupCategory: string, nextOpen: boolean) => {
    setOpenCategories((current) =>
      nextOpen
        ? current.includes(groupCategory)
          ? current
          : [...current, groupCategory]
        : current.filter((item) => item !== groupCategory),
    )
  }

  return (
    <section
      data-vt-brain-component="BrainPromptLibrary"
      aria-label="Prompt library"
      aria-labelledby={headingId}
      aria-busy={busy || undefined}
      className="vt-brain-tool-surface"
    >
      <div className="vt-brain-tool-surface__header">
        <StudioInterModule
          sizeVariant="standard"
          startIcon={<LayoutGrid aria-hidden="true" />}
          title={<span data-vt-brain-part="prompt-library-title" id={headingId}>Prompt Library</span>}
          className="overflow-hidden brain-prompt-library-shell min-w-0"
          style={
            {
              background: TOOLBOX_PALETTE[11],
              "--vt-studio-control-accent": TOOLBOX_PALETTE[11],
              "--vt-studio-control-secondary": TOOLBOX_PALETTE[3],
            } as React.CSSProperties
          }
        >
          <p
            data-vt-brain-part="prompt-library-description"
            className="text-[10px] font-bold leading-4 text-black/65"
          >
            Search or filter by category, expand a prompt, then send it to chat or edit it in the composer.
          </p>
        </StudioInterModule>
      </div>

      <div className="vt-brain-tool-surface__filters">
        <div className="vt-brain-tool-surface__filters-row is-split">
          <StudioTextInput
            type="search"
            sizeVariant="compact"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search prompts…"
            className="w-full min-w-0"
            aria-label="Search prompt library"
          />
          <StudioDropdown
            sizeVariant="compact"
            value={category}
            options={categoryOptions}
            onChange={(next) => setCategory(String(next))}
            aria-label="Filter by category"
            className="min-w-0 w-full"
          />
        </div>
      </div>

      <p className="vt-brain-tool-surface__meta" role="status" aria-live="polite">
        {filteredCards.length} of {cards.length} prompts
      </p>

      <div className="vt-brain-tool-surface__list" data-vt-brain-part="prompt-library-list">
        {groupedCards.map(([groupCategory, groupCards]) => {
          const groupOpen = openCategories.includes(groupCategory) || Boolean(query.trim())
          return (
            <StudioInterModule
              key={groupCategory}
              data-vt-brain-component="BrainPromptLibraryModule"
              data-vt-brain-part="prompt-category-module"
              data-prompt-category={groupCategory}
              sizeVariant="compact"
              title={<span className="uppercase">{groupCategory.replace(/[-_]/g, " ")}</span>}
              className="min-w-0 overflow-hidden"
              open={groupOpen}
              onOpenChange={(next) => setCategoryOpen(groupCategory, next)}
            >
              {groupCards.map((card) => {
                const isSelected = selectedId === card.id
                const promptIndex = Math.max(0, cards.findIndex((item) => item.id === card.id))
                const colorPair = PROMPT_MODULE_COLOR_PAIRS[promptIndex % PROMPT_MODULE_COLOR_PAIRS.length]
                return (
                  <StudioCollapsingTwoLineModule
                    key={card.id}
                    data-vt-brain-part="prompt-collapsible-module"
                    className="brain-prompt-library-prompt"
                    data-prompt-id={card.id}
                    data-flush-body="true"
                    title={card.label}
                    description={summarize(card)}
                    startIcon={<LayoutGrid aria-hidden="true" />}
                    endIcon={isSelected ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
                    sizeVariant="compact"
                    style={
                      {
                        background: colorPair[0],
                        "--vt-studio-control-accent": colorPair[0],
                        "--vt-studio-control-secondary": colorPair[1],
                      } as React.CSSProperties
                    }
                    open={isSelected}
                    onOpenChange={(nextOpen) => setSelectedId(nextOpen ? card.id : null)}
                    aria-label={`${isSelected ? "Collapse" : "Expand"} ${card.label} prompt`}
                  >
                    <div className="grid min-w-0 gap-2 bg-white px-2 py-2">
                      <p
                        data-vt-brain-part="prompt-complete-text"
                        className="whitespace-pre-wrap text-xs font-bold leading-4 [overflow-wrap:anywhere]"
                      >
                        {card.prompt}
                      </p>
                      <div
                        data-vt-brain-part="prompt-actions"
                        className={`vt-brain-tool-surface__actions ${onEdit ? "is-pair" : ""}`}
                      >
                        {onEdit ? (
                          <StudioSplitTwoLineButton
                            sizeVariant="compact"
                            icon={<ArrowRight aria-hidden="true" />}
                            firstLine="EDIT"
                            secondLine="FIRST"
                            className="min-w-0 w-full"
                            style={
                              {
                                "--vt-studio-control-accent": colorPair[1],
                                "--vt-studio-control-secondary": colorPair[0],
                              } as React.CSSProperties
                            }
                            onClick={(event) => {
                              event.stopPropagation()
                              onEdit(card.prompt, card)
                              setSelectedId(null)
                            }}
                          />
                        ) : null}
                        <StudioSplitTwoLineButton
                          sizeVariant="compact"
                          icon={<Send aria-hidden="true" />}
                          firstLine="SEND TO"
                          secondLine="CHAT"
                          disabled={busy}
                          className="min-w-0 w-full"
                          style={
                            {
                              "--vt-studio-control-accent": colorPair[0],
                              "--vt-studio-control-secondary": colorPair[1],
                            } as React.CSSProperties
                          }
                          onClick={(event) => {
                            event.stopPropagation()
                            onPrompt(card.prompt, card)
                            setSelectedId(null)
                          }}
                        />
                      </div>
                    </div>
                  </StudioCollapsingTwoLineModule>
                )
              })}
            </StudioInterModule>
          )
        })}
        {!filteredCards.length ? (
          <p className="border-2 border-black bg-white p-3 text-xs font-bold text-black/60">
            No prompts match these filters. Try another search or choose All categories.
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default BrainPromptLibrary
