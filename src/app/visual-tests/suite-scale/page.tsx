"use client";

import { useState } from "react";
import { Button, Card, Caption, H2, Input, P, Small } from "@/components/ui";
import { SuitePage, SuitePageHeader, SuiteSectionHeader, TodayPageFrame } from "@/suite";
import { IconInsightBoard } from "@/components/icons";

export default function SuiteScaleFixture() {
  const [scrollProof, setScrollProof] = useState(false);
  const regionClassName = `isolate rounded-[var(--ph-radius-surface)] border border-ph-border ${scrollProof ? "h-[28rem] overflow-y-auto" : "overflow-hidden"}`;

  return (
    <main className="min-h-screen bg-ph-canvas p-4 text-ph-ink sm:p-8">
      <div data-testid="suite-scale-fixture" className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-label="Today header" className={regionClassName} data-scroll-proof={scrollProof}>
            <TodayPageFrame>
              <SuitePageHeader
                title="Today"
                todayIcon
                description="Your workspace, at a glance."
                actions={<Button variant="secondary">Refresh</Button>}
              />
              <Card className="mt-6" title="Your focus">
                <P>Finish the proposal, then review the next milestone.</P>
                <Small tone="subtle">Comfortable body text with a clear secondary hierarchy.</Small>
              </Card>
              {scrollProof ? <div className="h-[48rem] shrink-0" aria-hidden /> : null}
            </TodayPageFrame>
          </section>
          <section aria-label="Product header" className={regionClassName} data-scroll-proof={scrollProof}>
            <SuitePage>
              <SuitePageHeader
                title="Reports"
                icon={<IconInsightBoard />}
                description="Measure progress across your workspace."
                actions={<Button variant="secondary">Export</Button>}
              />
              <Card className="mt-6" title="Weekly delivery">
                <P>Compact title and quiet chrome for everyday work.</P>
                <Caption tone="subtle">Updated 4 minutes ago</Caption>
              </Card>
              {scrollProof ? <div className="h-[48rem] shrink-0" aria-hidden /> : null}
            </SuitePage>
          </section>
        </div>
        <Card>
          <SuiteSectionHeader title="One shared scale" description="Open Runde across every app and suite component." />
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <H2>Readable by role</H2>
              <P>Body text is 16px. Controls and secondary copy are 15px on desktop and 16px on mobile.</P>
              <Caption>Metadata is 13–14px, with uppercase reserved for eyebrows.</Caption>
            </div>
            <div className="space-y-4">
              <Input label="Project name" defaultValue="Northstar" helperText="Shared field sizing and label hierarchy." />
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Save project</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mx-auto mt-6 max-w-6xl">
        <Button variant="secondary" onClick={() => setScrollProof((value) => !value)}>
          {scrollProof ? "Hide scroll proof" : "Show scroll proof"}
        </Button>
      </div>
    </main>
  );
}
