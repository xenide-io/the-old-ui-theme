"use client";

import {
  createContext,
  useContext,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * Framework-agnostic navigation surface for the suite chrome.
 *
 * `the-old-ui` must not import a router directly. Each host app injects its
 * own implementation (Next.js, TanStack Router, …) via `SuiteNavigationProvider`.
 * The defaults below keep the components working with plain anchors/images and
 * full-page navigation, so the package renders correctly with no host wiring.
 */

export interface SuiteLinkProps {
  href: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  "data-test"?: string;
  "aria-current"?: "page" | undefined;
  onClick?: () => void;
}

export interface SuiteImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  sizes?: string;
}

export interface SuiteRouter {
  push: (href: string) => void;
  replace: (href: string) => void;
  refresh?: () => void;
  back?: () => void;
  forward?: () => void;
  prefetch?: (href: string) => void;
}

export interface SuiteNavigation {
  Link: ComponentType<SuiteLinkProps>;
  Image: ComponentType<SuiteImageProps>;
  useRouter: () => SuiteRouter;
}

function DefaultLink({ href, children, ...rest }: SuiteLinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

function DefaultImage({
  src,
  alt,
  width,
  height,
  className,
  style,
}: SuiteImageProps) {
  // Next.js-only props (fill/priority/unoptimized/sizes) are ignored by design:
  // we never spread them onto the element, so no React DOM warnings appear.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
}

function defaultUseRouter(): SuiteRouter {
  return {
    push: (href) => {
      if (typeof window !== "undefined") window.location.assign(href);
    },
    replace: (href) => {
      if (typeof window !== "undefined") window.location.replace(href);
    },
    refresh: () => {
      if (typeof window !== "undefined") window.location.reload();
    },
    back: () => {
      if (typeof window !== "undefined") window.history.back();
    },
    forward: () => {
      if (typeof window !== "undefined") window.history.forward();
    },
  };
}

const defaultNavigation: SuiteNavigation = {
  Link: DefaultLink,
  Image: DefaultImage,
  useRouter: defaultUseRouter,
};

const SuiteNavigationContext =
  createContext<SuiteNavigation>(defaultNavigation);

export function SuiteNavigationProvider({
  navigation,
  children,
}: {
  navigation?: Partial<SuiteNavigation>;
  children: ReactNode;
}) {
  return (
    <SuiteNavigationContext.Provider value={{ ...defaultNavigation, ...navigation }}>
      {children}
    </SuiteNavigationContext.Provider>
  );
}

export function useSuiteNavigation(): SuiteNavigation {
  return useContext(SuiteNavigationContext);
}
