import type { ComponentType, CSSProperties } from "react";
import {
  CANONICAL_ICONS,
  OLD_UI_ICONS,
  IconAreaChart, IconDatabase, IconFlag, IconFlask, IconGridView, IconRecording, IconSurveys,
  IconChrome, IconFirefox, IconSafari, IconFacebook, IconGoogle, IconGitlab, IconSlack, IconMicrosoftTeams,
  IconMacOS, IconAppleIOS, IconWindows, IconLinux, IconAndroidOS,
  IconWeb, IconMonitor, IconBold, IconItalic, IconLink, IconPreview, IconEyeHidden,
  IconFullScreen, IconMenu, IconGhost, IconReplay, IconHeatmap, IconPauseCircle,
  IconSkipBackward, IconSkipStart, IconSkipEnd, IconDragHandle, IconFingerprint, IconNodeJS, IconStamphog,
  IconPalette, IconMegaphone, IconMap, IconMapPin, IconCoffee, IconBook, IconCalendar,
  IconClock, IconGlobe, IconCloud, IconBug, IconCrown, IconConfetti, IconLightBulb,
  IconHourglass, IconStore, IconCart, IconEye, IconPeople, IconGroups, IconDocument,
  IconAI, IconArchive, IconAtSign, IconBinary, IconGear, IconChat, IconFolder,
  IconHeart, IconHomeFilled, IconImage, IconLock, IconMic, IconMusic, IconPhone,
  IconRefresh, IconReply, IconReport, IconFilter, IconPlus, IconCheck, IconClose,
  type CanonicalIconName,
  type IconProps,
} from "@/components/icons";
import { Kbd, ShowcaseWrapper } from "@/components/ui";

const iconCells = Object.entries(CANONICAL_ICONS) as Array<[
  CanonicalIconName,
  ComponentType<IconProps>,
]>;

const originalIcons = Object.entries(OLD_UI_ICONS) as Array<[
  keyof typeof OLD_UI_ICONS,
  ComponentType<IconProps>,
]>;

const categoryIcons = [
  { Icon: IconPalette, label: "Palette" }, { Icon: IconMegaphone, label: "Megaphone" },
  { Icon: IconMap, label: "Map" }, { Icon: IconMapPin, label: "Pin" },
  { Icon: IconCoffee, label: "Coffee" }, { Icon: IconBook, label: "Book" },
  { Icon: IconCalendar, label: "Calendar" }, { Icon: IconClock, label: "Clock" },
  { Icon: IconGlobe, label: "Globe" }, { Icon: IconCloud, label: "Cloud" },
  { Icon: IconBug, label: "Bug" }, { Icon: IconCrown, label: "Crown" },
  { Icon: IconConfetti, label: "Confetti" }, { Icon: IconLightBulb, label: "Bulb" },
  { Icon: IconHourglass, label: "Hourglass" }, { Icon: IconStore, label: "Store" },
  { Icon: IconCart, label: "Cart" }, { Icon: IconEye, label: "Eye" },
  { Icon: IconPeople, label: "People" }, { Icon: IconGroups, label: "Groups" },
  { Icon: IconDocument, label: "Document" }, { Icon: IconAI, label: "AI" },
  { Icon: IconArchive, label: "Archive" }, { Icon: IconAtSign, label: "At" },
  { Icon: IconBinary, label: "Binary" }, { Icon: IconGear, label: "Gear" },
  { Icon: IconChat, label: "Chat" }, { Icon: IconFolder, label: "Folder" },
  { Icon: IconHeart, label: "Heart" }, { Icon: IconImage, label: "Image" },
  { Icon: IconLock, label: "Lock" }, { Icon: IconMic, label: "Mic" },
  { Icon: IconMusic, label: "Music" }, { Icon: IconPhone, label: "Phone" },
  { Icon: IconRefresh, label: "Refresh" }, { Icon: IconReply, label: "Reply" },
  { Icon: IconReport, label: "Report" }, { Icon: IconFilter, label: "Filter" },
];

const lemonIcons = [
  { Icon: IconChrome, label: "Chrome" },
  { Icon: IconFirefox, label: "Firefox" },
  { Icon: IconSafari, label: "Safari" },
  { Icon: IconFacebook, label: "Facebook" },
  { Icon: IconGoogle, label: "Google" },
  { Icon: IconGitlab, label: "Gitlab" },
  { Icon: IconSlack, label: "Slack" },
  { Icon: IconMicrosoftTeams, label: "Teams" },
  { Icon: IconMacOS, label: "macOS" },
  { Icon: IconAppleIOS, label: "iOS" },
  { Icon: IconWindows, label: "Windows" },
  { Icon: IconLinux, label: "Linux" },
  { Icon: IconAndroidOS, label: "Android" },
  { Icon: IconWeb, label: "Web" },
  { Icon: IconMonitor, label: "Monitor" },
  { Icon: IconBold, label: "Bold" },
  { Icon: IconItalic, label: "Italic" },
  { Icon: IconLink, label: "Link" },
  { Icon: IconPreview, label: "Preview" },
  { Icon: IconEyeHidden, label: "EyeHidden" },
  { Icon: IconFullScreen, label: "FullScreen" },
  { Icon: IconMenu, label: "Menu" },
  { Icon: IconGhost, label: "Ghost" },
  { Icon: IconReplay, label: "Replay" },
  { Icon: IconHeatmap, label: "Heatmap" },
  { Icon: IconPauseCircle, label: "Pause" },
  { Icon: IconSkipBackward, label: "SkipBack" },
  { Icon: IconSkipStart, label: "SkipStart" },
  { Icon: IconSkipEnd, label: "SkipEnd" },
  { Icon: IconDragHandle, label: "DragHandle" },
  { Icon: IconFingerprint, label: "Fingerprint" },
  { Icon: IconNodeJS, label: "NodeJS" },
  { Icon: IconStamphog, label: "Stamphog" },
];

const productTiles = [
  { label: "Session replay", Icon: IconRecording, color: "--ph-product-session-replay" },
  { label: "Product analytics", Icon: IconAreaChart, color: "--ph-product-product-analytics" },
  { label: "Data pipeline", Icon: IconGridView, color: "--ph-product-data-pipeline" },
  { label: "Feature flags", Icon: IconFlag, color: "--ph-product-feature-flags" },
  { label: "Experiments", Icon: IconFlask, color: "--ph-product-experiments" },
  { label: "Data warehouse", Icon: IconDatabase, color: "--ph-product-data-warehouse" },
  { label: "Surveys", Icon: IconSurveys, color: "--ph-product-surveys" },
];

export default function IconShowcase() {
  const code = `import {
  IconCommandCursor,
  IconDataReel,
  IconInsightBoard,
  IconOldWindow,
} from "@xenide-io/the-old-ui-theme";

<div className="flex items-center gap-4 text-ph-ink">
  <IconOldWindow size={16} />
  <IconCommandCursor size={20} />
  <IconDataReel size={24} />
  <IconInsightBoard size={24} aria-label="Insights" />
</div>`;

  return (
    <ShowcaseWrapper
      title="Icons"
      description="A canonical filled SVG registry with PostHog/Material foundations and clearly identified Old UI originals."
      code={code}
      filename="IconExample.tsx"
    >
      <div className="space-y-8">
        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Old UI originals</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Authored 24px glyphs for retro interface and analytics concepts. Each uses <Kbd variant="token">currentColor</Kbd>, a filled silhouette, and enough negative space to survive at 16px.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {originalIcons.map(([name, Icon]) => (
              <div key={name} className="flex flex-col items-center gap-3 rounded-lg border border-ph-border-subtle bg-ph-raised p-4 text-center">
                <div className="flex h-9 items-center gap-2 text-ph-ink">
                  <Icon size={16} />
                  <Icon size={24} />
                </div>
                <span className="max-w-full break-words text-xs font-medium text-ph-subtle">{formatName(name)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Canonical registry</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Documentation is generated from <Kbd variant="token">CANONICAL_ICONS</Kbd>. Compatibility aliases remain available through <Kbd variant="token">PH_ICONS</Kbd> without duplicating this inventory.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {iconCells.map(([name, Icon]) => (
              <div key={name} className="flex min-w-0 flex-col items-center gap-2 rounded-lg border border-ph-border-subtle bg-ph-raised p-3 text-center">
                <div className="flex h-8 items-center gap-2 text-ph-ink">
                  <Icon size={16} />
                  <Icon size={24} />
                </div>
                <span className="max-w-full break-words text-[10px] font-medium tracking-wide text-ph-mutedtext">{name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Common icons (PostHog categories)</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Everyday UI icons ported from PostHog&apos;s categories set.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {categoryIcons.map(({ Icon, label }) => (
              <div key={label} className="flex min-w-0 flex-col items-center gap-2 rounded-lg border border-ph-border-subtle bg-ph-raised p-3 text-center">
                <div className="flex h-8 items-center gap-2 text-ph-ink">
                  <Icon size={16} />
                  <Icon size={24} />
                </div>
                <span className="max-w-full break-words text-[10px] font-medium tracking-wide text-ph-mutedtext">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Lemon icons (PostHog port)</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Browser, OS, brand, and UI icons ported from PostHog&apos;s lemon-ui icon set.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {lemonIcons.map(({ Icon, label }) => (
              <div key={label} className="flex min-w-0 flex-col items-center gap-2 rounded-lg border border-ph-border-subtle bg-ph-raised p-3 text-center">
                <div className="flex h-8 items-center gap-2 text-ph-ink">
                  <Icon size={16} />
                  <Icon size={24} />
                </div>
                <span className="max-w-full break-words text-[10px] font-medium tracking-wide text-ph-mutedtext">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="ph-panel space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Product hues</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ph-subtle">
              Product color is used as a subtle tint and icon accent instead of assuming white foregrounds on every theme.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {productTiles.map(({ label, Icon, color }) => (
              <div
                key={label}
                className="ph-icon-tile ph-product-icon-tile"
                style={{ "--ph-icon-tile-color": `var(${color})` } as CSSProperties}
              >
                <Icon className="mb-1" size={28} />
                <span className="max-w-full px-1 text-center normal-case tracking-normal">{label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ShowcaseWrapper>
  );
}

function formatName(name: string) {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}
