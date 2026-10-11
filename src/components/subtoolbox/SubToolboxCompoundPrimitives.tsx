import React from "react"
import { Search, Settings2, Sparkles, Plus, Check, X } from "lucide-react"
import type { ToolboxControlLevel } from "./tokens"
import { SubToolboxTagEditor } from "./SubToolboxPrimitives"
import { SubToolboxSplitButton } from "./SubToolboxSplitPrimitives"

export interface SubToolboxNestedSquareOption {
  value: string
  label: string
  description?: string
}

export interface SubToolboxNestedSquareChoiceProps {
  options: SubToolboxNestedSquareOption[]
  value: string
  onChange: (value: string) => void
  level?: ToolboxControlLevel
  ariaLabel: string
  className?: string
}

/** Single-choice option cards with the nested-square selection marker used by refinement/generation controls. */
export const SubToolboxNestedSquareChoice: React.FC<SubToolboxNestedSquareChoiceProps> = ({
  options,
  value,
  onChange,
  level = "l1",
  ariaLabel,
  className = "",
}) => (
  <div className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${className}`} role="radiogroup" aria-label={ariaLabel} data-vt-control-level={level}>
    {options.map(option => {
      const selected = option.value === value
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selected}
          className={`flex min-w-0 items-center gap-2 rounded-lg border-[3px] border-black p-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${selected ? "bg-[var(--pair-a,var(--vt-subtoolbox-fill,#73DEFF))]" : "bg-white"}`}
          onClick={() => onChange(option.value)}
        >
          <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center border-[2px] border-black bg-white">
            <span className={`size-2.5 border-2 border-black ${selected ? "bg-black" : "bg-transparent"}`} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[10px] font-black uppercase">{option.label}</span>
            {option.description ? <span className="block text-[10px] font-bold leading-tight opacity-70">{option.description}</span> : null}
          </span>
        </button>
      )
    })}
  </div>
)

export type SubToolboxTagAction = "refine" | "generate" | "analyze"

export interface SubToolboxTagActionRowProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  onAction: (action: SubToolboxTagAction) => void
  level?: ToolboxControlLevel
  actionStatus?: string
  className?: string
}

/** Tag editor plus compact split-left actions directly beneath it. */
export const SubToolboxTagActionRow: React.FC<SubToolboxTagActionRowProps> = ({
  tags,
  onTagsChange,
  onAction,
  level = "l1",
  actionStatus,
  className = "",
}) => (
  <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
    <SubToolboxTagEditor
      level={level}
      tags={tags}
      onTagsChange={onTagsChange}
      addIcon={<Plus />}
      saveIcon={<Check />}
      removeIcon={<X />}
    />
    <div className="flex min-w-0 flex-nowrap items-center gap-1" role="group" aria-label="Tag actions">
      <SubToolboxSplitButton level={level} icon={<Settings2 />} className="!min-w-0 !flex-1 !px-1 !text-[9px]" onClick={() => onAction("refine")}>REFINE</SubToolboxSplitButton>
      <SubToolboxSplitButton level={level} icon={<Sparkles />} className="!min-w-0 !flex-1 !px-1 !text-[9px]" onClick={() => onAction("generate")}>GENERATE</SubToolboxSplitButton>
      <SubToolboxSplitButton level={level} icon={<Search />} className="!min-w-0 !flex-1 !px-1 !text-[9px]" onClick={() => onAction("analyze")}>ANALYZE</SubToolboxSplitButton>
    </div>
    {actionStatus ? <p className="text-[9px] font-black uppercase" role="status">{actionStatus}</p> : null}
  </div>
)
