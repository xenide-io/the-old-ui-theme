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
    id: "catppuccin-light",
    name: "Catppuccin Light",
    description: "Catppuccin Latte — soft pastels and mauve accent.",
    colorScheme: "light",
    group: "Catppuccin",
  },
  {
    id: "catppuccin-dark",
    name: "Catppuccin Dark",
    description: "Catppuccin Mocha — deep base and lavender peach.",
    colorScheme: "dark",
    group: "Catppuccin",
  },
  {
    id: "sheets",
    name: "Sheets",
    description: "Spreadsheet green on office neutrals.",
    colorScheme: "light",
    group: "Productivity",
  },
  {
    id: "sheets-dark",
    name: "Sheets Dark",
    description: "Dark shell with spreadsheet green accent.",
    colorScheme: "dark",
    group: "Productivity",
  },
  {
    id: "note",
    name: "Note",
    description: "Notebook purple on lavender-white chrome.",
    colorScheme: "light",
    group: "Productivity",
  },
  {
    id: "note-dark",
    name: "Note Dark",
    description: "Dark notebook purple — night reading mode.",
    colorScheme: "dark",
    group: "Productivity",
  },
  {
    id: "presentation",
    name: "Presentation",
    description: "Orange-red on office neutrals.",
    colorScheme: "light",
    group: "Productivity",
  },
  {
    id: "presentation-dark",
    name: "Presentation Dark",
    description: "Dark shell with orange-red accent.",
    colorScheme: "dark",
    group: "Productivity",
  },
  {
    id: "socials",
    name: "Socials",
    description: "Meta blue accent on familiar social greys.",
    colorScheme: "light",
    group: "Social",
  },
  {
    id: "socials-dark",
    name: "Socials Dark",
    description: "Social dark mode — #18191A base and Meta blue.",
    colorScheme: "dark",
    group: "Social",
  },
  {
    id: "chats-light",
    name: "Chats Light",
    description: "Aubergine brand on clean workspace neutrals.",
    colorScheme: "light",
    group: "Chats",
  },
  {
    id: "chats-dark",
    name: "Chats Dark",
    description: "Dark sidebar — #1A1D21 base and green highlights.",
    colorScheme: "dark",
    group: "Chats",
  },
  {
    id: "xenide-light",
    name: "Xenide Light",
    description: "xenide.io light — Excel green + purple on neutral greys.",
    colorScheme: "light",
    group: "Xenide",
  },
  {
    id: "xenide-dark",
    name: "Xenide Dark",
    description: "xenide.io dark — #0A0A0F base, emerald green + violet.",
    colorScheme: "dark",
    group: "Xenide",
  },
  {
    id: "bikini-bottom",
    name: "Bikini Bottom",
    description: "SpongeBob palette — ocean canvas, readable surfaces, character accents.",
    colorScheme: "light",
    group: "Fun",
  },
  {
    id: "bikini-bottom-dark",
    name: "Bikini Bottom Dark",
    description: "Bikini Bottom at night — deep ocean with neon character accents.",
    colorScheme: "dark",
    group: "Fun",
  },
  {
    id: "turtletime",
    name: "TurtleTime",
    description: "Turtle mascot palette — shell orange, leaf green, and warm cream.",
    colorScheme: "light",
    group: "Fun",
  },
  {
    id: "turtletime-dark",
    name: "TurtleTime Dark",
    description: "TurtleTime after dusk — dark olive shell with bright orange clock accents.",
    colorScheme: "dark",
    group: "Fun",
  },
  {
    id: "github-light",
    name: "GitHub Light",
    description: "GitHub Primer — #f6f8fa canvas and emphasis blue accents.",
    colorScheme: "light",
    group: "GitHub",
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    description: "GitHub dark dimmed — #0d1117 base and #4493f8 links.",
    colorScheme: "dark",
    group: "GitHub",
  },
  {
    id: "rosepine-light",
    name: "Rosé Pine Dawn",
    description: "Rosé Pine Dawn — warm paper base with muted iris accents.",
    colorScheme: "light",
    group: "Rosé Pine",
  },
  {
    id: "rosepine-dark",
    name: "Rosé Pine",
    description: "Rosé Pine Main — moonlit base with iris and love accents.",
    colorScheme: "dark",
    group: "Rosé Pine",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Notion light — warm off-white canvas, Notion blue accent, signature dark text.",
    colorScheme: "light",
    group: "Productivity",
  },
  {
    id: "notion-dark",
    name: "Notion Dark",
    description: "Notion dark mode — dark charcoal canvas with blue accent and clean typography.",
    colorScheme: "dark",
    group: "Productivity",
  },
  {
    id: "deepsea-light",
    name: "Tokyo Night Day",
    description: "Tokyo Night Day — soft bluish greys with vivid blue and purple accents.",
    colorScheme: "light",
    group: "Tokyo Night",
  },
  {
    id: "deepsea-dark",
    name: "Tokyo Night",
    description: "Tokyo Night — #1a1b26 base with signature blue, cyan, and purple.",
    colorScheme: "dark",
    group: "Tokyo Night",
  },
  {
    id: "kraken-light",
    name: "Kraken Light",
    description: "Medium-inspired warm paper, editorial black actions, and classic publication yellow.",
    colorScheme: "light",
    group: "Kraken",
  },
  {
    id: "kraken-dark",
    name: "Kraken Dark",
    description: "Medium-inspired night reading canvas with white actions and classic publication yellow.",
    colorScheme: "dark",
    group: "Kraken",
  },
];

export const THEME_GROUPS = Array.from(new Set(THEMES.map((theme) => theme.group)));

export function isThemeId(value: string): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function getTheme(id: string): ThemeDefinition | undefined {
  return THEMES.find((theme) => theme.id === id);
}
