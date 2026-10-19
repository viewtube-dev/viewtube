import React from "react"
import { CheckCircle, Plus, X } from "lucide-react"
import type { TagSuggestion } from "../../services/gemini"
import {
  SubToolboxRemovableTag,
  SubToolboxSelectableTag,
  SubToolboxTag,
} from "../subtoolbox/SubToolboxPrimitives"

export const getTagRankColor = (rank?: number): string => {
  if (typeof rank !== "number") return "#36E0F6"
  if (rank <= 10) return "#36E0F6"
  if (rank <= 20) return "#3FEE56"
  if (rank <= 30) return "#FFDA47"
  if (rank <= 40) return "#FFA85C"
  return "#FA618A"
}

interface TagRankTagProps {
  tag: string
  analysis?: TagSuggestion
  onRemove?: () => void
  onAdd?: () => void
  isSuggested?: boolean
  isAdded?: boolean
  componentLevel?: "l1" | "l2"
}

export const TagRankTag: React.FC<TagRankTagProps> = ({
  tag,
  analysis,
  onRemove,
  onAdd,
  isSuggested = false,
  isAdded = false,
  componentLevel = "l2",
}) => {
  const rankColor = getTagRankColor(analysis?.rank)
  const title = analysis
    ? `SEO score ${analysis.score} · search volume ${analysis.searchVolume.toLocaleString()} · competition ${analysis.competition.toLocaleString()} · rank #${analysis.rank}${analysis.tripleKeyword ? " · triple keyword" : ""}`
    : undefined
  const label = (
    <>
      {tag}
      {analysis ? <span aria-hidden="true"> · #{analysis.rank}</span> : null}
    </>
  )
  const style = {
    ["--pair-a" as string]: rankColor,
    ["--pair-b" as string]: "#ffffff",
    ...(componentLevel === "l1" ? {
      ["--vt-component-height" as string]: "44px",
      ["--vt-component-stroke" as string]: "3px",
      ["--vt-component-radius" as string]: "8px",
      ["--vt-component-font-size" as string]: "14px",
    } : {}),
  } as React.CSSProperties

  if (onRemove) {
    return (
      <SubToolboxRemovableTag
        level={componentLevel}
        onRemove={onRemove}
        removeIcon={<X size={12} strokeWidth={3.2} />}
        style={style}
        title={title}
      >
        {label}
      </SubToolboxRemovableTag>
    )
  }

  if (isSuggested) {
    return (
      <SubToolboxSelectableTag
        level={componentLevel}
        selected={isAdded}
        selectedIcon={<CheckCircle size={12} strokeWidth={3} />}
        unselectedIcon={<Plus size={12} strokeWidth={3} />}
        disabled={isAdded}
        onClick={() => { if (!isAdded) onAdd?.() }}
        style={style}
        title={title}
      >
        {label}
      </SubToolboxSelectableTag>
    )
  }

  return (
    <SubToolboxTag level={componentLevel} style={style} title={title}>
      {label}
    </SubToolboxTag>
  )
}
