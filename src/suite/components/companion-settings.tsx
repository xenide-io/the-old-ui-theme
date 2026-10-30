"use client";

import { Button, Card, Toggle } from "../../components/ui";
import { openSuiteAskAi } from "./ai-panel";
import { CompanionAvatar, useCompanion } from "./companion-provider";

export function SuiteCompanionSettings() {
  const {
    preferences,
    update,
    catalogue,
    assetError,
    sharedCharacterId,
    appCharacters,
    setAppCharacter,
    syncStatus,
    syncError,
    retrySync,
  } = useCompanion();
  return (
    <div className="space-y-6" data-test="assistant-settings">
      <div>
        <h2 className="text-ph-ink text-xl font-semibold">Companion</h2>
        <p className="text-ph-subtle mt-1 text-sm">
          One companion character per app. Dot is the default. Your choices are
          saved to your account across apps and devices. Each app sets the
          companion colours for its own light and dark themes.
        </p>
      </div>
      <Card>
        <div className="space-y-5">
          <Toggle
            checked={preferences.enabled}
            onChange={(event) => update({ enabled: event.target.checked })}
            label="Show floating friend"
          />
          <div className="flex items-center gap-4">
            <CompanionAvatar />
            <p className="text-ph-subtle text-sm">
              48px on your workspace; 32px inside chat. Your friend comes to the
              action when summoned, then returns home. No dragging needed.
            </p>
          </div>
          {assetError ? (
            <p role="alert" className="text-ph-danger text-sm">
              {assetError}
            </p>
          ) : null}
          <label className="block text-sm font-medium">
            Shared default character
            <select
              data-test="assistant-character"
              className="ph-select ph-select-quiet mt-2 block w-full"
              value={sharedCharacterId ?? preferences.characterId}
              disabled={!catalogue}
              onChange={(event) => update({ characterId: event.target.value })}
            >
              {catalogue?.characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {setAppCharacter ? (
            <fieldset className="space-y-3">
              <legend className="mb-2 text-sm font-medium">
                Character in each app
              </legend>
              <p className="text-ph-subtle text-xs">
                Use the shared default, or give an app its own character. The
                same character appears everywhere inside that app.
              </p>
              {(
                [
                  ["turtletime", "TurtleTime"],
                  ["tides", "Tides"],
                  ["shellstack", "ShellStack"],
                  ["kraken", "Kraken"],
                  ["shelly", "ShellHub"],
                ] as const
              ).map(([app, name]) => (
                <label key={app} className="block text-sm">
                  {name}
                  <select
                    className="ph-select ph-select-quiet mt-1 w-full"
                    data-test={`assistant-character-${app}`}
                    value={appCharacters?.[app]?.characterId ?? ""}
                    disabled={!catalogue}
                    onChange={(event) =>
                      setAppCharacter(app, event.target.value || null)
                    }
                  >
                    <option value="">
                      Shared default (
                      {catalogue?.characters.find(
                        (c) => c.id === sharedCharacterId,
                      )?.name ?? "Dot"}
                      )
                    </option>
                    {catalogue?.characters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </fieldset>
          ) : null}
          <Toggle
            checked={preferences.motion}
            onChange={(event) => update({ motion: event.target.checked })}
            label="Animate the friend (system reduced motion takes priority)"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => openSuiteAskAi()}>Open assistant</Button>
            <Button
              variant="secondary"
              disabled={!catalogue}
              onClick={() => {
                if (!catalogue) return;
                const [pick] = crypto.getRandomValues(new Uint32Array(1));
                update({
                  characterId:
                    catalogue.characters[pick % catalogue.characters.length]
                      .id,
                });
              }}
            >
              Roll character
            </Button>
          </div>
          <p role="status" className="text-ph-subtle text-xs">
            {syncStatus}
          </p>
          {syncError ? (
            <div role="alert" className="text-ph-danger text-sm">
              {syncError}
              <Button variant="secondary" onClick={retrySync}>
                Retry sync
              </Button>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
