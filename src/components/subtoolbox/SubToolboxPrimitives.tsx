import React from "react"
import { createPortal } from "react-dom"
import { ChevronDown, CircleQuestionMark } from "lucide-react"
import { getComponentLevelCssVars } from "./tokens"
import type { SubToolboxControlSize, SubToolboxState, ToolboxControlLevel } from "./tokens"
import { getAlphabeticalSpectrumColor } from "../../styles/toolboxPalette"

type PrimitiveTone = "accent" | "neutral" | "ink" | "danger" | "warning" | "success"
type SplitActionVariant = "head" | "tail"

const classes = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ")