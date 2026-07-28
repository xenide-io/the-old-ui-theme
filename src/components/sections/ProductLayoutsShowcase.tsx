"use client";

import { AuthLayout, AuthCard, SettingsLayout, ShowcaseWrapper, Button } from "@/components/ui";

export default function ProductLayoutsShowcase() {
  return (
    <>
      <ShowcaseWrapper
        id="auth"
        title="Auth Layout"
        description="Split-panel authentication shell with brand aside and form column."
        code={`import { AuthLayout, AuthCard } from "@xenide-io/the-old-ui-theme";

<AuthLayout>
  <AuthCard title="Sign in" description="Welcome back">
    <input className="ph-input" placeholder="Email" />
    <input className="ph-input" type="password" placeholder="Password" />
    <Button variant="primary">Sign in</Button>
  </AuthCard>
</AuthLayout>`}
      >
        <div className="max-h-[32rem] overflow-hidden rounded-xl border border-ph-border">
          <AuthLayout>
            <AuthCard title="Sign in" description="Welcome back to your workspace.">
              <div className="space-y-3">
                <input className="ph-input" placeholder="Email" />
                <input className="ph-input" type="password" placeholder="Password" />
                <Button variant="primary" className="w-full">Sign in</Button>
              </div>
            </AuthCard>
          </AuthLayout>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        id="settings"
        title="Settings Layout"
        description="Sidebar navigation and content area for settings pages."
        code={`import { SettingsLayout, SettingsNav } from "@xenide-io/the-old-ui-theme";

<SettingsLayout
  title="Settings"
  navigation={<SettingsNav groups={groups} activeId="general" />}
>
  <p>Settings content</p>
</SettingsLayout>`}
      >
        <div className="max-h-[28rem] overflow-hidden rounded-xl border border-ph-border">
          <SettingsLayout
            title="Project Settings"
            description="Manage your workspace preferences"
            navigation={
              <div className="ph-settings-nav space-y-5">
                <div>
                  <h3 className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-ph-mutedtext">General</h3>
                  <div className="space-y-0.5">
                    <a className="ph-settings-nav__item ph-settings-nav__item--active">Overview</a>
                    <a className="ph-settings-nav__item">Display</a>
                    <a className="ph-settings-nav__item">Notifications</a>
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-ph-mutedtext">Team</h3>
                  <div className="space-y-0.5">
                    <a className="ph-settings-nav__item">Members</a>
                    <a className="ph-settings-nav__item">Roles</a>
                  </div>
                </div>
              </div>
            }
          >
            <p className="text-sm text-ph-subtle">General settings content goes here.</p>
          </SettingsLayout>
        </div>
      </ShowcaseWrapper>
    </>
  );
}
