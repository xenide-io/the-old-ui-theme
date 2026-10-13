"use client";

import { cn } from "@/lib/cn";

const SIZES = {
  sm: "h-[0.85em] w-[0.85em]",
  md: "h-[1em] w-[1em]",
  lg: "h-[1.25em] w-[1.25em]",
} as const;

const SHELLY_WALKING_CSS = `
@keyframes shelly-walking-step {
  0%, 100% { transform: translateY(0) scale(1.06, 0.94); }
  35% { transform: translateY(-8px) scale(0.95, 1.07); }
  65% { transform: translateY(-2px) scale(1.03, 0.98); }
}
@keyframes shelly-walking-antenna {
  0%, 100% { transform: rotate(7deg); }
  50% { transform: rotate(-9deg); }
}
.shelly-walking-step {
  transform-origin: 368px 660px;
  animation: shelly-walking-step 0.62s ease-in-out infinite;
}
.shelly-walking-antenna-l {
  transform-origin: 174px 202px;
  animation: shelly-walking-antenna 0.62s ease-in-out infinite;
}
.shelly-walking-antenna-r {
  transform-origin: 232px 201px;
  animation: shelly-walking-antenna 0.62s ease-in-out infinite reverse;
}
@media (prefers-reduced-motion: reduce) {
  .shelly-walking-step,
  .shelly-walking-antenna-l,
  .shelly-walking-antenna-r {
    animation: none !important;
  }
}
`;

const STROKE = {
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

/**
 * Inline Shelly loader — a small snail that walks in place next to the label.
 * Inherits font size and colour from its container so it drops in exactly where
 * plain loading text used to sit. The mark is sized in `em` to match the text.
 */
export function ShellyWalking({
  size = "md",
  className,
  label = "Loading",
  showLabel = true,
}: {
  size?: keyof typeof SIZES;
  className?: string;
  label?: string;
  showLabel?: boolean;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      data-test="shelly-walking"
      className={cn(
        "inline-flex items-center gap-[0.35em] align-middle",
        className,
      )}
    >
      <style>{SHELLY_WALKING_CSS}</style>
      <svg
        className={cn("shrink-0 overflow-visible", SIZES[size])}
        viewBox="0 0 736 698"
        fill="none"
        aria-hidden
      >
        <g className="shelly-walking-step">
          <path
            {...STROKE}
            d="M297 232C373 169 464 148 548 173C632 198 687 276 683 374C679 472 622 545 542 563C463 580 384 548 345 493C319 456 315 409 316 353C317 301 311 260 297 232Z"
          />
          <path
            {...STROKE}
            d="M426 527C377 488 368 418 395 359C424 296 493 276 548 308C604 341 614 414 578 457C546 495 483 492 459 453C439 420 451 380 481 369C508 359 536 378 535 404C534 425 517 437 502 429"
          />
          <path
            {...STROKE}
            d="M126 218C99 243 91 279 83 324L65 416C45 529 108 624 224 655C273 668 325 672 378 666L584 637C630 630 655 624 650 603C646 586 615 574 565 556C523 570 475 570 433 556C364 534 330 500 324 441L316 330C312 271 300 224 272 201C251 183 226 179 203 181C175 181 146 190 126 218Z"
          />
          <ellipse
            cx="145"
            cy="286"
            rx="14"
            ry="18"
            fill="currentColor"
            stroke="none"
          />
          <ellipse
            cx="256"
            cy="285"
            rx="14"
            ry="18"
            fill="currentColor"
            stroke="none"
          />
          <path
            {...STROKE}
            strokeWidth={0.9}
            d="M176 299C184 309 193 313 201 313C211 313 220 308 225 299"
          />
          <g className="shelly-walking-antenna-l">
            <path {...STROKE} d="M174 202 111 91" />
            <circle {...STROKE} cx="103" cy="70" r="30" />
          </g>
          <g className="shelly-walking-antenna-r">
            <path {...STROKE} d="M232 201 294 88" />
            <circle {...STROKE} cx="306" cy="68" r="30" />
          </g>
        </g>
      </svg>
      {showLabel ? (
        <span>{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}
