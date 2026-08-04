"use client";

import { useState } from "react";
import { AppLayout, Sidebar, ShowcaseWrapper, Badge, Button } from "@/components/ui";
import { Home, Bell, TriangleFlag, User, Search, Flash } from "iconoir-react";

const sampleGroups = [
  {
    label: "Main",
    items: [
      { label: "Home", icon: <Home className="h-4 w-4" />, active: true },
      { label: "Activity", icon: <Bell className="h-4 w-4" />, badge: <Badge variant="danger" size="sm">3</Badge> },
      { label: "Explore", icon: <Search className="h-4 w-4" /> },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Projects", icon: <TriangleFlag className="h-4 w-4" /> },
      { label: "People", icon: <User className="h-4 w-4" /> },
      { label: "Automations", icon: <Flash className="h-4 w-4" /> },
    ],
  },
];

export default function SidebarShowcase() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <ShowcaseWrapper
        id="sidebar-demo"
        title="Sidebar + AppLayout"
        description="Full sidebar and content layout with grouped navigation, icons, badges, and collapse support."
        code={`import { AppLayout, Sidebar } from "@xenide-io/the-old-ui-theme";

<AppLayout
  sidebar={
    <Sidebar
      groups={[
        { label: "Main", items: [
          { label: "Home", icon: <Home className="h-4 w-4" />, active: true },
          { label: "Activity", icon: <Bell className="h-4 w-4" />, badge: <Badge>3</Badge> },
        ]},
      ]}
      header={<div className="font-bold">My App</div>}
      footer={<span className="text-xs text-ph-mutedtext">v1.0</span>}
    />
  }
>
  <div className="p-6">
    <h1>Main content area</h1>
  </div>
</AppLayout>`}
      >
        <div className="space-y-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </Button>
          <div className="overflow-hidden rounded-lg border border-ph-border" style={{ height: 360 }}>
            <AppLayout
              sidebarWidth={collapsed ? 56 : 220}
              sidebar={
                <Sidebar
                  groups={sampleGroups}
                  collapsed={collapsed}
                  header={
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-ph-brand flex items-center justify-center text-xs font-bold text-[var(--ph-on-accent)]">T</div>
                      {!collapsed && <span className="text-sm font-bold text-ph-ink">The Old UI</span>}
                    </div>
                  }
                  footer={
                    !collapsed ? <span className="text-xs text-ph-mutedtext px-2">v0.3.2</span> : null
                  }
                />
              }
            >
              <div className="flex h-full items-center justify-center bg-ph-canvas">
                <p className="text-sm text-ph-mutedtext">Content area — click sidebar items</p>
              </div>
            </AppLayout>
          </div>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        id="sidebar-props"
        title="Sidebar Props"
        description="Sidebar component API reference."
        code={`// SidebarGroup
interface SidebarGroup {
  label: string;
  items: SidebarItemDef[];
}

// SidebarItemDef
interface SidebarItemDef {
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

// SidebarProps
interface SidebarProps {
  groups: SidebarGroup[];
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

// AppLayoutProps
interface AppLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  sidebarWidth?: number;
  className?: string;
}`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="ph-panel space-y-2">
            <h3 className="text-sm font-semibold text-ph-ink">AppLayout</h3>
            <p className="text-xs text-ph-subtle">CSS grid wrapper with fixed sidebar + fluid content.</p>
            <ul className="space-y-1 text-xs text-ph-subtle">
              <li><span className="font-medium text-ph-ink">sidebar</span> — ReactNode for left column</li>
              <li><span className="font-medium text-ph-ink">sidebarWidth</span> — px width (default 240)</li>
              <li><span className="font-medium text-ph-ink">children</span> — main content area</li>
            </ul>
          </div>
          <div className="ph-panel space-y-2">
            <h3 className="text-sm font-semibold text-ph-ink">Sidebar</h3>
            <p className="text-xs text-ph-subtle">Grouped navigation with icons, badges, collapse.</p>
            <ul className="space-y-1 text-xs text-ph-subtle">
              <li><span className="font-medium text-ph-ink">groups</span> — labeled sections with items</li>
              <li><span className="font-medium text-ph-ink">collapsed</span> — icon-only mode</li>
              <li><span className="font-medium text-ph-ink">header/footer</span> — top/bottom slots</li>
            </ul>
          </div>
        </div>
      </ShowcaseWrapper>
    </>
  );
}
