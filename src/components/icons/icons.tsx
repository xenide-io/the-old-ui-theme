/**
 * Filled product glyphs from PostHog/Material sources plus clearly labeled Old UI originals.
 */
import { forwardRef } from "react";
import type { IconProps } from "@/components/icons/IconBase";
import { createIconBase, createIconBasePath } from "@/components/icons/createIconBase";
import { cn } from "@/lib/cn";

const fill = (d: string) => <path d={d} fill="currentColor" />;

// —— PostHog product / analytics glyphs ——
export const IconAreaChart = createIconBase({
  paths: fill("M3 20V7l4 3 5-7 5 4h4v13Zm5-3 4-5.5 7 5.45V9h-2.7l-3.9-3.125-4.95 6.95L5 11v3.6Z"),
});

export const IconCumulativeChart = createIconBase({
  paths: fill(
    "M20.8805 7.97408C15.0614 18.7809 6.51281 19.5979 2.71265 18.4578L3.28734 16.5422C6.15384 17.4021 13.7386 17.0191 19.1195 7.02588L20.8805 7.97408Z",
  ),
});

export const IconTableChart = createIconBase({
  paths: fill(
    "M20 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v3H5V5h15zm-5 14h-5v-9h5v9zM5 10h3v9H5v-9zm12 9v-9h3v9h-3z",
  ),
});

export const IconHandClick = createIconBase({
  viewBox: "0 0 18 18",
  paths: fill(
    "M14.9942 7.90164C14.9942 7.82992 14.9583 7.46993 14.6342 7.10993C14.2925 6.71407 13.7524 6.49822 13.05 6.44407C12.9783 6.33579 12.8883 6.22822 12.7442 6.11993C12.3483 5.81407 11.7359 5.65164 10.9442 5.63407C10.8724 5.54407 10.7459 5.43578 10.6024 5.32822C10.2425 5.0765 9.79245 4.93236 9.23416 4.87822V3.41993C9.23416 3.27579 9.25244 2.66407 8.83831 2.23164C8.65831 2.03335 8.31659 1.79993 7.74002 1.79993C7.14587 1.79993 6.80416 2.03407 6.60587 2.23164C6.22759 2.64578 6.22759 3.18578 6.22759 3.31164V8.46C5.88587 8.1 5.50759 7.70414 5.29173 7.56C4.84173 7.21829 3.99587 7.39828 3.51002 7.75829C3.04173 8.1 2.88002 8.62243 3.06002 9.12658C3.38416 10.0266 4.19416 10.9266 4.39173 11.1424C4.57173 11.4841 5.38173 12.9782 6.10173 13.5182C6.48002 13.8065 6.76759 14.9941 6.84002 15.7499L6.87588 16.1457H13.6801V14.364C13.7701 14.1123 13.9859 13.5723 14.2201 13.3199C14.7783 12.7616 14.9583 11.3582 14.9583 10.9257V7.91986L14.9942 7.90164ZM14.1117 10.89C14.1117 11.4117 13.8959 12.4017 13.6259 12.6717C13.1576 13.14 12.87 14.04 12.8517 14.13L12.8335 14.1841V15.2283H7.68583C7.64997 15.03 7.61411 14.7783 7.54169 14.5083C7.32583 13.6441 7.03754 13.0866 6.65998 12.7983C6.13826 12.4024 5.39998 11.1241 5.16583 10.6566L5.09411 10.5484C5.09411 10.5301 4.2124 9.63008 3.90582 8.80251C3.86996 8.69423 3.86996 8.60422 3.99582 8.47836C4.22997 8.26251 4.67997 8.20836 4.78754 8.24422C5.05754 8.46008 5.88582 9.34251 6.35339 9.86422L7.12754 10.7284L7.12824 3.29418V3.25762C7.12824 3.1859 7.14652 2.95176 7.27238 2.82591C7.36238 2.71763 7.52409 2.66419 7.75824 2.66419C7.95652 2.66419 8.09995 2.71833 8.20824 2.80833C8.35238 2.97005 8.36996 3.25833 8.36996 3.36662V8.02826H9.25167V5.7599C10.0617 5.8499 10.2958 6.19161 10.3317 6.24575L10.3675 6.33575V8.02747H11.2492V6.53332C12.0051 6.60504 12.2934 6.83918 12.3651 6.94747V8.65747H13.2468V7.34332C14.021 7.4516 14.1468 7.86504 14.1651 7.95504L14.1658 10.8899L14.1117 10.89Z",
  ),
});

export const IconSurveys = createIconBase({
  paths: fill(
    "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9.5-2H18v-2h-5.5zm3.86-5.87c.2-.2.2-.51 0-.71l-1.77-1.77c-.2-.2-.51-.2-.71 0L6 11.53V14h2.47l5.89-5.87z",
  ),
});

export const IconCohort = createIconBase({
  paths: fill(
    "m4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58-.74.32-1.22 1.04-1.22 1.85v1.57h4.5v-1.61c0-.83.23-1.61.63-2.29zm14.87-1.1c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29v1.61h4.5zm-7.76-2.78c-1.17-.52-2.61-.9-4.24-.9s-3.07.39-4.24.9c-1.08.48-1.76 1.56-1.76 2.74v1.61h12v-1.61c0-1.18-.68-2.26-1.76-2.74zm-8.17 2.35c.09-.23.13-.39.91-.69.97-.38 1.99-.56 3.02-.56s2.05.18 3.02.56c.77.3.81.46.91.69zm3.93-8c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  ),
});

export const IconRecording = createIconBase({
  paths: fill(
    "m10 8v8l5-4zm9-5h-14c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2zm0 16h-14v-14h14z",
  ),
});

export const IconFlare = createIconBase({
  paths: fill(
    "m7 11h-6v2h6zm2.17-3.24-2.12-2.12-1.41 1.41 2.12 2.12zm3.83-6.76h-2v6h2zm5.36 6.05-1.41-1.41-2.12 2.12 1.41 1.41zm-1.36 3.95v2h6v-2zm-5-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm2.83 7.24 2.12 2.12 1.41-1.41-2.12-2.12zm-9.19.71 1.41 1.41 2.12-2.12-1.41-1.41zm5.36 6.05h2v-6h-2z",
  ),
});

export const IconSelectEvents = createIconBase({
  paths: (
    <>
      {fill("M17.5 9L16.56 6.94L14.5 6L16.56 5.06L17.5 3L18.44 5.06L20.5 6L18.44 6.94L17.5 9Z")}
      {fill("M6 12.5L6.94 14.56L9 15.5L6.94 16.44L6 18.5L5.06 16.44L3 15.5L5.06 14.56L6 12.5Z")}
      {fill("M6 9L5.06 6.94L3 6L5.06 5.06L6 3L6.94 5.06L9 6L6.94 6.94L6 9Z")}
      {fill("M16.23 14.26L20 13L10 10L13 20L14.26 16.23L18.53 20.5L20.51 18.52L16.23 14.26Z")}
    </>
  ),
});

export const IconClipboardEdit = createIconBase({
  paths: fill(
    "M21.04 12.13C21.18 12.13 21.31 12.19 21.42 12.3L22.7 13.58C22.92 13.79 22.92 14.14 22.7 14.35L21.7 15.35L19.65 13.3L20.65 12.3C20.76 12.19 20.9 12.13 21.04 12.13M19.07 13.88L21.12 15.93L15.06 22H13V19.94L19.07 13.88M11 19L9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9.18C9.6 1.84 10.7 1 12 1C13.3 1 14.4 1.84 14.82 3H19C20.1 3 21 3.9 21 5V9L19 11V5H17V7H7V5H5V19H11M12 3C11.45 3 11 3.45 11 4C11 4.55 11.45 5 12 5C12.55 5 13 4.55 13 4C13 3.45 12.55 3 12 3Z",
  ),
});

export const IconQueryEditor = createIconBase({
  paths: fill(
    "M4,14V17C4,19 7.05,20.72 11,21V18.11L11.13,18C7.12,17.76 4,16.06 4,14M12,13C7.58,13 4,11.21 4,9V12C4,14.21 7.58,16 12,16C12.39,16 12.77,16 13.16,16L17,12.12C15.4,12.72 13.71,13 12,13M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M21,11.13C20.85,11.13 20.71,11.19 20.61,11.3L19.61,12.3L21.66,14.3L22.66,13.3C22.87,13.1 22.88,12.76 22.66,12.53L21.42,11.3C21.32,11.19 21.18,11.13 21.04,11.13M19.04,12.88L13,18.94V21H15.06L21.12,14.93L19.04,12.88Z",
  ),
});

export const IconTuning = createIconBase({
  paths: fill(
    "M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z",
  ),
});

export const IconSync = createIconBase({
  paths: fill(
    "m12.5 4v-3l-4 4 4 4v-3c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46c.78-1.23 1.24-2.69 1.24-4.26 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8l-1.46-1.46c-.78 1.23-1.24 2.69-1.24 4.26 0 4.42 3.58 8 8 8v3l4-4-4-4z",
  ),
});

export const IconPlayCircle = createIconBase({
  paths: fill(
    "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM9.5 16.5L16.5 12L9.5 7.5V16.5Z",
  ),
});

export const IconGridView = createIconBase({
  paths: fill("M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"),
});

export const IconListView = createIconBase({
  paths: fill(
    "M3,5v14h18V5H3z M7,7v2H5V7H7z M5,13v-2h2v2H5z M5,15h2v2H5V15z M19,17H9v-2h10V17z M19,13H9v-2h10V13z M19,9H9V7h10V9z",
  ),
});

export const IconPremium = createIconBase({
  paths: fill(
    "m9.68 13.69 2.32-1.76 2.31 1.76-.88-2.85 2.32-1.84h-2.84l-.91-2.81-.91 2.81h-2.84l2.31 1.84zm10.32-3.69c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 2.03.76 3.87 2 5.28v7.72l6-2 6 2v-7.72c1.24-1.41 2-3.25 2-5.28zm-8-6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm0 15-4 1.02v-3.1c1.18.68 2.54 1.08 4 1.08s2.82-.4 4-1.08v3.1z",
  ),
});

export const IconGift = createIconBase({
  paths: fill(
    "M14.4495 4.55495C15.264 4.31223 15.8631 4.48426 16.1 4.80007C16.4013 5.20182 16.4765 5.57305 16.4336 5.91424C16.3888 6.27088 16.2084 6.63998 15.9211 7.00139C15.3397 7.73275 14.4193 8.30877 13.8244 8.53186C13.598 8.61674 13.4648 8.85138 13.508 9.08924C13.5511 9.32709 13.7582 9.50002 13.9999 9.50002L19.4999 9.50002V12.5H17.9999C17.7237 12.5 17.4999 12.7239 17.4999 13V20.5H6.49988V14.5C6.49988 14.2239 6.27602 14 5.99988 14C5.72374 14 5.49988 14.2239 5.49988 14.5V21C5.49988 21.2762 5.72374 21.5 5.99988 21.5H17.9999C18.276 21.5 18.4999 21.2762 18.4999 21V13.5H19.9999C20.276 13.5 20.4999 13.2762 20.4999 13V9.00002C20.4999 8.86741 20.4472 8.74023 20.3534 8.64646C20.2597 8.5527 20.1325 8.50002 19.9999 8.50002L15.8202 8.50002C16.1407 8.24235 16.4465 7.94742 16.7039 7.62365C17.0625 7.17257 17.3508 6.63541 17.4258 6.03894C17.5027 5.42702 17.3487 4.79826 16.8999 4.20003C16.2882 3.3845 15.1373 3.30652 14.1639 3.5966C13.3806 3.83005 12.5842 4.3279 12.0008 5.07014C11.4285 4.33982 10.6586 3.86464 9.88727 3.64427C8.91382 3.36616 7.82238 3.47045 7.14633 4.14645C6.65753 4.63523 6.41235 5.18234 6.41347 5.75925C6.41457 6.32144 6.64952 6.84016 6.97799 7.28883C7.30058 7.72946 7.7389 8.13769 8.22434 8.50002L3.99988 8.50002C3.86727 8.50002 3.74009 8.5527 3.64632 8.64646C3.55256 8.74023 3.49988 8.86741 3.49988 9.00002V13C3.49988 13.2762 3.72374 13.5 3.99988 13.5H15.4999C15.776 13.5 15.9999 13.2762 15.9999 13C15.9999 12.7239 15.776 12.5 15.4999 12.5H4.49988V9.50002L9.99995 9.50002C10.2318 9.50002 10.4333 9.34058 10.4866 9.1149C10.5398 8.88921 10.431 8.65651 10.2236 8.55281C9.25206 8.06706 8.29723 7.39797 7.78487 6.69811C7.53216 6.35292 7.41402 6.03722 7.41347 5.7573C7.41295 5.49209 7.51758 5.1894 7.85342 4.85358C8.17738 4.52964 8.83597 4.38393 9.61256 4.6058C10.3657 4.82096 11.1212 5.36045 11.5528 6.22359C11.6375 6.39298 11.8106 6.49997 12 6.49997C12.1894 6.49997 12.3625 6.39297 12.4472 6.22358C12.8783 5.36141 13.672 4.78667 14.4495 4.55495Z",
  ),
});

export const IconRobot = createIconBase({
  paths: fill(
    "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z",
  ),
});

// —— Status & feedback ——
export const IconExclamation = createIconBase({
  paths: (
    <g fill="currentColor">
      <path d="m12 21c1.1046 0 2-.8954 2-2s-.8954-2-2-2-2 .8954-2 2 .8954 2 2 2z" />
      <path d="m10 3h4v12h-4z" />
    </g>
  ),
});

export const IconErrorOutline = createIconBase({
  paths: fill(
    "m11 15h2v2h-2zm0-8h2v6h-2zm.99-5c-5.52 0-9.99 4.48-9.99 10s4.47 10 9.99 10c5.53 0 10.01-4.48 10.01-10s-4.48-10-10.01-10zm.01 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
  ),
});

export const IconInfo = createIconBase({
  name: "IconInfo",
  paths: fill(
    "M11 10h2v7h-2v-7zm0-3h2v2h-2V7zm1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
  ),
});

export const IconCancel = createIconBase({
  paths: fill(
    "m12 2c-5.53 0-10 4.47-10 10s4.47 10 10 10 10-4.47 10-10-4.47-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13-3.59 3.59-3.59-3.59-1.41 1.41 3.59 3.59-3.59 3.59 1.41 1.41 3.59-3.59 3.59 3.59 1.41-1.41-3.59-3.59 3.59-3.59z",
  ),
});

export const IconCheckCircle = createIconBase({
  paths: fill(
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  ),
});

// —— Navigation & chrome ——
export const IconArrowUp = createIconBase({
  paths: fill("M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"),
});

export const IconArrowDown = createIconBase({
  paths: fill("M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"),
});

export const IconChevronLeft = createIconBasePath("M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z");
export const IconChevronRight = createIconBasePath("M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z");
export const IconChevronDown = createIconBasePath("M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z");
export const IconSubArrowRight = createIconBase({
  paths: (
    <g transform="translate(4 5.5)">
      {fill("M2 0H0V10H12.01V13L16 9L12.01 5V8H2V0Z")}
    </g>
  ),
});

export const IconSearch = createIconBasePath(
  "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
);

export const IconBell = createIconBasePath(
  "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2m6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1z",
);

export const IconBellOff = createIconBasePath(
  "M20 18.69 7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v.01c-.52.99-.8 2.16-.8 3.42v5l-2 2v1h13.73l2 2L21 19.72zM12 22c1.11 0 2-.89 2-2h-4c0 1.11.89 2 2 2m6-7.32V11c0-3.08-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-.15.03-.29.08-.42.12-.1.03-.2.07-.3.11h-.01c-.01 0-.01 0-.02.01-.23.09-.46.2-.68.31 0 0-.01 0-.01.01z",
);

export const IconPerson = createIconBasePath(
  "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
);

export const IconHome = createIconBasePath("M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z");

export const IconPanelRight = createIconBasePath(
  "M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm12 4h-5v10h5V9zm-7 0H5v10h3V9z",
);

// —— Actions ——
export const IconPlus = createIconBasePath("M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z");
export const IconCheck = createIconBasePath("M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
export const IconClose = createIconBasePath("M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
export const IconTrash = createIconBasePath("M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z");
export const IconDownload = createIconBasePath("M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z");
export const IconUpload = createIconBasePath("M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z");
export const IconSave = createIconBasePath(
  "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z",
);
export const IconCopy = createIconBasePath(
  "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z",
);
export const IconEdit = createIconBasePath(
  "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
);
export const IconLogout = createIconBasePath(
  "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
);

// —— Misc UI ——
export const IconStar = createIconBasePath(
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
);

export const IconMail = createIconBasePath(
  "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
);

export const IconShoppingCart = createIconBasePath(
  "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
);

export const IconMoon = createIconBasePath(
  "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
);

export const IconSun = createIconBasePath(
  "M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z",
);

export const IconVolume = createIconBasePath(
  "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
);

export const IconVolumeOff = createIconBasePath(
  "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z",
);

export const IconFlag = createIconBasePath("M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z");

export const IconDatabase = createIconBasePath(
  "M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zM4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4zm0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z",
);

export const IconLayers = createIconBasePath("M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z");

export const IconBox = createIconBasePath(
  "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
);

export const IconBolt = createIconBasePath(
  "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66-.19-.34-.04-.12-.07-.12C8.48 10.94 10.42 7.54 11 7V3h1v4c.58 0 .57.32.38.66-.19-.34-.04-.12-.07-.12-.95 2.28-2.96 5.66-3.31 6.22H13l-1 7h-1z",
);

export const IconRadar = createIconBasePath(
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z",
);

export const IconToggle = createIconBasePath(
  "M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8H7c-1.66 0-3-1.34-3-3s1.34-3 3-3h10c1.66 0 3 1.34 3 3s-1.34 3-3 3zM7 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
);

export const IconRocket = createIconBasePath(
  "M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33 1.26zm5.45 8.67l-1.33-1.26c-.66-.13-1.34.08-1.81.55L2 18.31l3.62 3.57c.31-.13 3.6-1.53 5.89-3.57 1.53-1.72 2.52-3.76 2.87-5.02zM12 2c-1.1 0-2 .9-2 2v1.09c2.84.48 5 2.94 5 5.91 0 2.97-2.16 5.43-5 5.91V20c0 1.1.9 2 2 2s2-.9 2-2v-1.09c-2.84-.48-5-2.94-5-5.91 0-2.97 2.16-5.43 5-5.91V4c0-1.1-.9-2-2-2z",
);

export const IconTerminal = createIconBase({
  name: "IconTerminal",
  paths: (
    <path
      d="M3 4v16h18V4H3zm2 2h14v12H5V6zm2 2.2L10.8 12 7 15.8 8.4 17.2l5.2-5.2-5.2-5.2L7 8.2zM13 17h5v-2h-5v2z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  ),
});

// —— Old UI originals: authored for this library's tactile product language ——
export const IconOldWindow = createIconBase({
  name: "IconOldWindow",
  paths: (
    <path
      d="M3 3v18h18V3H3zm2 7v9h14v-9H5zm1-4h2v1H6V6zm3 0h2v1H9V6z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  ),
});

export const IconCommandCursor = createIconBase({
  name: "IconCommandCursor",
  paths: (
    <path
      d="M4 3v18h16V3H4zm2 2h12v14H6V5zm1.5 3.5L11 12l-3.5 3.5L9 17l5-5-5-5-1.5 1.5zM13 17h4v-2h-4v2z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  ),
});

export const IconDataReel = createIconBase({
  name: "IconDataReel",
  paths: (
    <path
      d="M3 5v14h18V5H3zm2 2h14v10H5V7zm3 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM10 11h4v1.5h-4V11z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  ),
});

export const IconCodePreview = createIconBase({
  name: "IconCodePreview",
  paths: (
    <path
      d="M3 3v15h18V3H3zm2 2h14v11H5V5zm3.5 2L5 10.5 8.5 14l1.4-1.4-2.1-2.1 2.1-2.1L8.5 7zm7 0-1.4 1.4 2.1 2.1-2.1 2.1 1.4 1.4 3.5-3.5L15.5 7zM9 20h6v2H9v-2z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  ),
});

export const IconInsightBoard = createIconBase({
  name: "IconInsightBoard",
  paths: (
    <path
      d="M3 3v18h18V3H3zm2 2h14v3H5V5zm0 5h6v9H5v-9zm8 0h6v4h-6v-4zm0 6h6v3h-6v-3zM6 6h2v1H6V6zm3 0h2v1H9V6z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  ),
});

export const IconEventStream = createIconBase({
  name: "IconEventStream",
  paths: (
    <>
      <path d="M5 4h2v16H5V4z" fill="currentColor" opacity="0.45" />
      {fill("M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5-6h10v2H11V5zm0 8h7v2h-7v-2zm0 5h10v2H11v-2z")}
    </>
  ),
});

export const IconFeatureGate = createIconBase({
  name: "IconFeatureGate",
  paths: (
    <path
      d="M4 3h2v18H4V3zm3 2h12l-3 4 3 4H7V5zm4 1-2.2 4H12l-1 4 4.2-5H12l1-3h-2z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  ),
});

export const IconReplayFrame = createIconBase({
  name: "IconReplayFrame",
  paths: (
    <path
      d="M3 3v18h18V3H3zm2 2h14v11H5V5zm5 2v7l6-3.5L10 7zm-5 11h9v1H5v-1zm11 0h3v1h-3v-1z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  ),
});

export const IconQueryStack = createIconBase({
  name: "IconQueryStack",
  paths: fill(
    "M4 5c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3zm0 3v3c0 1.66 3.58 3 8 3 .7 0 1.38-.04 2-.12V11.8c-.64.13-1.31.2-2 .2-4.42 0-8-1.34-8-3zm0 6v3c0 1.66 3.58 3 8 3 .7 0 1.38-.04 2-.12v-2.08c-.64.13-1.31.2-2 .2-4.42 0-8-1.34-8-3zm12-1 5 4-5 4v-3h-4v-2h4v-3z",
  ),
});

export const IconExperimentSplit = createIconBase({
  name: "IconExperimentSplit",
  paths: fill(
    "M5 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm14 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm1-6h2c0 2.2 1.8 4 4 4h2.17A3 3 0 0 1 19 11v2a3 3 0 0 1-4.83-2H12a6 6 0 0 1-6-6v4zm0 4a6 6 0 0 0 6-6h2a8 8 0 0 1-8 8v-2z",
  ),
});

export const IconSurveyCard = createIconBase({
  name: "IconSurveyCard",
  paths: (
    <path
      d="M3 3v18h18V3H3zm2 2h14v14H5V5zm2 2h7v2H7V7zm0 4h4v2H7v-2zm7-.4-2.5 2.5-1-1-1.4 1.4 2.4 2.4 3.9-3.9-1.4-1.4zM7 16h10v1H7v-1z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  ),
});

export const OLD_UI_ICONS = {
  oldWindow: IconOldWindow,
  commandCursor: IconCommandCursor,
  dataReel: IconDataReel,
  codePreview: IconCodePreview,
  insightBoard: IconInsightBoard,
  eventStream: IconEventStream,
  featureGate: IconFeatureGate,
  replayFrame: IconReplayFrame,
  queryStack: IconQueryStack,
  experimentSplit: IconExperimentSplit,
  surveyCard: IconSurveyCard,
} as const;

export const IconActivity = createIconBasePath(
  "M22 12h-4l-3 9L9 3l-3 9H2v2h6.76l2.24-6.72L15 15l2.24-6.72L19 14h3v-2z",
);

export const IconFlask = createIconBasePath(
  "M19.8 18.4L14 10.67V6.5l1.35-1.35c.39-.39.39-1.02 0-1.41L14.65 2.7a.9959.9959 0 0 0-1.41 0L9.35 6.54c-.39.39-.39 1.02 0 1.41L10.7 9.3v4.17L4.2 18.4C3.53 19.07 4.04 20.25 5 20.25h14c.96 0 1.47-1.18.8-1.85zM6.91 18.25l5.09-5.09 5.09 5.09H6.91z",
);

/** Busy-state spinner — PostHog `IconSync` with spin animation. */
export const IconSpinner = forwardRef<SVGSVGElement, IconProps>(function IconSpinner({ className, ...props }, ref) {
  return <IconSync ref={ref} className={cn("ph-icon-spin", className)} {...props} />;
});

IconSpinner.displayName = "IconSpinner";

/** Canonical names power documentation and new dynamic-icon usage. */
export const CANONICAL_ICONS = {
  activity: IconActivity,
  areaChart: IconAreaChart,
  arrowDown: IconArrowDown,
  arrowUp: IconArrowUp,
  bell: IconBell,
  bellOff: IconBellOff,
  bolt: IconBolt,
  box: IconBox,
  cancel: IconCancel,
  check: IconCheck,
  checkCircle: IconCheckCircle,
  chevronDown: IconChevronDown,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  clipboardEdit: IconClipboardEdit,
  close: IconClose,
  codePreview: IconCodePreview,
  cohort: IconCohort,
  commandCursor: IconCommandCursor,
  copy: IconCopy,
  cumulativeChart: IconCumulativeChart,
  dataReel: IconDataReel,
  database: IconDatabase,
  download: IconDownload,
  edit: IconEdit,
  errorOutline: IconErrorOutline,
  eventStream: IconEventStream,
  exclamation: IconExclamation,
  experimentSplit: IconExperimentSplit,
  featureGate: IconFeatureGate,
  flag: IconFlag,
  flare: IconFlare,
  flask: IconFlask,
  gift: IconGift,
  gridView: IconGridView,
  handClick: IconHandClick,
  home: IconHome,
  info: IconInfo,
  insightBoard: IconInsightBoard,
  layers: IconLayers,
  listView: IconListView,
  logout: IconLogout,
  mail: IconMail,
  moon: IconMoon,
  oldWindow: IconOldWindow,
  panelRight: IconPanelRight,
  person: IconPerson,
  playCircle: IconPlayCircle,
  plus: IconPlus,
  premium: IconPremium,
  queryEditor: IconQueryEditor,
  queryStack: IconQueryStack,
  radar: IconRadar,
  recording: IconRecording,
  replayFrame: IconReplayFrame,
  robot: IconRobot,
  rocket: IconRocket,
  save: IconSave,
  search: IconSearch,
  selectEvents: IconSelectEvents,
  shoppingCart: IconShoppingCart,
  spinner: IconSpinner,
  star: IconStar,
  subArrowRight: IconSubArrowRight,
  sun: IconSun,
  surveyCard: IconSurveyCard,
  surveys: IconSurveys,
  sync: IconSync,
  tableChart: IconTableChart,
  terminal: IconTerminal,
  toggle: IconToggle,
  trash: IconTrash,
  tuning: IconTuning,
  upload: IconUpload,
  volume: IconVolume,
  volumeOff: IconVolumeOff,
} as const;

/** Compatibility names remain runtime-identical to their canonical glyphs. */
export const PH_ICON_ALIASES = {
  clipboard: IconClipboardEdit,
  grid: IconGridView,
  list: IconListView,
  play: IconPlayCircle,
  settings: IconTuning,
  trendingUp: IconArrowUp,
  warning: IconExclamation,
  xCircle: IconCancel,
} as const;

export const PH_ICONS = {
  ...CANONICAL_ICONS,
  ...PH_ICON_ALIASES,
} as const;

for (const [name, Icon] of Object.entries(CANONICAL_ICONS)) {
  const namedIcon = Icon as typeof Icon & { displayName?: string };
  if (!namedIcon.displayName || namedIcon.displayName === "IconGlyph") {
    namedIcon.displayName = `Icon${name[0].toUpperCase()}${name.slice(1)}`;
  }
}

export type CanonicalIconName = keyof typeof CANONICAL_ICONS;
export type IconAliasName = keyof typeof PH_ICON_ALIASES;
export type IconName = keyof typeof PH_ICONS;

export const IconByName = forwardRef<SVGSVGElement, IconProps & { name: IconName }>(function IconByName({ name, ...props }, ref) {
  const Icon = PH_ICONS[name];
  return <Icon ref={ref} {...props} />;
});

IconByName.displayName = "IconByName";
