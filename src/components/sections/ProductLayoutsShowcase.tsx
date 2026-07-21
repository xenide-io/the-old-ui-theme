import {
  AuthCard,
  AuthDivider,
  AuthLayout,
  Badge,
  Button,
  Checkbox,
  Input,
  LoadingState,
  Panel,
  SettingsLayout,
  SettingsNav,
  ShowcaseWrapper,
  Toggle,
} from "@/components/ui";
import { IconDataReel, IconMail, IconPerson, IconTuning } from "@/components/icons";

const settingsGroups = [
  {
    label: "Workspace",
    items: [
      { id: "general", label: "General", href: "#settings", icon: <IconTuning className="h-4 w-4" aria-hidden />, active: true },
      { id: "members", label: "Members", href: "#settings", icon: <IconPerson className="h-4 w-4" aria-hidden />, badge: "12" },
    ],
  },
  {
    label: "Data",
    items: [
      { id: "sources", label: "Sources", href: "#settings", icon: <IconDataReel className="h-4 w-4" aria-hidden /> },
      { id: "email", label: "Email reports", href: "#settings", icon: <IconMail className="h-4 w-4" aria-hidden /> },
    ],
  },
] as const;

export default function ProductLayoutsShowcase() {
  const authCode = `import { AuthCard, AuthDivider, AuthLayout, Button, Input } from "@xenide-io/the-old-ui-theme";

<AuthLayout brand="Acme Analytics" footer="Privacy · Terms">
  <AuthCard title="Welcome back" description="Sign in to your workspace">
    <Input label="Work email" type="email" autoComplete="email" />
    <Input label="Password" type="password" autoComplete="current-password" />
    <Button variant="primary" className="w-full">Sign in</Button>
    <AuthDivider />
    <Button variant="secondary" className="w-full">Continue with SSO</Button>
  </AuthCard>
</AuthLayout>`;

  const settingsCode = `import { SettingsLayout, SettingsNav } from "@xenide-io/the-old-ui-theme";

<SettingsLayout
  title="Workspace settings"
  navigation={<SettingsNav groups={settingsGroups} />}
>
  {/* Route-specific settings panels */}
</SettingsLayout>`;

  return (
    <>
      <ShowcaseWrapper
        id="auth"
        title="Authentication layouts"
        description="Focused sign-in, verification, recovery, and loading shells. Authentication state and provider logic stay application-owned."
        code={authCode}
        filename="SignInPage.tsx"
      >
        <div className="grid gap-5 xl:grid-cols-[1.35fr,0.65fr]">
          <AuthLayout
            className="min-h-[34rem]"
            brand={<span>The Old UI</span>}
            aside={
              <div className="flex h-full flex-col justify-between">
                <strong className="text-xl">Understand every product decision.</strong>
                <p className="max-w-xs text-sm opacity-80">One focused authentication step at a time, with room for product context.</p>
              </div>
            }
            footer={<>Privacy · Terms · Status</>}
          >
            <AuthCard
              title="Welcome back"
              description="Sign in to your workspace"
              footer={<>New to the workspace? <a href="#auth" className="font-medium text-ph-brand">Create an account</a></>}
            >
              <Input label="Work email" type="email" autoComplete="email" placeholder="you@company.com" />
              <Input label="Password" type="password" autoComplete="current-password" />
              <div className="flex items-center justify-between gap-3">
                <Checkbox label="Remember me" />
                <a href="#auth" className="text-xs font-medium text-ph-brand">Forgot password?</a>
              </div>
              <Button variant="primary" className="w-full">Sign in</Button>
              <AuthDivider />
              <Button variant="secondary" className="w-full">Continue with SSO</Button>
            </AuthCard>
          </AuthLayout>

          <div className="grid gap-5">
            <AuthCard title="Check your inbox" description="We sent a six-digit code to alex@company.com">
              <Input label="Verification code" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" />
              <Button variant="primary" className="w-full">Verify email</Button>
            </AuthCard>
            <AuthCard title="Preparing workspace" description="Authentication completed successfully.">
              <LoadingState
                label="Preparing your workspace"
                title="Loading your workspace"
                description="Connecting data sources and restoring your last view."
                variant="dots"
              />
            </AuthCard>
          </div>
        </div>
      </ShowcaseWrapper>

      <ShowcaseWrapper
        id="settings"
        title="Settings layout"
        description="Route-friendly grouped navigation, mobile disclosure menu, page actions, and flexible settings content."
        code={settingsCode}
        filename="SettingsPage.tsx"
      >
        <SettingsLayout
          title="Workspace settings"
          description="Manage identity, data collection, and workspace defaults."
          actions={<Button variant="primary" size="sm">Save changes</Button>}
          navigation={<SettingsNav groups={settingsGroups} />}
        >
          <Panel title="Workspace identity" description="Shown in navigation, reports, and invitations." className="space-y-4">
            <Input label="Workspace name" defaultValue="Acme Analytics" />
            <Input label="Workspace URL" defaultValue="app.example.com/acme" />
          </Panel>
          <Panel title="Collection defaults" className="space-y-4">
            <Toggle label="Capture page views automatically" defaultChecked />
            <Toggle label="Mask sensitive text inputs" defaultChecked />
            <div><Badge variant="warning">Restart required</Badge></div>
          </Panel>
        </SettingsLayout>
      </ShowcaseWrapper>
    </>
  );
}
