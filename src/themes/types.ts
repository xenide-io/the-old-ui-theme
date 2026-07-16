export type ThemeId =
  | "hedgehog-light"
  | "hedgehog-dark"
  | "catppuccin-light"
  | "catppuccin-dark"
  | "sheets"
  | "sheets-dark"
  | "socials"
  | "socials-dark"
  | "xenide-light"
  | "xenide-dark"
  | "chats-light"
  | "chats-dark"
  | "bikini-bottom"
  | "bikini-bottom-dark"
  | "turtletime"
  | "turtletime-dark"
  | "note"
  | "note-dark"
  | "presentation"
  | "presentation-dark"
  | "github-light"
  | "github-dark"
  | "rosepine-light"
  | "rosepine-dark"
  | "notion"
  | "notion-dark";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  colorScheme: "light" | "dark";
  group: string;
}
