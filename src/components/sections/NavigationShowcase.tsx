"use client";

import { IconBell, IconPerson } from "@/components/icons";
import { Button, DropdownItem, DropdownMenu, SearchInput, ShowcaseWrapper } from "@/components/ui";

export default function NavigationShowcase() {
  const code = `import { IconBell, IconPerson } from "the-old-ui";
import { Button, DropdownItem, DropdownMenu, SearchInput } from "the-old-ui";

<div className="space-y-8">
  <div className="ph-panel">
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Top bar density</h3>
    <div className="ph-navbar-demo justify-between gap-4">
      <span className="text-lg font-bold text-ph-brand">posthog</span>
      <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
        <SearchInput
          label="Jump to"
          hideLabel
          shortcut="Cmd K"
          placeholder="Jump to…"
          density="compact"
        />
        <Button type="button" variant="ghost" shape="circle" className="relative" aria-label="Notifications">
          <IconBell className="h-5 w-5 text-ph-mutedtext" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ph-brand ring-2 ring-ph-surface" />
        </Button>
        <DropdownMenu
          align="end"
          aria-label="Account menu"
          trigger={
            <span className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-ph-muted text-ph-ink">
              <IconPerson className="h-5 w-5" aria-hidden />
            </span>
          }
        >
          <DropdownItem>Personal API keys</DropdownItem>
          <DropdownItem>Organisation settings</DropdownItem>
        </DropdownMenu>
      </div>
    </div>
  </div>

  <div className="ph-panel flex gap-10">
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Side navigation</h3>
      <ul className="w-52 space-y-1 text-sm font-medium">
        <li>
          <a href="#" className="block rounded-md bg-ph-muted px-3 py-2 text-ph-ink">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="block rounded-md px-3 py-2 text-ph-subtle hover:bg-ph-muted/70">
            Data pipeline
          </a>
        </li>
        <li>
          <details open className="ph-details [&>summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer list-none px-3 py-2 text-ph-mutedtext">Warehouse</summary>
            <ul className="mt-1 space-y-1 border-l border-ph-border pl-5">
              <li>
                <a href="#" className="block py-1 text-ph-subtle hover:text-ph-ink">
                  Sources
                </a>
              </li>
              <li>
                <a href="#" className="block py-1 text-ph-subtle hover:text-ph-ink">
                  Views
                </a>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>

    <div className="flex-1">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Timeline steps</h3>
      <ol className="ph-steps">
        <li className="flex flex-col items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ph-brand text-xs font-bold text-white">
            1
          </span>
          <span>Install snippet</span>
        </li>
        <li className="flex flex-col items-center gap-2 opacity-60">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-ph-border text-xs">
            2
          </span>
          <span>Send test event</span>
        </li>
        <li className="flex flex-col items-center gap-2 opacity-60">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-ph-border text-xs">
            3
          </span>
          <span>Invite team</span>
        </li>
      </ol>
    </div>
  </div>
</div>`;

  return (
    <ShowcaseWrapper title="Navigation chrome" code={code} filename="NavigationExample.tsx">
      <div className="space-y-8">
        <div className="ph-panel">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Top bar density</h3>
          <div className="ph-navbar-demo justify-between gap-4">
            <span className="text-lg font-bold text-ph-brand">posthog</span>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <SearchInput
                label="Jump to"
                hideLabel
                shortcut="Cmd K"
                placeholder="Jump to…"
                density="compact"
              />
              <Button type="button" variant="ghost" shape="circle" className="relative" aria-label="Notifications">
                <IconBell className="h-5 w-5 text-ph-mutedtext" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ph-brand ring-2 ring-ph-surface" />
              </Button>
              <DropdownMenu
                align="end"
                aria-label="Account menu"
                trigger={
                  <span className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-ph-muted text-ph-ink">
                    <IconPerson className="h-5 w-5" aria-hidden />
                  </span>
                }
              >
                <DropdownItem>Personal API keys</DropdownItem>
                <DropdownItem>Organisation settings</DropdownItem>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="ph-panel flex gap-10">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Side navigation</h3>
            <ul className="w-52 space-y-1 text-sm font-medium">
              <li>
                <a href="#" className="block rounded-md bg-ph-muted px-3 py-2 text-ph-ink">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="block rounded-md px-3 py-2 text-ph-subtle hover:bg-ph-muted/70">
                  Data pipeline
                </a>
              </li>
              <li>
                <details open className="ph-details [&>summary::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer list-none px-3 py-2 text-ph-mutedtext">Warehouse</summary>
                  <ul className="mt-1 space-y-1 border-l border-ph-border pl-5">
                    <li>
                      <a href="#" className="block py-1 text-ph-subtle hover:text-ph-ink">
                        Sources
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block py-1 text-ph-subtle hover:text-ph-ink">
                        Views
                      </a>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>

          <div className="flex-1">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">Timeline steps</h3>
            <ol className="ph-steps">
              <li className="flex flex-col items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ph-brand text-xs font-bold text-white">
                  1
                </span>
                <span>Install snippet</span>
              </li>
              <li className="flex flex-col items-center gap-2 opacity-60">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-ph-border text-xs">
                  2
                </span>
                <span>Send test event</span>
              </li>
              <li className="flex flex-col items-center gap-2 opacity-60">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-ph-border text-xs">
                  3
                </span>
                <span>Invite team</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}
