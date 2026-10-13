"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Check, NavArrowDown } from "iconoir-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/cn";

export interface ColorOption {
  /** Stored value. Empty string means "use the default colour". */
  value: string;
  label: string;
  /** Any CSS colour; omit on the default option (it uses `defaultColour`). */
  colour?: string;
}

/** Label-friendly hues that stay legible on light and dark surfaces. */
export const DEFAULT_COLOR_OPTIONS: ColorOption[] = [
  { value: "", label: "Default" },
  { value: "#ef4444", label: "Red", colour: "#ef4444" },
  { value: "#f97316", label: "Orange", colour: "#f97316" },
  { value: "#eab308", label: "Yellow", colour: "#eab308" },
  { value: "#22c55e", label: "Green", colour: "#22c55e" },
  { value: "#14b8a6", label: "Teal", colour: "#14b8a6" },
  { value: "#3b82f6", label: "Blue", colour: "#3b82f6" },
  { value: "#8b5cf6", label: "Purple", colour: "#8b5cf6" },
  { value: "#ec4899", label: "Pink", colour: "#ec4899" },
];

/** The named presets without the empty "Default" entry, for fields that must hold a colour. */
export const NAMED_COLOR_OPTIONS: ColorOption[] = DEFAULT_COLOR_OPTIONS.filter(
  (option) => option.value,
);

const HEX = /^#[0-9a-f]{6}$/i;

interface Hsv {
  h: number; // 0–360
  s: number; // 0–1
  v: number; // 0–1
}

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

function hexToHsv(hex: string): Hsv {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  let h = 0;
  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max };
}

function hsvToHex({ h, s, v }: Hsv): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return `#${[f(5), f(3), f(1)]
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** Drag (or arrow-key) a 0–1 position inside an element. */
function useDrag(onMove: (x: number, y: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const update = (event: ReactPointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return;
    onMove(
      clamp((event.clientX - rect.left) / rect.width),
      clamp((event.clientY - rect.top) / rect.height),
    );
  };
  return {
    ref,
    onPointerDown: (event: ReactPointerEvent) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      update(event);
    },
    onPointerMove: (event: ReactPointerEvent) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event);
    },
  };
}

function Swatch({ colour, className }: { colour: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("ph-colour-swatch", className)}
      style={{ backgroundColor: colour }}
    />
  );
}

/** Saturation/brightness square, hue slider and hex field. */
function ColorPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value));
  const [draft, setDraft] = useState(value);

  // Follow outside changes (preset click) without losing hue at grey/black.
  useEffect(() => {
    if (hsvToHex(hsv) !== value.toLowerCase()) setHsv(hexToHsv(value));
    setDraft(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the incoming value
  }, [value]);

  const commit = (next: Hsv) => {
    setHsv(next);
    onChange(hsvToHex(next));
  };

  const area = useDrag((x, y) => commit({ ...hsv, s: x, v: 1 - y }));
  const hue = useDrag((x) => commit({ ...hsv, h: x * 360 }));

  const nudge = (event: ReactKeyboardEvent, apply: (step: number) => Hsv) => {
    const step = event.shiftKey ? 0.1 : 0.02;
    const dir: Record<string, number> = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
    };
    if (!(event.key in dir)) return;
    event.preventDefault();
    commit(apply(dir[event.key] * step));
  };

  return (
    <div className="ph-colour-picker">
      <div
        {...area}
        role="slider"
        tabIndex={0}
        aria-label="Colour saturation and brightness"
        aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
        className="ph-colour-area"
        style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
        onKeyDown={(event) => {
          const horizontal =
            event.key === "ArrowLeft" || event.key === "ArrowRight";
          nudge(event, (step) =>
            horizontal
              ? { ...hsv, s: clamp(hsv.s + step) }
              : { ...hsv, v: clamp(hsv.v + step) },
          );
        }}
      >
        <span
          className="ph-colour-thumb"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            backgroundColor: value,
          }}
        />
      </div>
      <div
        {...hue}
        role="slider"
        tabIndex={0}
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hsv.h)}
        className="ph-colour-hue"
        onKeyDown={(event) =>
          nudge(event, (step) => ({
            ...hsv,
            h: clamp(hsv.h / 360 + step) * 360,
          }))
        }
      >
        <span
          className="ph-colour-thumb ph-colour-thumb--hue"
          style={{ left: `${(hsv.h / 360) * 100}%` }}
        />
      </div>
      <label className="ph-colour-hex">
        <span className="sr-only">Hex colour</span>
        <input
          value={draft}
          spellCheck={false}
          maxLength={7}
          aria-label="Hex colour"
          onChange={(event) => {
            const next = event.target.value.startsWith("#")
              ? event.target.value
              : `#${event.target.value}`;
            setDraft(next);
            if (HEX.test(next)) onChange(next.toLowerCase());
          }}
          onBlur={() => setDraft(value)}
        />
      </label>
    </div>
  );
}

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  options?: ColorOption[];
  /** Shown while `value` is empty, and by the "Default" preset. */
  defaultColour?: string;
  /** Resolves a stored legacy value (e.g. a theme token) to a CSS colour. */
  resolve?: (value: string) => string | undefined;
  /** Text beside the colour well, e.g. "Colour". Icon-only when omitted. */
  label?: string;
  className?: string;
  "aria-label"?: string;
  dataTest?: string;
  disabled?: boolean;
}

/**
 * Colour well + popover: presets for one-tap choices, and a saturation/hue
 * picker with a hex field for anything else. The well shows the current
 * colour with a chevron so it reads as a picker at a glance.
 */
export function ColorPicker({
  value,
  onChange,
  options = DEFAULT_COLOR_OPTIONS,
  defaultColour = "var(--ph-brand)",
  resolve,
  label,
  className,
  "aria-label": ariaLabel = "Colour",
  dataTest,
  disabled,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const preset = options.find((option) => option.value === value);
  const current =
    preset?.colour ?? (value ? (resolve?.(value) ?? value) : defaultColour);
  const panelValue = HEX.test(value)
    ? value.toLowerCase()
    : HEX.test(current)
      ? current
      : "#3b82f6";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn("ph-colour-trigger", className)}
          aria-label={`${ariaLabel}: ${preset?.label ?? (value ? "Custom" : "Default")}`}
          title={ariaLabel}
          data-test={dataTest}
          disabled={disabled}
        >
          <Swatch colour={current} className="ph-colour-swatch--lg" />
          {label ? <span>{label}</span> : null}
          <NavArrowDown className="ph-colour-trigger__chevron" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="ph-colour-panel" align="start">
        <ColorPanel value={panelValue} onChange={onChange} />
        <div
          role="radiogroup"
          aria-label={`${ariaLabel} presets`}
          className="ph-colour-grid"
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value || "default"}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={option.label}
                title={option.label}
                className="ph-colour-option"
                onClick={() => onChange(option.value)}
              >
                <Swatch colour={option.colour ?? defaultColour} />
                {selected ? (
                  <Check className="ph-colour-option__check" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
