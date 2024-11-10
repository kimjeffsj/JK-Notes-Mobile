export const colors = {
  primary: "#1a1a1a",
  primaryLight: "#1a1a1ae3",
  accent: "#dfa46d",
  background: "#f8f7f2",
  backgroundSecondary: "rgba(242, 240, 235, 1)",
  text: "#1a1a1a",
  textSecondary: "#666666",
  border: "#e2e2e2",
} as const;

export type ColorType = keyof typeof colors;
