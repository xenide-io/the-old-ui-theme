"use client";

import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { useSuiteNavigation } from "../lib/navigation";

export interface SuiteSidebarTreeNode {
  id: string;
  label: string;
  href?: string;
  dataTest?: string;
  icon?: ReactNode;
  current?: boolean;
  expanded?: boolean;
  onToggle?(): void;
  onNavigate?(): void;
  children?: () => SuiteSidebarTreeNode[];
  content?: ReactNode;
  actions?: ReactNode;
  itemProps?: ComponentProps<"li"> & { [key: `data-${string}`]: unknown };
}

/**
 * Height/opacity reveal for tree branches and section content. Children stay
 * mounted briefly while closing so the collapse animates instead of snapping.
 */
export function SuiteSidebarTreeBranch({
  open,
  children,
}: {
  open: boolean;
  children: () => ReactNode;
}) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(first);
        if (second) cancelAnimationFrame(second);
      };
    }
    setShown(false);
    const timer = window.setTimeout(() => setMounted(false), 150);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className={cn("suite-tree-branch", shown && "is-open")}
      inert={open ? undefined : true}
      aria-hidden={open ? undefined : true}
    >
      <div className="suite-tree-branch-inner">{children()}</div>
    </div>
  );
}

interface TreeIndicatorBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Slides the shared active-row highlight between tree rows, per tree scope. */
function useTreeIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<TreeIndicatorBox | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const current = Array.from(
        container.querySelectorAll<HTMLElement>('[data-suite-tree-current="true"]'),
      ).find((row) => row.closest('[data-suite-tree-root]') === container);
      if (!current) {
        setBox(null);
        return;
      }
      const parent = container.getBoundingClientRect();
      const rect = current.getBoundingClientRect();
      const next = {
        left: rect.left - parent.left,
        top: rect.top - parent.top,
        width: rect.width,
        height: rect.height,
      };
      setBox((previous) =>
        previous &&
        previous.left === next.left &&
        previous.top === next.top &&
        previous.width === next.width &&
        previous.height === next.height
          ? previous
          : next,
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  });

  return { containerRef, box };
}

/** Hosts own data, permissions and expansion; the suite owns row geometry. */
export function SuiteSidebarTree({ nodes, depth = 0 }: {
  nodes: SuiteSidebarTreeNode[];
  depth?: number;
}) {
  const { Link } = useSuiteNavigation();
  const { containerRef, box } = useTreeIndicator();
  function branch(items: SuiteSidebarTreeNode[], level: number, ancestors: Set<string>): ReactNode {
    return items.map((node) => {
      if (ancestors.has(node.id)) return null;
      const children = node.children;
      return (
        <li {...node.itemProps} key={node.id}>
          <div
            data-suite-tree-row
            data-suite-tree-current={node.current ? "true" : undefined}
            className="suite-sidebar-tree-row text-ph-mutedtext group relative flex min-h-8 items-center rounded-md pr-1 text-sm [@media(pointer:coarse)]:min-h-11"
            style={{ paddingLeft: 8 + level * 14 }}
          >
            {node.onToggle ? (
              <button type="button" onClick={node.onToggle} aria-expanded={node.expanded}
                aria-label={`${node.expanded ? "Collapse" : "Expand"} ${node.label}`}
                className="suite-sidebar-tree-control text-ph-subtle flex h-6 w-5 shrink-0 items-center justify-center rounded focus-visible:outline focus-visible:outline-2 [@media(pointer:coarse)]:min-h-11">
                <ChevronRight className={cn("h-3 w-3 transition-transform duration-150 ease-out motion-reduce:transition-none", node.expanded && "rotate-90")} />
              </button>
            ) : <span className="w-5 shrink-0" aria-hidden />}
            <span className="flex min-w-0 flex-1 items-center gap-1.5 self-stretch">
              {node.icon}
              {node.content ?? (node.href ? (
                <Link href={node.href} data-test={node.dataTest} aria-current={node.current ? "page" : undefined} onClick={node.onNavigate}
                  className="flex min-w-0 flex-1 self-stretch items-center focus-visible:outline focus-visible:outline-2">
                  <span className="truncate">{node.label}</span>
                </Link>
              ) : (
                <button type="button" onClick={node.onToggle} className="min-w-0 flex-1 self-stretch truncate text-left focus-visible:outline focus-visible:outline-2">{node.label}</button>
              ))}
            </span>
            {node.actions ? <div className="flex shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 [@media(pointer:coarse)]:opacity-100">{node.actions}</div> : null}
          </div>
          {children ? (
            <SuiteSidebarTreeBranch open={Boolean(node.expanded)}>
              {() => (
                <ul className="space-y-0.5">
                  {branch(children(), level + 1, new Set(ancestors).add(node.id))}
                </ul>
              )}
            </SuiteSidebarTreeBranch>
          ) : null}
        </li>
      );
    });
  }
  return (
    <div ref={containerRef} data-suite-tree-root className="relative">
      {box ? (
        <span
          aria-hidden
          className="suite-tree-indicator ph-nav-highlight"
          style={{
            transform: `translate(${box.left}px, ${box.top}px)`,
            width: box.width,
            height: box.height,
          }}
        />
      ) : null}
      <ul className="space-y-0.5">{branch(nodes, depth, new Set())}</ul>
    </div>
  );
}

export function SuiteSidebarSection({ id, label, expanded, onToggle, actions, children }: {
  id: string;
  label: string;
  expanded: boolean;
  onToggle(): void;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-0.5">
      <div className="flex items-center justify-between px-1 pt-3 pb-1">
        <button type="button" onClick={onToggle} aria-expanded={expanded} aria-controls={`${id}-content`}
          className="suite-sidebar-tree-control text-ph-mutedtext -mx-1 flex items-center gap-1 rounded px-1 text-xs font-semibold focus-visible:outline focus-visible:outline-2 [@media(pointer:coarse)]:min-h-11">
          <ChevronRight className={cn("h-3 w-3 transition-transform duration-150 ease-out motion-reduce:transition-none", expanded && "rotate-90")} />
          {label}
        </button>
        {actions}
      </div>
      <SuiteSidebarTreeBranch open={expanded}>
        {() => <div id={`${id}-content`}>{children}</div>}
      </SuiteSidebarTreeBranch>
    </section>
  );
}
