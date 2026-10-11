"use client";

const EDITABLE_FIELDS: Record<string, string[]> = {
  propose_project_handover: ["title", "body"],
  propose_requirement_update: ["description"],
  propose_source_tasks: ["tasks"],
  propose_source_task_update: ["description"],
  propose_knowledge_pack: ["title", "body", "tasks"],
  propose_document_update: ["body"],
};

export function suiteAiDraftFields(
  kind: string,
  payload?: Record<string, unknown>,
): Record<string, unknown> | null {
  const fields = EDITABLE_FIELDS[kind];
  return fields && payload
    ? Object.fromEntries(
        fields.map((key) => [key, payload[key] ?? (key === "tasks" ? [] : "")]),
      )
    : null;
}

export function SuiteAiDraftEditor({
  kind,
  draft,
  canAddTasks,
  onChange,
}: {
  kind: string;
  draft: Record<string, unknown>;
  canAddTasks: boolean;
  onChange: (draft: Record<string, unknown>) => void;
}) {
  const change = (key: string, value: unknown) =>
    onChange({ ...draft, [key]: value });
  const tasks = Array.isArray(draft.tasks)
    ? (draft.tasks as Record<string, unknown>[])
    : [];
  const editTask = (index: number, key: string, value: unknown) =>
    change(
      "tasks",
      tasks.map((task, i) => (i === index ? { ...task, [key]: value } : task)),
    );
  return (
    <div
      className="mt-3 space-y-3 rounded-lg border border-ph-border bg-ph-canvas p-3"
      data-test="ai-draft-editor"
    >
      <p className="text-xs text-ph-mutedtext">
        Edit draft content. Source evidence, versions and destination remain
        protected.
      </p>
      {Object.entries(draft)
        .filter(([key]) => key !== "tasks")
        .map(([key, value]) => (
          <label key={key} className="block space-y-1 text-sm">
            <span className="font-medium">
              {key === "title" ? "Title" : "Proposed content"}
            </span>
            {key === "title" ? (
              <input
                className="ph-input min-h-11 w-full"
                value={String(value)}
                maxLength={255}
                onChange={(event) => change(key, event.target.value)}
              />
            ) : (
              <textarea
                className="ph-input min-h-40 w-full"
                value={String(value)}
                maxLength={kind === "propose_project_handover" ? 16000 : 12000}
                onChange={(event) => change(key, event.target.value)}
              />
            )}
          </label>
        ))}
      {"tasks" in draft ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">Task drafts</p>
          {tasks.map((task, index) => (
            <fieldset
              key={index}
              className="space-y-2 rounded-sm border border-ph-border p-2"
            >
              <legend className="px-1 text-xs">Task {index + 1}</legend>
              <label className="block text-sm">
                Title
                <input
                  className="ph-input min-h-11 w-full"
                  value={String(task.title ?? "")}
                  maxLength={255}
                  onChange={(event) =>
                    editTask(index, "title", event.target.value)
                  }
                />
              </label>
              <label className="block text-sm">
                Description
                <textarea
                  className="ph-input min-h-24 w-full"
                  value={String(task.description ?? "")}
                  maxLength={10000}
                  onChange={(event) =>
                    editTask(index, "description", event.target.value)
                  }
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <label className="text-sm">
                  Due date
                  <input
                    type="date"
                    className="ph-input min-h-11 block"
                    value={String(task.due_date ?? "")}
                    onChange={(event) =>
                      editTask(index, "due_date", event.target.value || null)
                    }
                  />
                </label>
                <label className="text-sm">
                  Priority
                  <select
                    className="ph-input min-h-11 block"
                    value={String(task.priority ?? "low")}
                    onChange={(event) =>
                      editTask(index, "priority", event.target.value)
                    }
                  >
                    {["low", "medium", "high", "urgent"].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(task.assign_me)}
                  onChange={(event) =>
                    editTask(index, "assign_me", event.target.checked)
                  }
                />
                Assign to me
              </label>
              <button
                type="button"
                className="ph-btn ph-btn-secondary ph-btn-xs"
                disabled={kind === "propose_source_tasks" && tasks.length === 1}
                onClick={() =>
                  change(
                    "tasks",
                    tasks.filter((_, i) => i !== index),
                  )
                }
              >
                Remove draft
              </button>
            </fieldset>
          ))}
          {canAddTasks && tasks.length < 5 ? (
            <button
              type="button"
              className="ph-btn ph-btn-secondary ph-btn-sm"
              onClick={() =>
                change("tasks", [
                  ...tasks,
                  {
                    title: "",
                    description: "",
                    priority: "low",
                    assign_me: false,
                  },
                ])
              }
            >
              Add task draft
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
