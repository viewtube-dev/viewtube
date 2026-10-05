export const COMPONENT_CONTRACTS = {
  button: {
    role: "button",
    states: ["idle", "hover", "focus", "pressed", "disabled", "pending", "success", "error"],
    events: ["activate"],
    renderer: "glass",
    fallbackRenderer: "solid",
  },
  slider: {
    role: "slider",
    states: ["idle", "focus", "dragging", "disabled"],
    events: ["change", "commit"],
    renderer: "glass",
    fallbackRenderer: "solid",
  },
  input: {
    role: "textbox",
    states: ["idle", "focus", "invalid", "disabled"],
    events: ["input", "commit"],
    renderer: "glass",
    fallbackRenderer: "solid",
  },
  panel: {
    role: "region",
    states: ["idle", "loading", "error"],
    events: [],
    renderer: "glass",
    fallbackRenderer: "solid",
  },
};
