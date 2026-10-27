import * as React from "react";
import { StudioComponentGrid, StudioComponentGridCell, StudioComponentGridRow, type StudioGridCorners, type StudioGridSize } from "./StudioComponentGrid";

export type StudioComponentGridSpecimenProps = {
  size?: StudioGridSize;
  corners?: StudioGridCorners;
  leftCounter?: React.ReactNode;
  dropdown?: React.ReactNode;
  doubleSideToggle?: React.ReactNode;
  className?: string;
};

/** Composition-only specimen; callers supply the real production primitives. */
export function StudioComponentGridSpecimen({ size = "standard", corners = "radius", leftCounter, dropdown, doubleSideToggle, className }: StudioComponentGridSpecimenProps) {
  return <StudioComponentGrid cols={2} rows={2} size={size} corners={corners} className={className} aria-label="Studio component grid specimen">
    <StudioComponentGridCell col={1} row={1}>{leftCounter}</StudioComponentGridCell>
    <StudioComponentGridCell col={2} row={1}>{dropdown}</StudioComponentGridCell>
    <StudioComponentGridRow row={2}>{doubleSideToggle}</StudioComponentGridRow>
  </StudioComponentGrid>;
}

export function StudioComponentGridSpecimenPair(props: Omit<StudioComponentGridSpecimenProps, "corners">) {
  return <div className="vt-studio-component-grid-specimen-pair">
    <div><p className="vt-studio-component-grid-specimen-pair__label">Corners · radius</p><StudioComponentGridSpecimen corners="radius" {...props} /></div>
    <div><p className="vt-studio-component-grid-specimen-pair__label">Corners · square</p><StudioComponentGridSpecimen corners="square" {...props} /></div>
  </div>;
}
