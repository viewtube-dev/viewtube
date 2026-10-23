import React from "react"

export type StudioDisclosureSummaryProps = Omit<React.ComponentPropsWithoutRef<"summary">, "children"> & {
  children: React.ReactNode
  sizeVariant?: "compact" | "standard"
}

/** Native details/summary trigger styled by the shared Studio control contract. */
export const StudioDisclosureSummary: React.FC<StudioDisclosureSummaryProps> = ({
  children,
  sizeVariant = "compact",
  className = "",
  ...props
}) => (
  <summary
    {...props}
    data-vt-studio-control="true"
    data-vt-studio-disclosure-summary="true"
    data-size={sizeVariant}
    className={`vt-studio-disclosure-summary ${className}`.trim()}
  >
    {children}
  </summary>
)

export default StudioDisclosureSummary
