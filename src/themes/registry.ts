import type { ThemeDefinition, ThemeId } from "@/themes/types";

export const DEFAULT_THEME_ID: ThemeId = "hedgehog-light";

export const THEMES: ThemeDefinition[] = [
  {
    id: "hedgehog-light",
    name: "HedgeHog Light",
    description: "Default Quill warm greys and orange Lemon chrome.",
    colorScheme: "light",
    group: "HedgeHog",
  },
  {
    id: "hedgehog-dark",
    name: "HedgeHog Dark",
    description: "Dark app shell with HedgeHog orange accents.",
    colorScheme: "dark",
    group: "HedgeHog",
  },
  {
    id: "note",
    name: "Note Light",
    description: "Notebook purple on lavender-white chrome.",
    colorScheme: "light",
    group: "Note",
  },
  {
    id: "note-dark",
    name: "Note Dark",
    description: "Dark notebook purple — night reading mode.",
    colorScheme: "dark",
    group: "Note",
  },
  {
    id: "turtletime",
    name: "TurtleTime Light",
    description:
      "Turtle mascot palette — shell orange, leaf green, and warm cream.",
    colorScheme: "light",
    group: "TurtleTime",
  },
  {
    id: "turtletime-dark",
    name: "TurtleTime Dark",
    description:
      "TurtleTime after dusk — dark olive shell with bright orange clock accents.",
    colorScheme: "dark",
    group: "TurtleTime",
  },
  {
    id: "rosepine-light",
    name: "Rosé Pine Light",
    description: "Rosé Pine Dawn — warm paper base with muted iris accents.",
    colorScheme: "light",
    group: "Rosé Pine",
  },
  {
    id: "rosepine-dark",
    name: "Rosé Pine Dark",
    description: "Rosé Pine Main — moonlit base with iris and love accents.",
    colorScheme: "dark",
    group: "Rosé Pine",
  },
  {
    id: "kraken-light",
    name: "Kraken Light",
    description:
      "Medium-inspired warm paper, editorial black actions, and publication yellow.",
    colorScheme: "light",
    group: "Kraken",
  },
  {
    id: "kraken-dark",
    name: "Kraken Dark",
    description:
      "Medium-inspired night reading canvas with white actions and publication yellow.",
    colorScheme: "dark",
    group: "Kraken",
  },
  {
    id: "deepsea-light",
    name: "Tokyo Day",
    description:
      "Tokyo Night Day — soft bluish greys with vivid blue and purple accents.",
    colorScheme: "light",
    group: "Tokyo Night",
  },
  {
    id: "deepsea-dark",
    name: "Tokyo Night",
    description:
      "Tokyo Night — #1a1b26 base with signature blue, cyan, and purple.",
    colorScheme: "dark",
    group: "Tokyo Night",
  },
  {
    id: "malibu-light",
    name: "Malibu Light",
    description:
      "Sun-bleached GTA San Andreas palette with hot pink, sunset orange, and lime signals.",
    colorScheme: "light",
    group: "Malibu",
  },
  {
    id: "malibu-dark",
    name: "Malibu Dark",
    description:
      "Deep plum command deck with hot pink, lime, cyan, and sunset signals.",
    colorScheme: "dark",
    group: "Malibu",
  },
];

export const THEME_GROUPS = Array.from(
  new Set(THEMES.map((theme) => theme.group)),
);

export function isThemeId(value: string): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function getTheme(id: string): ThemeDefinition | undefined {
  return THEMES.find((theme) => theme.id === id);
}
