"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, Settings2, ArrowLeft } from "lucide-react";
import type { CompanionCue } from "./companion-provider";

type Bounds = { left: number; top: number; width: number; height: number };
export type CompanionPalette = {
  bg: string;
  fg: string;
  accents: string[];
};
const HOME_TARGET = 56,
  MENU_TARGET = 88,
  GAP = 12,
  // Small target gap plus the artwork's transparent headroom.
  CHAT_GAP = 2,
  MENU_SIZE = 368,
  MENU_RADIAL_MIN = 320,
  MENU_FLIGHT = 220,
  MENU_REVEAL = 260;
const DEFAULT_PALETTE: CompanionPalette = {
  bg: "var(--ph-surface)",
  fg: "var(--ph-text-primary)",
  accents: ["var(--ph-accent)", "var(--ph-violet)", "var(--ph-warning)"],
};
const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));
const reduced = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches ||
  document.documentElement.dataset.reduceMotion === "true";
const mix = (colour: string, amount: number, base: string) =>
  `color-mix(in srgb, ${colour} ${amount}%, ${base})`;

/** A fixed home and short, action-owned excursions. No free dragging or saved coordinates. */
export function SuiteFloatingAssistant({
  open,
  onOpenChange,
  avatar,
  chatAvatar,
  title,
  status,
  suspended = false,
  cue,
  onDismissCue,
  motion = true,
  palette = DEFAULT_PALETTE,
  onSettings,
  settingsOpen = false,
  children,
}: {
  open: boolean;
  onOpenChange(open: boolean): void;
  avatar: ReactNode;
  chatAvatar: ReactNode;
  title: string;
  status: string;
  suspended?: boolean;
  cue?: CompanionCue | null;
  onDismissCue?(): void;
  motion?: boolean;
  palette?: CompanionPalette;
  onSettings?(): void;
  settingsOpen?: boolean;
  children: ReactNode;
}) {
  const [portalRoot] = useState(() =>
    typeof document === "undefined" ? null : document.createElement("div"),
  );
  const menuOpen = cue?.mode === "menu";
  const stage = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [menuReady, setMenuReady] = useState(false);
  const [highlightedTool, setHighlightedTool] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [invite, setInvite] = useState(false);
  const [poked, setPoked] = useState(false);
  const [, remeasure] = useState(0);
  const button = useRef<HTMLButtonElement>(null),
    menu = useRef<HTMLDivElement>(null);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const previousOpen = useRef(open),
    opener = useRef<HTMLElement | null>(null);
  const dismissRef = useRef(onDismissCue);
  dismissRef.current = onDismissCue;

  // One calm invitation per browser session. It never covers the friend and
  // disappears as soon as the chat, a cue or the pointer arrives.
  useEffect(() => {
    if (open || cue || suspended) {
      setInvite(false);
      return;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem("suite:companion-invited") === "1";
    } catch {
      /* storage can be unavailable */
    }
    if (seen) return;
    const timer = setTimeout(() => setInvite(true), 2200);
    return () => clearTimeout(timer);
  }, [open, cue, suspended]);

  useEffect(() => {
    if (open || cue) setInvite(false);
  }, [open, cue]);

  useEffect(() => {
    if (!poked) return;
    const timer = setTimeout(() => setPoked(false), 650);
    return () => clearTimeout(timer);
  }, [poked]);

  useLayoutEffect(() => {
    if (!portalRoot) return;
    const foreground = () => {
      // Stay inside the active dialog's focus/aria boundary, without remounting
      // chat. A manual popover escapes its clipping and stacking context.
      const dialogs = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[role="dialog"]:not([data-state="closed"]), [role="alertdialog"]:not([data-state="closed"]), dialog[open]',
        ),
      ).filter(
        (element) =>
          !portalRoot.contains(element) &&
          !element.hidden &&
          getComputedStyle(element).display !== "none" &&
          getComputedStyle(element).visibility !== "hidden",
      );
      const parent = dialogs[dialogs.length - 1] ?? document.body;
      if (portalRoot.parentElement !== parent) {
        const focused = portalRoot.contains(document.activeElement)
          ? (document.activeElement as HTMLElement)
          : null;
        parent.append(portalRoot);
        portalRoot.removeAttribute("aria-hidden");
        focused?.focus({ preventScroll: true });
      }
      const element = stage.current;
      if (element?.showPopover && !element.matches(":popover-open"))
        element.showPopover();
    };
    foreground();
    const observer = new MutationObserver(foreground);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open", "data-state"],
    });
    return () => {
      observer.disconnect();
      portalRoot.remove();
    };
  }, [portalRoot]);

  useEffect(() => {
    const main =
      document.querySelector("main#main-content") ??
      document.querySelector("#main-content");
    if (!main) return;
    const measure = () => {
      const r = main.getBoundingClientRect(),
        v = window.visualViewport;
      const left = Math.max(r.left, v?.offsetLeft ?? 0) + GAP,
        top = Math.max(r.top, v?.offsetTop ?? 0) + GAP;
      setBounds({
        left,
        top,
        width: Math.max(
          0,
          Math.min(r.right, (v?.offsetLeft ?? 0) + (v?.width ?? innerWidth)) -
            GAP -
            left,
        ),
        height: Math.max(
          0,
          Math.min(r.bottom, (v?.offsetTop ?? 0) + (v?.height ?? innerHeight)) -
            GAP -
            top,
        ),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(main);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, []);

  useEffect(() => {
    if (!cue) return;
    const update = () => {
      if (!cue.anchor.isConnected) dismissRef.current?.();
      else remeasure((value) => value + 1);
    };
    const outside = (event: PointerEvent) => {
      if (
        cue.mode === "menu" &&
        event.target instanceof Node &&
        !menu.current?.contains(event.target) &&
        !button.current?.contains(event.target) &&
        !cue.anchor.contains(event.target)
      )
        dismissRef.current?.();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || cue.mode !== "menu") return;
      event.preventDefault();
      event.stopPropagation();
      dismissRef.current?.();
      if (cue.anchor.isConnected) cue.anchor.focus({ preventScroll: true });
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("pointerdown", outside, true);
    window.addEventListener("keydown", escape, true);
    const timer =
      cue.mode === "success" || cue.mode === "error"
        ? setTimeout(() => dismissRef.current?.(), 1500)
        : undefined;
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("pointerdown", outside, true);
      window.removeEventListener("keydown", escape, true);
      clearTimeout(timer);
    };
  }, [cue]);

  // The editor uses this to get out of the assistant's way while a cue is live.
  useEffect(() => {
    const root = document.documentElement;
    if (cue) root.dataset.assistantCue = cue.mode;
    else delete root.dataset.assistantCue;
    return () => {
      delete root.dataset.assistantCue;
    };
  }, [cue]);

  // Land first, then unfold the tools. Opening both at once made the wheel look
  // like it had been dropped on top of the document.
  useEffect(() => {
    if (!menuOpen) {
      setMenuReady(false);
      setHighlightedTool(null);
      return;
    }
    if (!motion || reduced()) {
      setMenuReady(true);
      return;
    }
    setMenuReady(false);
    const timer = setTimeout(() => setMenuReady(true), MENU_REVEAL);
    return () => clearTimeout(timer);
  }, [menuOpen, cue?.anchor, motion]);

  useEffect(() => {
    if (!menuOpen || !menuReady) return;
    const frame = requestAnimationFrame(() =>
      menu.current
        ?.querySelector<HTMLElement>("[role=menuitem]")
        ?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [menuOpen, menuReady]);

  useLayoutEffect(() => {
    if (open && !previousOpen.current)
      opener.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    if (!open && previousOpen.current) {
      if (opener.current?.isConnected && opener.current !== document.body)
        opener.current.focus();
      else button.current?.focus();
    }
    previousOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open || cue) return;
    const escape = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        !(event.target instanceof Node) ||
        !stage.current?.contains(event.target)
      )
        return;
      // Handle this before the underlying modal's document-level Escape listener.
      event.preventDefault();
      event.stopPropagation();
      onOpenChange(false);
    };
    window.addEventListener("keydown", escape, true);
    return () => window.removeEventListener("keydown", escape, true);
  }, [open, cue, onOpenChange]);

  const width = bounds?.width ?? 0,
    height = bounds?.height ?? 0;
  const target = menuOpen ? MENU_TARGET : HOME_TARGET;
  const homeX = (bounds?.left ?? 0) + Math.max(0, width - target),
    homeY = (bounds?.top ?? 0) + Math.max(0, height - target);
  const anchor = cue?.anchor.isConnected
    ? cue.anchor.getBoundingClientRect()
    : null;
  const menuSize = Math.min(MENU_SIZE, width, height),
    radial = menuSize >= MENU_RADIAL_MIN && (cue?.tools?.length ?? 0) <= 8;
  const menuWidth = radial ? menuSize : Math.min(300, width),
    menuHeight = radial ? menuSize : Math.min(440, height);
  const belowSpace = anchor
    ? (bounds?.top ?? 0) + height - anchor.bottom - GAP
    : 0;
  const aboveSpace = anchor ? anchor.top - (bounds?.top ?? 0) - GAP : 0;
  const rightSpace = anchor
    ? (bounds?.left ?? 0) + width - anchor.right - GAP
    : 0;
  const leftSpace = anchor ? anchor.left - (bounds?.left ?? 0) - GAP : 0;
  const placeRight = menuOpen && radial && rightSpace >= menuWidth + 24;
  const placeLeft =
    menuOpen && radial && !placeRight && leftSpace >= menuWidth + 24;
  const placeBelow =
    !placeRight &&
    !placeLeft &&
    (belowSpace >= menuHeight || belowSpace >= aboveSpace);
  const menuCentreX = anchor
    ? placeRight
      ? anchor.right + GAP + menuWidth / 2
      : placeLeft
        ? anchor.left - GAP - menuWidth / 2
        : anchor.left + anchor.width / 2
    : (bounds?.left ?? 0) + width / 2;
  const menuCentreY = anchor
    ? placeRight || placeLeft
      ? anchor.top + anchor.height / 2
      : placeBelow
        ? anchor.bottom + GAP + menuHeight / 2
        : anchor.top - GAP - menuHeight / 2
    : (bounds?.top ?? 0) + height / 2;
  const menuLeft =
    (bounds?.left ?? 0) +
    clamp(menuCentreX - (bounds?.left ?? 0) - menuWidth / 2, width - menuWidth);
  const menuTop =
    (bounds?.top ?? 0) +
    clamp(
      menuCentreY - (bounds?.top ?? 0) - menuHeight / 2,
      height - menuHeight,
    );
  const centreX = anchor ? anchor.left + anchor.width / 2 : homeX + target / 2;
  const centreY = anchor ? anchor.top + anchor.height / 2 : homeY + target / 2;
  const x = anchor
    ? menuOpen && radial
      ? menuLeft + menuWidth / 2 - target / 2
      : (bounds?.left ?? 0) +
        clamp(centreX - (bounds?.left ?? 0) - target / 2, width - target)
    : homeX;
  const y = anchor
    ? menuOpen && radial
      ? menuTop + menuHeight / 2 - target / 2
      : (bounds?.top ?? 0) +
        clamp(centreY - (bounds?.top ?? 0) - target / 2, height - target)
    : homeY;

  useLayoutEffect(() => {
    if (!bounds) {
      previous.current = null;
      return;
    }
    const last = previous.current;
    const from = last
      ? {
          x: bounds.left + clamp(last.x - bounds.left, bounds.width - target),
          y: bounds.top + clamp(last.y - bounds.top, bounds.height - target),
        }
      : null;
    previous.current = { x, y };
    if (
      !button.current ||
      !from ||
      !motion ||
      reduced() ||
      suspended ||
      (from.x === x && from.y === y)
    )
      return;
    const lift = Math.min(
      26,
      y - (bounds?.top ?? y),
      from.y - (bounds?.top ?? from.y),
    );
    const animation = button.current.animate(
      [
        {
          transform: `translate(${from.x - x}px,${from.y - y}px) scale(.8)`,
        },
        {
          transform: `translate(${(from.x - x) / 2}px,${(from.y - y) / 2 - lift}px) scale(1.04)`,
          offset: 0.58,
        },
        { transform: "none" },
      ],
      {
        duration: MENU_FLIGHT,
        easing: "cubic-bezier(.22,1,.36,1)",
      },
    );
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (reduced() || document.hidden) animation.cancel();
    };
    const observer = new MutationObserver(stop);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-reduce-motion"],
    });
    media.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      animation.cancel();
      observer.disconnect();
      media.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [x, y, target, motion, suspended, bounds]);

  const chatWidth = Math.min(384, width),
    chatHeight = Math.min(560, Math.max(0, height - HOME_TARGET - CHAT_GAP));
  const chatLeft = (bounds?.left ?? 0) + Math.max(0, width - chatWidth),
    chatTop =
      (bounds?.top ?? 0) +
      Math.max(0, height - HOME_TARGET - CHAT_GAP - chatHeight);
  const menuAccents = palette.accents.length
    ? palette.accents
    : DEFAULT_PALETTE.accents;
  const menuGlow = menuAccents[1] ?? menuAccents[0];
  const cueWidth = Math.min(240, width);
  const cueRightRoom =
    (bounds?.left ?? 0) + width - (x + target) - 8;
  const cueLeftRoom = x - (bounds?.left ?? 0) - 8;
  const cueOnRight = cueRightRoom >= cueWidth;
  const cueOnLeft = !cueOnRight && cueLeftRoom >= cueWidth;
  const cueLabelLeft = cueOnRight
    ? x + target + 8
    : cueOnLeft
      ? x - cueWidth - 8
      : (bounds?.left ?? 0) +
        clamp(
          x - (bounds?.left ?? 0) + target / 2 - cueWidth / 2,
          width - cueWidth,
        );
  const cueLabelTop = (bounds?.top ?? 0) +
    clamp(
      cueOnRight || cueOnLeft
        ? y + target / 2 - 20 - (bounds?.top ?? 0)
        : y - (bounds?.top ?? 0) + target + 8,
      height - 64,
    );
  return portalRoot
    ? createPortal(
        <div
          ref={stage}
          popover={
            typeof HTMLElement !== "undefined" &&
            "showPopover" in HTMLElement.prototype
              ? "manual"
              : undefined
          }
          data-test="floating-assistant"
          data-cue={cue?.mode ?? "home"}
          data-motion={motion ? "on" : "off"}
          className="suite-companion-stage"
          style={{
            position: "fixed",
            inset: 0,
            margin: 0,
            padding: 0,
            border: 0,
            width: "100%",
            height: "100%",
            maxWidth: "none",
            maxHeight: "none",
            background: "transparent",
            color: "inherit",
            overflow: "visible",
            pointerEvents: "none",
            zIndex: 2147483647,
            visibility:
              width >= target && height >= target && !suspended
                ? "visible"
                : "hidden",
          }}
        >
          <style>{`.suite-companion-stage [data-assistant-avatar][data-hover=true]{animation:suite-friend-hover .42s cubic-bezier(.22,1,.36,1)}.suite-companion-stage [data-assistant-avatar][data-invite=true]{animation:suite-friend-invite 2.4s ease-in-out infinite}.suite-companion-stage [data-assistant-avatar][data-poked=true]{animation:suite-friend-poke .62s cubic-bezier(.22,1,.36,1)}.suite-companion-invite{position:absolute;z-index:3;display:inline-flex;width:76px;align-items:center;justify-content:center;padding:6px 0;border-radius:14px;border:1px solid var(--ph-border);background:var(--ph-surface);color:var(--ph-ink);font-size:11px;font-weight:650;line-height:1.2;box-shadow:0 8px 20px -12px color-mix(in srgb,var(--ph-ink) 45%,transparent);white-space:nowrap;pointer-events:none}.suite-companion-invite::after{content:"";position:absolute;left:50%;bottom:-4px;width:7px;height:7px;transform:translateX(-50%) rotate(45deg);border-right:1px solid var(--ph-border);border-bottom:1px solid var(--ph-border);background:var(--ph-surface)}.suite-companion-invite{pointer-events:none;cursor:default}@keyframes suite-friend-hover{0%,100%{transform:translateY(0) rotate(0)}28%{transform:translateY(-4px) rotate(-4deg)}62%{transform:translateY(-1px) rotate(4deg)}}@keyframes suite-friend-invite{0%,100%{transform:translateY(0) rotate(0)}45%{transform:translateY(-3px) rotate(-2deg)}75%{transform:translateY(-1px) rotate(2deg)}}@keyframes suite-friend-poke{0%{transform:scale(1) rotate(0)}35%{transform:scale(.88) rotate(-6deg)}70%{transform:scale(1.1) rotate(4deg)}100%{transform:scale(1) rotate(0)}}.suite-companion-stage[data-motion=on] [data-cue-motion=push]{animation:suite-push .8s ease-in-out infinite}.suite-companion-stage[data-motion=on] [data-cue-motion=pull]{animation:suite-pull .8s ease-in-out infinite}.suite-companion-particle{position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:var(--ph-accent,var(--ph-brand));animation:suite-particle .8s ease-out both;pointer-events:none}@keyframes suite-push{0%,100%{transform:rotate(-5deg) translateX(-3px)}50%{transform:rotate(6deg) translateX(3px)}}@keyframes suite-pull{0%,100%{transform:rotate(5deg) translateX(3px)}50%{transform:rotate(-6deg) translateX(-3px)}}@keyframes suite-particle{0%{opacity:0;transform:scale(0)}20%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.2)}}.suite-companion-stage[data-motion=on] .suite-companion-menu{animation:suite-menu-in .22s cubic-bezier(.22,1,.36,1) both}.suite-companion-stage[data-motion=on] [data-menu-tool]{animation:suite-tool-in .24s cubic-bezier(.22,1,.36,1) both}.suite-companion-stage[data-motion=off] .suite-companion-menu,.suite-companion-stage[data-motion=off] [data-menu-tool]{animation:none!important}@keyframes suite-menu-in{0%{opacity:0;transform:scale(.9)}100%{opacity:1;transform:scale(1)}}@keyframes suite-tool-in{0%{opacity:0;transform:scale(.62)}100%{opacity:1;transform:scale(1)}}@media(prefers-reduced-motion:reduce){.suite-companion-stage *{animation:none!important}.suite-companion-particle{display:none}}html[data-reduce-motion=true] .suite-companion-stage *{animation:none!important}html[data-reduce-motion=true] .suite-companion-particle{display:none}`}</style>
          <style>{`.suite-companion-stage::backdrop{background:transparent;pointer-events:none}`}</style>
          <button
            ref={button}
            type="button"
            data-test="assistant-friend"
            draggable={false}
            disabled={!!cue && cue.mode !== "menu"}
            aria-label={
              cue?.mode === "menu"
                ? "Close assistant tools"
                : `Open assistant: ${title}`
            }
            aria-expanded={cue?.mode === "menu" || open}
            aria-controls={
              cue?.mode === "menu"
                ? "assistant-context-menu"
                : "floating-assistant-chat"
            }
            title={cue?.label ?? status}
            className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ph-brand"
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: target,
              height: target,
              zIndex: 2,
              pointerEvents: cue && cue.mode !== "menu" ? "none" : "auto",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              background: "transparent",
              border: 0,
              padding: menuOpen ? 8 : 4,
            }}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            onClick={() => {
              if (cue) onDismissCue?.();
              else {
                setInvite(false);
                setPoked(true);
                try {
                  sessionStorage.setItem("suite:companion-invited", "1");
                } catch {
                  /* optional */
                }
                onOpenChange(!open);
              }
            }}
          >
            <span
              data-assistant-avatar
              data-hover={hovered ? "true" : undefined}
              data-invite={invite ? "true" : undefined}
              data-poked={poked ? "true" : undefined}
              data-cue-motion={cue?.mode === "work" ? cue.motion : undefined}
              style={{
                display: "grid",
                placeItems: "center",
                filter: menuOpen
                  ? `drop-shadow(0 0 14px ${mix(
                      palette.accents[0] ?? palette.fg,
                      55,
                      "transparent",
                    )})`
                  : undefined,
              }}
            >
              {avatar}
            </span>
            {cue?.mode === "success" ? (
              <span
                key={cue.label}
                aria-hidden
                data-test="assistant-particles"
                style={{ position: "absolute", inset: 0 }}
              >
                {Array.from({ length: 10 }, (_, index) => (
                  <i
                    className="suite-companion-particle"
                    key={index}
                    style={
                      {
                        "--dx": `${Math.cos((index * Math.PI) / 5) * 48}px`,
                        "--dy": `${Math.sin((index * Math.PI) / 5) * 48}px`,
                      } as CSSProperties
                    }
                  />
                ))}
              </span>
            ) : null}
          </button>
          {!open && !cue && !suspended && (invite || hovered) ? (
            <span
              data-test="assistant-invite"
              data-testid="assistant-invite"
              aria-hidden="true"
              className="suite-companion-invite"
              style={{
                left:
                  (bounds?.left ?? 0) +
                  clamp(
                    x - (bounds?.left ?? 0) + target / 2 - 38,
                    Math.max(0, width - 76),
                  ),
                top:
                  (bounds?.top ?? 0) + Math.max(0, y - (bounds?.top ?? 0) - 34),
              }}
            >
              Click me
            </span>
          ) : null}
          <span role="status" className="sr-only">
            {cue?.label ?? status}
          </span>
          {cue && cue.mode !== "menu" ? (
            <p
              data-test="assistant-cue-label"
              className="border-ph-border bg-ph-surface text-ph-ink rounded-xl border px-3 py-2 text-sm shadow-lg"
              style={{
                position: "absolute",
                left: cueLabelLeft,
                top: cueLabelTop,
                width: cueWidth,
                textAlign: cueOnRight || cueOnLeft ? "left" : "center",
              }}
            >
              {cue.label}
            </p>
          ) : null}
          {cue?.mode === "menu" && menuReady ? (
            <div
              ref={menu}
              id="assistant-context-menu"
              role="menu"
              aria-label="Assistant writing tools"
              data-test="assistant-context-menu"
              className="suite-companion-menu text-ph-ink"
              style={{
                position: "absolute",
                left: menuLeft,
                top: menuTop,
                width: menuWidth,
                height: menuHeight,
                padding: radial ? 0 : 8,
                boxSizing: "border-box",
                pointerEvents: radial ? "none" : "auto",
                overflowY: radial ? "visible" : "auto",
                overflowX: "hidden",
                borderRadius: radial ? "50%" : 20,
              }}
              onKeyDown={(event) => {
                if (
                  ![
                    "ArrowRight",
                    "ArrowDown",
                    "ArrowLeft",
                    "ArrowUp",
                    "Home",
                    "End",
                  ].includes(event.key)
                )
                  return;
                event.preventDefault();
                const items = Array.from(
                    menu.current?.querySelectorAll<HTMLElement>(
                      "[role=menuitem]",
                    ) ?? [],
                  ),
                  index = items.indexOf(document.activeElement as HTMLElement);
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? items.length - 1
                      : (index +
                          (event.key === "ArrowLeft" || event.key === "ArrowUp"
                            ? -1
                            : 1) +
                          items.length) %
                        items.length;
                items[next]?.focus();
              }}
            >
              {radial ? (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: -38,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${mix(
                      menuGlow,
                      34,
                      "transparent",
                    )} 0%, ${mix(
                      menuGlow,
                      14,
                      "transparent",
                    )} 42%, transparent 72%)`,
                    filter: "blur(12px)",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />
              ) : null}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: radial ? "50%" : 20,
                  border: `1px solid ${mix(menuGlow, 34, "transparent")}`,
                  background: radial
                    ? `radial-gradient(circle at 50% 42%, ${mix(
                        menuGlow,
                        22,
                        palette.bg,
                      )} 0%, ${mix(palette.bg, 88, "transparent")} 52%, ${mix(
                        palette.bg,
                        68,
                        "transparent",
                      )} 100%)`
                    : palette.bg,
                  boxShadow: `0 34px 110px -30px ${mix(
                    menuGlow,
                    80,
                    "transparent",
                  )}, 0 0 72px 2px ${mix(
                    menuGlow,
                    20,
                    "transparent",
                  )}, inset 0 1px 0 ${mix("#ffffff", 18, "transparent")}`,
                  backdropFilter: "blur(18px) saturate(1.15)",
                  WebkitBackdropFilter: "blur(18px) saturate(1.15)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              {cue.tools?.map((tool, index, all) => {
                const angle = -Math.PI / 2 + (index * 2 * Math.PI) / all.length,
                  radius = (menuSize - 84) / 2,
                  Icon = tool.icon,
                  accent = menuAccents[index % menuAccents.length],
                  active = highlightedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    role="menuitem"
                    tabIndex={index === 0 ? 0 : -1}
                    type="button"
                    aria-label={tool.label}
                    data-test={`ai-${tool.id}`}
                    data-menu-tool
                    className="focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={
                      radial
                        ? {
                            position: "absolute",
                            left: menuSize / 2 + Math.cos(angle) * radius - 38,
                            top: menuSize / 2 + Math.sin(angle) * radius - 31,
                            width: 76,
                            height: 62,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 3,
                            padding: 6,
                            borderRadius: 16,
                            border: `1px solid ${mix(
                              accent,
                              active ? 66 : 34,
                              "transparent",
                            )}`,
                            background: active
                              ? mix(accent, 11, palette.bg)
                              : mix(palette.bg, 90, "transparent"),
                            color: accent,
                            boxShadow: active
                              ? `0 0 0 2px ${mix(
                                  accent,
                                  24,
                                  "transparent",
                                )}, 0 12px 28px -16px ${mix(
                                  accent,
                                  78,
                                  "transparent",
                                )}`
                              : `0 8px 22px -16px ${mix(
                                  accent,
                                  74,
                                  "transparent",
                                )}`,
                            pointerEvents: "auto",
                            zIndex: 2,
                            animationDelay: motion
                              ? `${40 + index * 18}ms`
                              : undefined,
                          }
                        : {
                            width: "100%",
                            minHeight: 44,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 12px",
                            marginTop: index ? 6 : 0,
                            borderRadius: 12,
                            border: `1px solid ${mix(
                              accent,
                              active ? 60 : 30,
                              "transparent",
                            )}`,
                            background: active
                              ? mix(accent, 10, palette.bg)
                              : mix(palette.bg, 90, "transparent"),
                            color: accent,
                            textAlign: "left",
                            pointerEvents: "auto",
                            zIndex: 2,
                          }
                    }
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setHighlightedTool(tool.id)}
                    onFocus={() => setHighlightedTool(tool.id)}
                    onClick={() => tool.onSelect()}
                  >
                    <Icon
                      className={radial ? "h-[1.15rem] w-[1.15rem]" : "h-5 w-5 shrink-0"}
                      aria-hidden
                    />
                    <span
                      style={{
                        color: active ? accent : palette.fg,
                        fontSize: radial ? 11 : 13,
                        fontWeight: 600,
                        lineHeight: 1.12,
                        textAlign: radial ? "center" : "left",
                        maxWidth: radial ? 64 : undefined,
                      }}
                    >
                      {tool.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
          <section
            id="floating-assistant-chat"
            role="dialog"
            aria-label={`${title} companion`}
            hidden={!open || !!cue}
            data-test="assistant-chat"
            className="border-ph-border bg-ph-canvas rounded-2xl border shadow-xl"
            style={{
              position: "absolute",
              left: chatLeft,
              top: chatTop,
              width: chatWidth,
              height: chatHeight,
              pointerEvents: "auto",
              overflow: "hidden",
            }}
          >
            <div className="flex h-full min-h-0 flex-col">
              <header className="border-ph-border flex shrink-0 items-center gap-2 border-b px-3 py-2">
                {chatAvatar}
                <div className="min-w-0 flex-1">
                  <p className="text-ph-subtle text-[9px] font-semibold uppercase tracking-[0.14em]">
                    Companion
                  </p>
                  <h2 className="truncate text-sm font-semibold">{title}</h2>
                  <p className="text-ph-subtle truncate text-xs">{status}</p>
                </div>
                <button
                  type="button"
                  aria-label={
                    settingsOpen
                      ? "Back to conversation"
                      : "Appearance and character"
                  }
                  title={
                    settingsOpen
                      ? "Back to conversation"
                      : "Appearance & character"
                  }
                  onClick={onSettings}
                  hidden={!onSettings}
                  className="ph-btn ph-btn-ghost"
                  style={{ minWidth: 44, minHeight: 44 }}
                >
                  {settingsOpen ? (
                    <ArrowLeft size={18} />
                  ) : (
                    <Settings2 size={18} />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Close assistant"
                  onClick={() => onOpenChange(false)}
                  className="ph-btn ph-btn-ghost"
                  style={{ minWidth: 44, minHeight: 44 }}
                >
                  <X size={18} />
                </button>
              </header>
              <div className="min-h-0 flex-1">{children}</div>
            </div>
          </section>
        </div>,
        portalRoot,
      )
    : null;
}
