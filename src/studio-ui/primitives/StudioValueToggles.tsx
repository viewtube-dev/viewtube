import React, { useCallback, useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

export type StudioToggleAppearance = {
  textColor?: string;
  fillColor?: string;
  iconColor?: string;
  iconFillColor?: string;
};

type CommonProps = {
  options: readonly string[];
  value: string;
  onValueChange: (value: string) => void;
  appearance?: StudioToggleAppearance;
  disabled?: boolean;
  size?: "supreme" | "standard" | "compact" | "micro";
  ariaLabel?: string;
  className?: string;
};

export type StudioArrowToggleProps = CommonProps & {
  iconSide?: "left" | "right" | "double";
};

export type StudioSideToggleProps = CommonProps & {
  arrowSide?: "left" | "right";
};

export type StudioDoubleSideToggleProps = {
  left: CommonProps;
  right: CommonProps;
  variant?: "default" | "v2" | "v3" | "v4";
  size?: CommonProps["size"];
  className?: string;
};

const appearanceStyle = (appearance?: StudioToggleAppearance): React.CSSProperties => ({
  ...(appearance?.textColor ? { "--vt-toggle-text": appearance.textColor } : {}),
  ...(appearance?.fillColor ? { "--vt-toggle-fill": appearance.fillColor } : {}),
  ...(appearance?.iconColor ? { "--vt-toggle-icon": appearance.iconColor } : {}),
  ...(appearance?.iconFillColor ? { "--vt-toggle-icon-fill": appearance.iconFillColor } : {}),
} as React.CSSProperties);

function changeOption(props: CommonProps, direction: -1 | 1) {
  const current = props.options.indexOf(props.value);
  const next = Math.max(0, Math.min(props.options.length - 1, (current < 0 ? 0 : current) + direction));
  if (props.options[next] !== undefined && props.options[next] !== props.value) props.onValueChange(props.options[next]);
}

function ArrowButton({ direction, disabled, onClick, label }: {
  direction: "left" | "right" | "up" | "down";
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = direction === "left" ? ChevronLeft : direction === "right" ? ChevronRight : direction === "up" ? ChevronUp : ChevronDown;
  return <button type="button" className="vt-studio-value-toggle__arrow" aria-label={label} disabled={disabled} onClick={onClick}>
    <Icon aria-hidden="true" />
  </button>;
}

export function StudioArrowToggle(props: StudioArrowToggleProps) {
  const { options, value, disabled, iconSide = "double", size = "standard", appearance, ariaLabel = "Choose value", className } = props;
  const index = options.indexOf(value);
  const current = options[index < 0 ? 0 : index] ?? value;
  const left = iconSide === "left" || iconSide === "double";
  const right = iconSide === "right" || iconSide === "double";
  return <div className={["vt-studio-value-toggle", "vt-studio-value-toggle--arrow", className].filter(Boolean).join(" ")}
    data-vt-studio-control="true" data-vt-studio-value-toggle="arrow" data-size={size} style={appearanceStyle(appearance)}>
    {left && <ArrowButton direction="left" label="Previous option" disabled={disabled || index <= 0} onClick={() => changeOption(props, -1)} />}
    <span className="vt-studio-value-toggle__face" aria-live="polite" aria-label={ariaLabel} title={current}>{current}</span>
    {right && <ArrowButton direction="right" label="Next option" disabled={disabled || index >= options.length - 1} onClick={() => changeOption(props, 1)} />}
  </div>;
}

export function StudioSideToggle(props: StudioSideToggleProps) {
  const { options, value, disabled, arrowSide = "right", size = "standard", appearance, ariaLabel = "Choose value", className } = props;
  const index = options.indexOf(value);
  const current = options[index < 0 ? 0 : index] ?? value;
  const arrows = <div className="vt-studio-value-toggle__arrow-stack">
    <ArrowButton direction="up" label="Previous option" disabled={disabled || index <= 0} onClick={() => changeOption(props, -1)} />
    <ArrowButton direction="down" label="Next option" disabled={disabled || index >= options.length - 1} onClick={() => changeOption(props, 1)} />
  </div>;
  return <div className={["vt-studio-value-toggle", "vt-studio-value-toggle--side", className].filter(Boolean).join(" ")}
    data-vt-studio-control="true" data-vt-studio-value-toggle="side" data-size={size} style={appearanceStyle(appearance)}>
    {arrowSide === "left" && arrows}
    <span className="vt-studio-value-toggle__face" aria-live="polite" aria-label={ariaLabel} title={current}>{current}</span>
    {arrowSide === "right" && arrows}
  </div>;
}

export function StudioDoubleSideToggle({ left, right, variant = "default", size = "standard", className }: StudioDoubleSideToggleProps) {
  const noDivider = variant === "v2" || variant === "v4";
  const contentWidth = variant === "v3" || variant === "v4";
  return <div className={["vt-studio-value-toggle", "vt-studio-value-toggle--double", className].filter(Boolean).join(" ")}
    data-vt-studio-control="true" data-vt-studio-value-toggle="double" data-variant={variant} data-size={size}>
    <div className="vt-studio-value-toggle__double-side" data-content-width={contentWidth || undefined}>
      <StudioSideToggle {...left} size={size} arrowSide="left" className="vt-studio-value-toggle--nested" />
    </div>
    {!noDivider && <span className="vt-studio-value-toggle__divider" aria-hidden="true" />}
    <div className="vt-studio-value-toggle__double-side" data-content-width={contentWidth || undefined}>
      <StudioSideToggle {...right} size={size} arrowSide="right" className="vt-studio-value-toggle--nested" />
    </div>
  </div>;
}

export type StudioBarToggleProps = {
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  size?: CommonProps["size"];
  appearance?: StudioToggleAppearance;
  ariaLabel?: string;
  holdDelayMs?: number;
  repeatIntervalMs?: number;
  className?: string;
};

export function StudioBarToggle({
  value, onValueChange, disabled = false, size = "standard", appearance, ariaLabel = "Level",
  holdDelayMs = 350, repeatIntervalMs = 100, className,
}: StudioBarToggleProps) {
  const repeatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatActive = useRef(false);
  const stopRepeat = useCallback(() => {
    repeatActive.current = false;
    if (repeatTimer.current !== null) clearTimeout(repeatTimer.current);
    repeatTimer.current = null;
  }, []);
  useEffect(() => stopRepeat, [stopRepeat]);

  const step = useCallback((direction: -1 | 1) => {
    if (disabled) return;
    onValueChange(Math.max(0, Math.min(100, Math.round(Math.max(0, Math.min(100, value)) / 10) * 10 + direction * 10)));
  }, [disabled, onValueChange, value]);

  const startRepeat = (direction: -1 | 1) => {
    stopRepeat();
    step(direction);
    repeatActive.current = true;
    repeatTimer.current = setTimeout(function repeat() {
      if (!repeatActive.current) return;
      step(direction);
      repeatTimer.current = setTimeout(repeat, repeatIntervalMs);
    }, holdDelayMs);
  };

  const bars = Math.max(0, Math.min(10, Math.round(value / 10)));
  return <div className={["vt-studio-value-toggle", "vt-studio-value-toggle--bar", className].filter(Boolean).join(" ")}
    data-vt-studio-control="true" data-vt-studio-value-toggle="bar" data-size={size} style={appearanceStyle(appearance)}>
    <button type="button" className="vt-studio-value-toggle__arrow" aria-label="Decrease level" disabled={disabled || value <= 0}
      onPointerDown={() => startRepeat(-1)} onPointerUp={stopRepeat} onPointerLeave={stopRepeat} onPointerCancel={stopRepeat} onClick={() => {}} onKeyDown={event => { if (event.key === " " || event.key === "Enter") step(-1); }}>
      <ChevronLeft aria-hidden="true" />
    </button>
    <div className="vt-studio-value-toggle__bars" role="meter" aria-label={ariaLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={bars * 10}>
      {Array.from({ length: 10 }, (_, index) => <span key={index} className="vt-studio-value-toggle__bar" data-active={index < bars ? "true" : "false"} />)}
    </div>
    <button type="button" className="vt-studio-value-toggle__arrow" aria-label="Increase level" disabled={disabled || value >= 100}
      onPointerDown={() => startRepeat(1)} onPointerUp={stopRepeat} onPointerLeave={stopRepeat} onPointerCancel={stopRepeat} onClick={() => {}} onKeyDown={event => { if (event.key === " " || event.key === "Enter") step(1); }}>
      <ChevronRight aria-hidden="true" />
    </button>
  </div>;
}

export const STUDIO_VALUE_TOGGLE_VARIANTS = ["default", "v2", "v3", "v4"] as const;
