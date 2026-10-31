"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type ComponentType,
} from "react";
import {
  SuiteCompanion,
  type CompanionCatalogue,
  type CompanionCharacter,
  type CompanionPalette,
} from "./companion";
import { SuiteFloatingAssistant } from "./floating-assistant";
import { SuiteCompanionSettings } from "./companion-settings";

type Preferences = {
  enabled: boolean;
  characterId: string;
  themeId: string;
  motion: boolean;
};
type Activity = { actionId: string; label: string; busy: boolean };
export type CompanionTool = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  onSelect(): void;
};
export type CompanionCue = {
  anchor: HTMLElement;
  mode: "menu" | "work" | "success" | "error";
  label: string;
  motion?: "jump" | "push" | "pull";
  tools?: CompanionTool[];
};
type Appearance = {
  preferences: Preferences;
  update(patch: Partial<Preferences>): void;
  app?: CompanionApp;
  sharedCharacterId?: string;
  appCharacters?: Partial<Record<CompanionApp, { characterId: string }>>;
  setAppCharacter?(app: CompanionApp, characterId: string | null): void;
  syncStatus?: string;
  syncError?: string;
  retrySync?(): void;
};
export type CompanionApp =
  | "turtletime"
  | "tides"
  | "shellstack"
  | "kraken"
  | "shelly";

/**
 * Companion colours are not a user choice: each app keeps its own named
 * companion theme in light and dark mode. Teammates keep their own theme.
 */
export const COMPANION_APP_THEMES: Record<
  CompanionApp,
  { light: string; dark: string }
> = {
  shellstack: { light: "pastel-sky", dark: "powershell" },
  tides: { light: "microsoft-onenote", dark: "rose-pine-moon" },
  turtletime: { light: "google-sheets", dark: "turtletime" },
  kraken: { light: "sepia-light", dark: "sepia-dark" },
  shelly: { light: "microsoft-powerpoint", dark: "ubuntu-terminal" },
};

export function companionThemeId(
  app: CompanionApp | undefined,
  mode: "light" | "dark",
): string | undefined {
  return app ? COMPANION_APP_THEMES[app][mode] : undefined;
}

function readColourMode(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  const theme = root.getAttribute("data-theme")?.toLowerCase() ?? "";
  if (theme.includes("dark")) return "dark";
  if (theme.includes("light")) return "light";
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Follow the app's resolved light/dark mode, including live theme changes. */
function useColourMode(): "light" | "dark" {
  const [mode, setMode] = useState(readColourMode);
  useEffect(() => {
    const update = () => setMode(readColourMode());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    const media =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    media?.addEventListener("change", update);
    window.addEventListener("focus", update);
    return () => {
      observer.disconnect();
      media?.removeEventListener("change", update);
      window.removeEventListener("focus", update);
    };
  }, []);
  return mode;
}

const CompanionContext = createContext<
  | (Appearance & {
      catalogue: CompanionCatalogue | null;
      character: CompanionCharacter | null;
      themeId: string | undefined;
      assetError: string;
      activity: Activity;
      setActivity(activity: Activity): void;
      setEditorActivity(activity: Activity | null): void;
      cue: CompanionCue | null;
      setCue(cue: CompanionCue | null): void;
    })
  | null
>(null);

let cataloguePromise: Promise<CompanionCatalogue> | undefined;
const faces = new Map<string, Promise<CompanionCharacter>>();
async function asset<T>(file: string): Promise<T> {
  const response = await fetch(`/assistant/${file}.json`);
  if (!response.ok)
    throw new Error("Could not load assistant appearance. Refresh to retry.");
  return response.json() as Promise<T>;
}

/** UI assets and independent presentation state; auth, preferences and transport belong to hosts. */
export function SuiteCompanionProvider({
  preferences,
  update,
  children,
  ...appearance
}: Appearance & { children: ReactNode }) {
  const colourMode = useColourMode();
  const themeId = companionThemeId(appearance.app, colourMode);
  const [catalogue, setCatalogue] = useState<CompanionCatalogue | null>(null);
  const [character, setCharacter] = useState<CompanionCharacter | null>(null);
  const [assetError, setAssetError] = useState("");
  const [activity, setActivity] = useState<Activity>({
    actionId: "idle",
    label: "Ready when you are",
    busy: false,
  });
  const [editorActivity, setEditorActivity] = useState<Activity | null>(null);
  const [cue, setCue] = useState<CompanionCue | null>(null);
  useEffect(() => {
    let cancelled = false;
    cataloguePromise ??= asset<CompanionCatalogue>("catalogue").catch(
      (error) => {
        cataloguePromise = undefined;
        throw error;
      },
    );
    void cataloguePromise
      .then((data) => {
        if (!cancelled) setCatalogue(data);
      })
      .catch((error) => {
        if (!cancelled) setAssetError(String(error.message));
      });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!catalogue) return;
    const id = catalogue.characters.some(
      (c) => c.id === preferences.characterId,
    )
      ? preferences.characterId
      : "dot";
    let cancelled = false;
    if (!faces.has(id))
      faces.set(
        id,
        asset<CompanionCharacter>(id).catch((error) => {
          faces.delete(id);
          throw error;
        }),
      );
    void faces
      .get(id)!
      .then((data) => {
        if (!cancelled) {
          setCharacter(data);
          setAssetError("");
        }
      })
      .catch((error) => {
        if (!cancelled) setAssetError(String(error.message));
      });
    return () => {
      cancelled = true;
    };
  }, [catalogue, preferences.characterId]);
  return (
    <CompanionContext.Provider
      value={{
        preferences,
        update,
        ...appearance,
        catalogue,
        character,
        themeId,
        assetError,
        activity: editorActivity ?? activity,
        setActivity,
        setEditorActivity,
        cue,
        setCue,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const value = useContext(CompanionContext);
  if (!value)
    throw new Error("Companion must be inside SuiteCompanionProvider");
  return value;
}

export function CompanionAvatar({
  size = 48,
  animated = false,
  actionId,
  palette,
}: {
  size?: number;
  animated?: boolean;
  actionId?: string;
  palette?: CompanionPalette;
}) {
  const { catalogue, character, preferences, themeId, activity } =
    useCompanion();
  const selectedId = catalogue?.characters.some(
    (c) => c.id === preferences.characterId,
  )
    ? preferences.characterId
    : "dot";
  if (!catalogue || !character || character.id !== selectedId)
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect
          x="3"
          y="10"
          width="58"
          height="44"
          rx="12"
          fill="var(--ph-canvas)"
          stroke="currentColor"
          strokeWidth="3.5"
        />
      </svg>
    );
  return (
    <SuiteCompanion
      catalogue={catalogue}
      character={character}
      themeId={themeId}
      actionId={actionId ?? (animated ? activity.actionId : "idle")}
      size={size}
      palette={palette}
      motion={animated && preferences.motion}
    />
  );
}

export function CompanionChatMark() {
  return <CompanionAvatar size={32} />;
}
export function CompanionNavMark() {
  return <CompanionAvatar size={20} />;
}
export function CompanionActivityMark() {
  return <CompanionAvatar size={32} animated />;
}

export function SuiteCompanionHost({
  open,
  onOpenChange,
  suspended,
  children,
}: {
  open: boolean;
  onOpenChange(open: boolean): void;
  suspended?: boolean;
  children: ReactNode;
}) {
  const { preferences, catalogue, themeId, activity, cue, setCue } =
    useCompanion();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuOpen = cue?.mode === "menu";
  const theme = catalogue?.themes.find(
    (candidate) => candidate.id === themeId,
  );
  return (
    <SuiteFloatingAssistant
      open={open}
      onOpenChange={onOpenChange}
      title={
        catalogue?.characters.find((c) => c.id === preferences.characterId)
          ?.name ?? "Companion"
      }
      status={activity.label}
      cue={cue}
      onDismissCue={() => setCue(null)}
      motion={preferences.motion}
      palette={
        theme ?? {
          bg: "var(--ph-surface)",
          fg: "var(--ph-text-primary)",
          accents: [
            "var(--ph-accent)",
            "var(--ph-violet)",
            "var(--ph-warning)",
          ],
        }
      }
      onSettings={() => setSettingsOpen((value) => !value)}
      settingsOpen={settingsOpen}
      suspended={suspended || (!preferences.enabled && !open && !cue)}
      avatar={
        <CompanionAvatar
          size={menuOpen ? 72 : 48}
          animated={!suspended && (preferences.enabled || open || !!cue)}
          actionId={
            cue?.mode === "success"
              ? "delighted"
              : cue?.mode === "menu"
                ? "listening"
                : !cue && !activity.busy && activity.actionId === "reviewing"
                  ? "idle"
                  : undefined
          }
        />
      }
      chatAvatar={<CompanionAvatar size={32} />}
    >
      <div hidden={settingsOpen} className="h-full min-h-0">
        {children}
      </div>
      {settingsOpen ? (
        <div className="h-full overflow-y-auto p-4">
          <SuiteCompanionSettings />
        </div>
      ) : null}
    </SuiteFloatingAssistant>
  );
}
