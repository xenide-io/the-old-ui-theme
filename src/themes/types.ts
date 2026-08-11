export type ThemeId =
  | "hedgehog-light"
  | "hedgehog-dark"
  | "note"
  | "note-dark"
  | "turtletime"
  | "turtletime-dark"
  | "rosepine-light"
  | "rosepine-dark"
  | "kraken-light"
  | "kraken-dark"
  | "deepsea-light"
  | "deepsea-dark"
  | "malibu-light"
  | "malibu-dark";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  colorScheme: "light" | "dark";
  group: string;
}
