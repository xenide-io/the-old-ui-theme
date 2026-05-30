import { Accordion, ComponentDocs, ShowcaseWrapper } from "@/components/ui";

export default function AccordionShowcase() {
  const items = [
    {
      id: "1",
      title: "What is The Old UI?",
      content: "The Old UI is a comprehensive component library with swappable themes, bespoke icons, and dashboard-ready components built with Tailwind CSS.",
    },
    {
      id: "2",
      title: "How do I install it?",
      content: "Simply copy the component files into your project. Each component is self-contained and uses Tailwind CSS utility classes.",
    },
    {
      id: "3",
      title: "Can I customize themes?",
      content: "Yes! The Old UI supports multiple themes including TurtleTime, HedgeHog Light, Sheets, and more. Themes are CSS-variable based.",
    },
  ];

  const code = `import { Accordion } from "the-old-ui";

<Accordion items={items} allowMultiple defaultOpen={["1"]} />`;

  return (
    <ShowcaseWrapper
      title="Accordion"
      description="Disclosure list with controlled defaults for single or multiple open items."
      code={code}
      filename="AccordionExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "items", type: "{ id; title; content }[]", description: "Accordion panels to render." },
            { name: "allowMultiple", type: "boolean", defaultValue: "false", description: "Allows more than one panel open." },
            { name: "defaultOpen", type: "string[]", description: "Initial open item ids." },
          ]}
        />
      }
    >
      <Accordion items={items} allowMultiple defaultOpen={["1"]} />
    </ShowcaseWrapper>
  );
}
