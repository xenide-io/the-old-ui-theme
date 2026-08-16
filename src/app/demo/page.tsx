import Link from "next/link";

import { DemoPage } from "./demo-page";

const demos = [
  {
    href: "/demo/foundations",
    eyebrow: "Tokens, type, icons, setup",
    title: "Foundations & themes",
    description:
      "The type scale, colour contracts, icon inventory, and theme switching.",
  },
  {
    href: "/demo/components",
    eyebrow: "Primitives",
    title: "Components",
    description:
      "Buttons, inputs, navigation, feedback, and the everyday building blocks.",
  },
  {
    href: "/demo/patterns",
    eyebrow: "Composed UI",
    title: "Patterns",
    description:
      "Auth, settings, overlays, filters, loading states, and reusable layouts.",
  },
  {
    href: "/demo/suite",
    eyebrow: "Shared product chrome",
    title: "Suite",
    description:
      "The shared sidebar, app shell, mobile navigation, and settings patterns.",
  },
];

export default function DemoIndexPage() {
  return (
    <DemoPage
      eyebrow="The Old UI"
      title="Choose a focused demo"
      description="The catalogue is split by job now. Each route mounts only its own showcase family, so browsing components does not load the entire lab at once."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {demos.map((demo) => (
          <Link
            key={demo.href}
            href={demo.href}
            className="group rounded-2xl border border-ph-border bg-ph-surface p-5 shadow-sm transition-colors hover:border-ph-accent hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ph-mutedtext">
              {demo.eyebrow}
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-ph-ink group-hover:text-ph-brand">
              {demo.title}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ph-subtle">
              {demo.description}
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-ph-brand">
              Open demo{" "}
              <span aria-hidden className="ml-1">
                -&gt;
              </span>
            </span>
          </Link>
        ))}
      </div>
    </DemoPage>
  );
}
