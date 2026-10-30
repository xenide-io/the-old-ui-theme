"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export interface CompanionCharacter {
  id: string;
  faces: Record<string, string>;
  fixed_mouth?: boolean;
  signature_speech?: boolean;
}

export type CompanionPalette = {
  bg: string;
  fg: string;
  accents: string[];
};

export interface CompanionCatalogue {
  motion_css?: string;
  characters: Array<{ id: string; name: string }>;
  themes: Array<{
    id: string;
    name: string;
    bg: string;
    fg: string;
    accents: string[];
  }>;
  forms: Array<{
    id: string;
    path: string;
    rest: string;
    dot: string;
    dot_rest: string;
    face: string | null;
  }>;
  actions: Array<{
    id: string;
    label: string;
    form: string;
    expression: string;
    detail: string;
    hide_face?: boolean;
    motion?: string;
    gaze?: string;
  }>;
}

/** Outlined, build-time assets only. Hosts supply trusted first-party character data. */
export function SuiteCompanion({
  catalogue,
  character,
  themeId,
  palette,
  actionId = "idle",
  size = 48,
  motion = true,
}: {
  catalogue: CompanionCatalogue;
  character: CompanionCharacter;
  themeId?: string;
  palette?: CompanionPalette;
  actionId?: string;
  size?: number;
  motion?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const outlineRef = useRef<SVGPathElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const previousPath = useRef<string | null>(null);
  const [visible, setVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const theme = palette ?? catalogue.themes.find((t) => t.id === themeId) ?? {
    bg: "var(--ph-surface, #ffffff)",
    fg: "var(--ph-text-primary, #202124)",
    accents: [
      "var(--ph-accent, #5070bf)",
      "var(--ph-violet, #9874bb)",
      "var(--ph-warning, #bd824a)",
    ],
  };
  const action =
    catalogue.actions.find((a) => a.id === actionId) ??
    catalogue.actions.find((a) => a.id === "idle")!;
  const form = catalogue.forms.find((f) => f.id === action.form)!;
  const face = character.faces[action.expression] ?? character.faces.ready;
  const showFace = !!form.face && !action.hide_face;

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useLayoutEffect(() => {
    const node = outlineRef.current;
    const from = previousPath.current;
    previousPath.current = form.path;
    if (
      !node ||
      !motion ||
      !visible ||
      !from ||
      from === form.path ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.reduceMotion === "true" ||
      !CSS.supports("d", `path("${form.path}")`)
    )
      return;
    const animation = node.animate(
      [{ d: `path("${from}")` }, { d: `path("${form.path}")` }],
      { duration: 280, easing: "ease-in-out" },
    );
    const faceAnimation = faceRef.current?.animate(
      [{ opacity: 0 }, { opacity: 0, offset: 0.95 }, { opacity: 1 }],
      { duration: 280 },
    );
    return () => {
      animation.cancel();
      faceAnimation?.cancel();
    };
  }, [form.path, motion, visible]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      data-companion={character.id}
      data-action={action.id}
      className={`suite-companion emotion-${action.expression}${character.fixed_mouth ? " fixed-mouth" : ""}${character.signature_speech ? " signature-speech" : ""}${!motion || !visible ? " still" : ""}`}
      data-motion={motion && visible ? "on" : "off"}
      data-active={
        ![
          "idle",
          "error",
          "cancelled",
          "success",
          "awaiting-approval",
          "awaiting-input",
        ].includes(action.id)
      }
      style={
        {
          color: theme.fg,
          display: "block",
          flexShrink: 0,
          "--blink": "7s",
          "--emotion-delay": "0s",
        } as CSSProperties
      }
    >
      <style>
        {catalogue.motion_css ?? ""}
        {`.suite-companion .terminal-body{transform-box:view-box;transform-origin:32px 32px}.suite-companion[data-motion=on][data-active=true] .terminal-body{animation:suite-friend-work 1.8s ease-in-out infinite}.suite-companion[data-motion=on] .friend-detail{animation:suite-friend-detail 2.4s ease-in-out infinite}@keyframes suite-friend-work{0%,100%{transform:translateY(1px) rotate(-2deg) scale(.94)}50%{transform:translateY(-1.5px) rotate(2deg) scale(.94)}}@keyframes suite-friend-detail{0%,100%{opacity:.65}50%{opacity:1}}@media(prefers-reduced-motion:reduce){.suite-companion *{animation:none!important}}html[data-reduce-motion=true] .suite-companion *{animation:none!important}`}
      </style>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          {theme.accents.slice(0, 3).map((colour, i) => (
            <stop key={i} offset={i / 2} stopColor={colour} />
          ))}
        </linearGradient>
      </defs>
      <g className="terminal-body">
        <path
          ref={outlineRef}
          d={form.path}
          fill={theme.bg}
          stroke={`url(#${id})`}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {form.dot !== form.dot_rest ? (
          <path
            d={form.dot}
            fill={theme.bg}
            stroke={`url(#${id})`}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        ) : null}
        {showFace ? (
          <g
            ref={faceRef}
            style={{
              transform: form.face!,
              transformBox: "view-box",
              transformOrigin: "0 0",
            }}
            dangerouslySetInnerHTML={{ __html: face }}
          />
        ) : null}
        <path
          className="friend-detail"
          d={action.detail || "M32 32"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
