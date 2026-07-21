import {
  ComponentDocs,
  Checkbox,
  FileUpload,
  Input,
  Panel,
  Radio,
  Range,
  Rating,
  SearchGroup,
  Select,
  Textarea,
  Toggle,
  ShowcaseWrapper,
} from "@/components/ui";

export default function FormShowcase() {
  const code = `import { Checkbox, FileUpload, Input, Panel, Radio, Range, Rating, SearchGroup, Select, Textarea, Toggle } from "@xenide-io/the-old-ui-theme";

<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
  <Panel title="Text inputs" className="space-y-6">
    <Input label="Default" placeholder="Filter events..." />
    <Input label="Error" placeholder="hogql query" error="Malformed identifier near line 12" />
    <Input label="Ghost toolbar field" type="search" placeholder="Search..." variant="ghost" />
    <Input label="Disabled" placeholder="Unavailable" disabled />
  </Panel>

  <Panel title="Select & textarea" className="space-y-6">
    <Select label="Environment" defaultValue="prod">
      <option value="prod">Production</option>
      <option value="staging">Staging</option>
      <option value="dev">Development</option>
    </Select>

    <Textarea label="Description" placeholder="Explain the rollout..." />

    <Checkbox label="Autocapture pageviews" defaultChecked />
    <Checkbox label="Record console logs (disabled product)" disabled />

    <div className="flex flex-col gap-2">
      <Radio name="cohort" label="Dynamic cohort" defaultChecked />
      <Radio name="cohort" label="Static upload" />
    </div>

    <Toggle label="Session replay" defaultChecked />
    <Toggle label="Error tracking (disabled)" disabled />
  </Panel>

  <Panel title="Range, rating, uploads" className="space-y-6 lg:col-span-2">
    <Range label="Sample rate" min={0} max={100} defaultValue={42} minLabel="Off" valueLabel="42%" maxLabel="Full" wrapperClassName="max-w-xl" />

    <Rating label="Satisfaction" value={4} />

    <FileUpload label="Source map archive" prompt="Drop tarball or browse" wrapperClassName="max-w-xl" />

    <SearchGroup label="Grouped search" submitLabel="Search records" />
  </Panel>
</div>`;

  return (
    <ShowcaseWrapper
      title="Inputs & Forms"
      description="Actual exported input components with built-in labels, error states, helper text, disabled state, and size/variant props."
      code={code}
      filename="FormExample.tsx"
      docs={
        <ComponentDocs
          title="Input components"
          rows={[
            { name: "FormField", type: "component", description: "Shared label, description, error, required-state, and generated-ID composition for custom controls." },
            { name: "Input", type: "text | search | email | password", description: "Labelled input with error, helperText, size, and variant props." },
            { name: "Select", type: "select", description: "Labelled select with error, helperText, size, and disabled props." },
            { name: "Textarea", type: "textarea", description: "Labelled multiline input with the same state props as Input." },
            { name: "Checkbox", type: "checkbox", description: "Checkbox with label and native input props." },
            { name: "Radio", type: "radio", description: "Radio item with label and native input props." },
            { name: "Toggle", type: "switch", description: "Switch-style checkbox with row layout." },
            { name: "Range", type: "range", description: "Range slider with optional min/value/max labels." },
            { name: "Rating", type: "rating", description: "Star rating display/control with value, max, and onChange props." },
            { name: "FileUpload", type: "file", description: "Dropzone-style file input wrapper." },
            { name: "size", type: "sm | md | lg", defaultValue: "md", description: "Shared density prop for Input, Select, and Textarea." },
            { name: "variant", type: "default | ghost", defaultValue: "default", description: "Input visual variant. Ghost is useful in toolbar/search contexts." },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Panel title="Text inputs" className="space-y-6">
          <Input label="Default" placeholder="Filter events..." />
          <Input label="Error" placeholder="hogql query" error="Malformed identifier near line 12" />
          <Input label="Ghost toolbar field" type="search" placeholder="Search..." variant="ghost" />
          <Input label="Disabled" placeholder="Unavailable" disabled />
        </Panel>

        <Panel title="Select & textarea" className="space-y-6">
          <Select label="Environment" defaultValue="prod">
            <option value="prod">Production</option>
            <option value="staging">Staging</option>
            <option value="dev">Development</option>
          </Select>

          <Textarea label="Description" placeholder="Explain the rollout..." />

          <Checkbox label="Autocapture pageviews" defaultChecked />
          <Checkbox label="Record console logs (disabled product)" disabled />

          <div className="flex flex-col gap-2">
            <Radio name="cohort" label="Dynamic cohort" defaultChecked />
            <Radio name="cohort" label="Static upload" />
          </div>

          <Toggle label="Session replay" defaultChecked />
          <Toggle label="Error tracking (disabled)" disabled />
        </Panel>

        <Panel title="Range, rating, uploads" className="space-y-6 lg:col-span-2">
          <Range label="Sample rate" min={0} max={100} defaultValue={42} minLabel="Off" valueLabel="42%" maxLabel="Full" wrapperClassName="max-w-xl" />

          <Rating label="Satisfaction" value={4} />

          <FileUpload label="Source map archive" prompt="Drop tarball or browse" wrapperClassName="max-w-xl" />

          <SearchGroup label="Grouped search" submitLabel="Search records" />
        </Panel>
      </div>
    </ShowcaseWrapper>
  );
}
