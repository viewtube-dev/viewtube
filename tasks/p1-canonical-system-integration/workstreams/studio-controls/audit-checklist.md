# Studio Controls audit checklist

**Status:** NOT RUN as a complete visual/runtime audit.

- [ ] Refresh target SHA and donor PR/branch state.
- [ ] Trace token source → emitter → generated vars → CSS barrel → primitive imports → confirmed catalog → consumer exports.
- [ ] Find duplicate selector/geometry owners, stale recovery/parity sheets and generated-file drift.
- [ ] Check primitives import their own required styles; no wrong-location files.
- [ ] Inventory all primitive exports and confirmed specimens; flag dead/stale/missing controls.
- [ ] Compare #935/#988/#992 file-level diffs against current target; no wholesale merge.
- [ ] Verify semantic tier and field/split contracts; no hidden ratio/default drift.
- [ ] Audit keyboard, touch, focus, responsive layout and reduced-motion where relevant.
- [ ] Record zero-caller and no-loss evidence before deleting/quarantining anything.
