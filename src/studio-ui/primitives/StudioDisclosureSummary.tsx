import React from "react"

export type StudioDisclosureSummaryProps = Omit<React.ComponentPropsWithoutRef<"summary">, "children"> & {
  children: React.ReactNode
  sizeVariant?: "compact" | "standard"
  appearanceVariant?: "control" | "structured"
}

/** Native details/summary trigger styled by the shared Studio control contract. */
export const StudioDisclosureSummary: React.FC<StudioDisclosureSummaryProps> = ({
  children,
  sizeVariant = "compact",
  appearanceVariant = "control",
  className = "",
  ...props
}) => (
  <summary
    {...props}
    data-vt-studio-control="true"
    data-vt-studio-disclosure-summary="true"
    data-size={sizeVariant}
    data-appearance={appearanceVariant}
    className={`vt-studio-disclosure-summary ${className}`.trim()}
  >
    {children}
  </summary>
)

export default StudioDisclosureSummary
