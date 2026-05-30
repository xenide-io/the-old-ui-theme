import { ComponentDocs, ShowcaseWrapper, Stepper } from "@/components/ui";

export default function StepperShowcase() {
  const steps = [
    { id: "1", label: "Account", description: "Login details" },
    { id: "2", label: "Profile", description: "Personal info" },
    { id: "3", label: "Settings", description: "Preferences" },
    { id: "4", label: "Review", description: "Confirm" },
  ];

  const code = `import { Stepper } from "the-old-ui";

<div className="ph-panel">
  <Stepper steps={steps} currentStep={1} />
</div>`;

  return (
    <ShowcaseWrapper
      title="Stepper"
      description="Step progress indicator for setup, onboarding, and multi-stage forms."
      code={code}
      filename="StepperExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "steps", type: "{ id; label; description? }[]", description: "Steps shown in order." },
            { name: "currentStep", type: "number", description: "Zero-based active step index." },
          ]}
        />
      }
    >
      <div className="ph-panel">
        <Stepper steps={steps} currentStep={1} />
      </div>
    </ShowcaseWrapper>
  );
}
