"use client";

import { useState } from "react";
import { Calendar, ComponentDocs, ShowcaseWrapper } from "@/components/ui";

export default function CalendarShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const code = `import { Calendar } from "the-old-ui";

const [date, setDate] = useState(new Date());

<Calendar value={date} onChange={setDate} />`;

  return (
    <ShowcaseWrapper
      title="Calendar"
      description="Controlled date picker with theme-aware styling and navigation."
      code={code}
      filename="CalendarExample.tsx"
      docs={
        <ComponentDocs
          rows={[
            { name: "value", type: "Date | undefined", description: "Selected date." },
            { name: "onChange", type: "(date?: Date) => void", description: "Called when a date is selected." },
          ]}
        />
      }
    >
      <div className="ph-panel flex justify-center">
        <Calendar value={date} onChange={setDate} />
      </div>
    </ShowcaseWrapper>
  );
}
