import React from "react"
import { BookOpenCheck, CheckCircle2 } from "lucide-react"
import { SubToolbox } from "../Toolbox"
import { SubToolboxStatusBadge, SubToolboxLabeledTextArea } from "../subtoolbox/SubToolboxPrimitives"

export const EDUCATION_TIMESTAMP_PATTERN = /^\d{1,2}:\d{2}(?:\s+.+)$/

export const validateEducationTimestampLines = (value: string): { valid: boolean; invalidLines: number[] } => {
  const lines = value.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  const invalidLines = lines.reduce<number[]>((invalid, line, index) => {
    if (!EDUCATION_TIMESTAMP_PATTERN.test(line)) invalid.push(index + 1)
    return invalid
  }, [])
  return { valid: invalidLines.length === 0, invalidLines }
}

interface EducationTimestampNotesProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  embedded?: boolean
}

export const EducationTimestampNotes: React.FC<EducationTimestampNotesProps> = ({ value, onChange, disabled = false, embedded = false }) => {
  const validation = validateEducationTimestampLines(value)
  const hasContent = value.trim().length > 0
  const valid = !hasContent || validation.valid

  return embedded
    ? <div data-education-timestamp-notes="embedded"><div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <SubToolboxStatusBadge level="l1" className={valid ? "" : "is-error"}>
          {valid ? "TIMESTAMP FORMAT READY" : `INVALID LINE${validation.invalidLines.length > 1 ? "S" : ""}: ${validation.invalidLines.join(", ")}`}
        </SubToolboxStatusBadge>
        {valid && hasContent ? <CheckCircle2 size={16} aria-label="Timestamp format valid" /> : null}
      </div>
      <SubToolboxLabeledTextArea
        level="l1"
        overlayLabel="QUESTIONS / PHRASES"
        value={value}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
        height="standard"
        placeholder={"0:00 Question or phrase\n1:25 Another question or phrase"}
        aria-label="Education timestamp questions and phrases"
        aria-invalid={!valid}
      />
      <p className="text-[10px] font-black uppercase tracking-[.06em] opacity-60">
        Each non-empty line must begin with M:SS or MM:SS, followed by a question or phrase.
      </p>
    </div></div>
    : (
      <SubToolbox title="EDUCATION QUESTIONS & PHRASES" icon={<BookOpenCheck size={20} strokeWidth={3} />} collapsible isOpenInitial>
        <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <SubToolboxStatusBadge level="l1" className={valid ? "" : "is-error"}>
          {valid ? "TIMESTAMP FORMAT READY" : `INVALID LINE${validation.invalidLines.length > 1 ? "S" : ""}: ${validation.invalidLines.join(", ")}`}
        </SubToolboxStatusBadge>
        {valid && hasContent ? <CheckCircle2 size={16} aria-label="Timestamp format valid" /> : null}
      </div>
      <SubToolboxLabeledTextArea
        level="l1"
        overlayLabel="QUESTIONS / PHRASES"
        value={value}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
        height="standard"
        placeholder={"0:00 Question or phrase\n1:25 Another question or phrase"}
        aria-label="Education timestamp questions and phrases"
        aria-invalid={!valid}
      />
      <p className="text-[10px] font-black uppercase tracking-[.06em] opacity-60">
        Each non-empty line must begin with M:SS or MM:SS, followed by a question or phrase.
      </p>
    </div>
      </SubToolbox>
    )
}
