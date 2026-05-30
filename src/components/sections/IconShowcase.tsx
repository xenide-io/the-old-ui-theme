/**
 * Bespoke Lemon glyphs from PostHog open source — filled Material / product paths,
 * not Lucide stroke icons.
 */
import {
  IconActivity,
  IconAreaChart,
  IconArrowDown,
  IconArrowUp,
  IconBell,
  IconBellOff,
  IconBolt,
  IconBox,
  IconCancel,
  IconCheck,
  IconCheckCircle,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardEdit,
  IconClose,
  IconCohort,
  IconCopy,
  IconCumulativeChart,
  IconDatabase,
  IconDownload,
  IconEdit,
  IconErrorOutline,
  IconExclamation,
  IconFlag,
  IconFlare,
  IconFlask,
  IconGift,
  IconGridView,
  IconHandClick,
  IconHome,
  IconLayers,
  IconListView,
  IconLogout,
  IconMail,
  IconMoon,
  IconPanelRight,
  IconPerson,
  IconPlayCircle,
  IconPlus,
  IconPremium,
  IconQueryEditor,
  IconRadar,
  IconRecording,
  IconRobot,
  IconRocket,
  IconSave,
  IconSearch,
  IconSelectEvents,
  IconStar,
  IconSubArrowRight,
  IconSun,
  IconSurveys,
  IconSync,
  IconTableChart,
  IconTerminal,
  IconToggle,
  IconTrash,
  IconTuning,
  IconUpload,
  IconVolume,
  IconVolumeOff,
  PH_ICONS,
  type IconName,
} from "@/components/icons";
import { ShowcaseWrapper } from "@/components/ui";

const iconCells: { name: IconName; Icon: (typeof PH_ICONS)[IconName] }[] = [
  { name: "activity", Icon: IconActivity },
  { name: "areaChart", Icon: IconAreaChart },
  { name: "arrowUp", Icon: IconArrowUp },
  { name: "arrowDown", Icon: IconArrowDown },
  { name: "bell", Icon: IconBell },
  { name: "bellOff", Icon: IconBellOff },
  { name: "bolt", Icon: IconBolt },
  { name: "box", Icon: IconBox },
  { name: "cancel", Icon: IconCancel },
  { name: "check", Icon: IconCheck },
  { name: "checkCircle", Icon: IconCheckCircle },
  { name: "chevronDown", Icon: IconChevronDown },
  { name: "chevronLeft", Icon: IconChevronLeft },
  { name: "chevronRight", Icon: IconChevronRight },
  { name: "clipboard", Icon: IconClipboardEdit },
  { name: "close", Icon: IconClose },
  { name: "cohort", Icon: IconCohort },
  { name: "copy", Icon: IconCopy },
  { name: "cumulativeChart", Icon: IconCumulativeChart },
  { name: "database", Icon: IconDatabase },
  { name: "download", Icon: IconDownload },
  { name: "edit", Icon: IconEdit },
  { name: "errorOutline", Icon: IconErrorOutline },
  { name: "exclamation", Icon: IconExclamation },
  { name: "flag", Icon: IconFlag },
  { name: "flare", Icon: IconFlare },
  { name: "flask", Icon: IconFlask },
  { name: "gift", Icon: IconGift },
  { name: "grid", Icon: IconGridView },
  { name: "handClick", Icon: IconHandClick },
  { name: "home", Icon: IconHome },
  { name: "layers", Icon: IconLayers },
  { name: "list", Icon: IconListView },
  { name: "logout", Icon: IconLogout },
  { name: "mail", Icon: IconMail },
  { name: "moon", Icon: IconMoon },
  { name: "panelRight", Icon: IconPanelRight },
  { name: "person", Icon: IconPerson },
  { name: "play", Icon: IconPlayCircle },
  { name: "plus", Icon: IconPlus },
  { name: "premium", Icon: IconPremium },
  { name: "queryEditor", Icon: IconQueryEditor },
  { name: "radar", Icon: IconRadar },
  { name: "recording", Icon: IconRecording },
  { name: "robot", Icon: IconRobot },
  { name: "rocket", Icon: IconRocket },
  { name: "save", Icon: IconSave },
  { name: "search", Icon: IconSearch },
  { name: "selectEvents", Icon: IconSelectEvents },
  { name: "settings", Icon: IconTuning },
  { name: "star", Icon: IconStar },
  { name: "subArrowRight", Icon: IconSubArrowRight },
  { name: "sun", Icon: IconSun },
  { name: "surveys", Icon: IconSurveys },
  { name: "sync", Icon: IconSync },
  { name: "tableChart", Icon: IconTableChart },
  { name: "terminal", Icon: IconTerminal },
  { name: "toggle", Icon: IconToggle },
  { name: "trash", Icon: IconTrash },
  { name: "upload", Icon: IconUpload },
  { name: "volume", Icon: IconVolume },
  { name: "volumeOff", Icon: IconVolumeOff },
];

const colourTiles = [
  { label: "Session replay", Icon: IconRecording, fg: "--ph-product-session-replay" as const },
  { label: "Product analytics", Icon: IconAreaChart, fg: "--ph-product-product-analytics" as const },
  { label: "Data pipeline", Icon: IconGridView, fg: "--ph-product-data-pipeline" as const },
  { label: "Feature flags", Icon: IconFlag, fg: "--ph-product-feature-flags" as const },
  { label: "Experiments", Icon: IconFlask, fg: "--ph-product-experiments" as const },
  { label: "Data warehouse", Icon: IconDatabase, fg: "--ph-product-data-warehouse" as const },
  { label: "Surveys", Icon: IconSurveys, fg: "--ph-product-surveys" as const },
];

export default function IconShowcase() {
  const code = `import { IconActivity, IconAreaChart, IconArrowDown, IconArrowUp, IconBell, IconBellOff, IconBolt, IconBox, IconCancel, IconCheck, IconCheckCircle, IconChevronDown, IconChevronLeft, IconChevronRight, IconClipboardEdit, IconClose, IconCohort, IconCopy, IconCumulativeChart, IconDatabase, IconDownload, IconEdit, IconErrorOutline, IconExclamation, IconFlag, IconFlare, IconFlask, IconGift, IconGridView, IconHandClick, IconHome, IconLayers, IconListView, IconLogout, IconMail, IconMoon, IconPanelRight, IconPerson, IconPlayCircle, IconPlus, IconPremium, IconQueryEditor, IconRadar, IconRecording, IconRobot, IconRocket, IconSave, IconSearch, IconSelectEvents, IconStar, IconSubArrowRight, IconSun, IconSurveys, IconSync, IconTableChart, IconTerminal, IconToggle, IconTrash, IconTuning, IconUpload, IconVolume, IconVolumeOff, PH_ICONS, type IconName } from "the-old-ui";

<div className="space-y-8">
  <div className="ph-panel space-y-4">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Bespoke Lemon glyphs</h3>
    <p className="text-sm leading-relaxed text-ph-subtle">
      Paths mirror PostHog&apos;s Lemon UI — filled{" "}
      <code className="ph-kbd">currentColor</code> SVGs at <code className="ph-kbd">1em</code>, vendored in{" "}
      <code className="ph-kbd">the-old-ui</code> (no Lucide).
    </p>

    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {iconCells.map(({ name, Icon }) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-[var(--ph-radius-app)] border border-ph-border bg-ph-surface p-4 text-center"
          style={{ boxShadow: "var(--ph-shadow-elevation-3000)" }}
        >
          <Icon className="h-6 w-6 text-ph-ink" />
          <span className="text-[10px] font-medium uppercase tracking-wide text-ph-mutedtext">{name}</span>
        </div>
      ))}
    </div>
  </div>

  <div className="ph-panel space-y-4">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Product rail hues</h3>
    <p className="text-sm leading-relaxed text-ph-subtle">
      In-app nav tiles use saturated backgrounds with light glyphs — tokens map to{" "}
      <code className="ph-kbd">--ph-product-*</code> in <code className="ph-kbd">globals.css</code>.
    </p>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {colourTiles.map(({ label, Icon, fg }) => (
        <div
          key={label}
          className="ph-icon-tile border-white/15 text-white"
          style={{ backgroundColor: \`var(\${fg})\` }}
        >
          <Icon className="mb-1 h-7 w-7 drop-shadow-sm" />
          <span className="max-w-full truncate px-1 text-center normal-case tracking-normal">{label}</span>
        </div>
      ))}
    </div>
  </div>
</div>`;

  return (
    <ShowcaseWrapper
      title="Icons"
      description="Bespoke Lemon glyphs from PostHog open source — filled Material / product paths, not Lucide stroke icons."
      code={code}
      filename="IconExample.tsx"
    >
      <div className="space-y-8">
        <div className="ph-panel space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Bespoke Lemon glyphs</h3>
          <p className="text-sm leading-relaxed text-ph-subtle">
            Paths mirror PostHog&apos;s Lemon UI — filled{" "}
            <code className="ph-kbd">currentColor</code> SVGs at <code className="ph-kbd">1em</code>, vendored in{" "}
            <code className="ph-kbd">the-old-ui</code> (no Lucide).
          </p>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {iconCells.map(({ name, Icon }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-[var(--ph-radius-app)] border border-ph-border bg-ph-surface p-4 text-center"
                style={{ boxShadow: "var(--ph-shadow-elevation-3000)" }}
              >
                <Icon className="h-6 w-6 text-ph-ink" />
                <span className="text-[10px] font-medium uppercase tracking-wide text-ph-mutedtext">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ph-panel space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">Product rail hues</h3>
          <p className="text-sm leading-relaxed text-ph-subtle">
            In-app nav tiles use saturated backgrounds with light glyphs — tokens map to{" "}
            <code className="ph-kbd">--ph-product-*</code> in <code className="ph-kbd">globals.css</code>.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {colourTiles.map(({ label, Icon, fg }) => (
              <div
                key={label}
                className="ph-icon-tile border-white/15 text-white"
                style={{ backgroundColor: `var(${fg})` }}
              >
                <Icon className="mb-1 h-7 w-7 drop-shadow-sm" />
                <span className="max-w-full truncate px-1 text-center normal-case tracking-normal">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShowcaseWrapper>
  );
}
