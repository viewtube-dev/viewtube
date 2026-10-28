import React from "react"
import { StudioCounter, StudioSwitch } from "../../studio-ui"

export const brainSettingsButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-black px-3 py-2 text-sm font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"

export const BrainSettingsSwitch = ({ checked, onChange, label, detail }: { checked: boolean; onChange: (value: boolean) => void; label: string; detail: string }) => {
  const id = React.useId()
  return <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-black/20 py-3 last:border-0">
    <div><strong id={`${id}-label`} className="block text-sm font-bold">{label}</strong><p id={`${id}-detail`} className="mt-1 text-sm leading-5 text-black/75">{detail}</p></div>
    <StudioSwitch checked={checked} aria-labelledby={`${id}-label`} aria-describedby={`${id}-detail`} onClick={() => onChange(!checked)} />
  </div>
}

export const BrainSettingsRange = ({ label, detail, value, min, max, step = 1, onChange }: { label: string; detail: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) => {
  const id = React.useId()
  return <div className="py-3"><label htmlFor={id} className="block text-sm font-bold">{label}: {Number(value.toFixed(2))}</label><p id={`${id}-detail`} className="mt-1 text-sm text-black/75">{detail}</p><StudioCounter ariaLabel={label} value={value} onValueChange={onChange} min={min} max={max} step={step} size="standard" className="mt-2 w-full" /></div>
}
