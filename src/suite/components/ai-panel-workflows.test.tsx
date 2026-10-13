import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { SuiteAiPanel, type SuiteAiAction } from "./ai-panel";

beforeAll(() => {
  // jsdom has no layout/scroll implementation; the real panel uses this API.
  HTMLElement.prototype.scrollTo = vi.fn();
});
afterEach(cleanup);

function TestSpinner() {
  return <span aria-hidden="true" />;
}

describe("integration draft review", () => {
  it("shows the handover and source revisions without applying it", async () => {
    const action: SuiteAiAction = {
      id: "handover",
      kind: "propose_project_handover",
      status: "proposed",
      summary: "Save a private project handover",
      payload: {
        body: "Open work and next steps from the brief.",
        sources: [{ title: "Project brief", revision_number: 3 }],
      },
    };
    const resolveAction = vi.fn();
    const fetchChat = vi.fn().mockResolvedValue({
      configured: true,
      messages: [
        { role: "assistant", content: "Review this draft.", actions: [action] },
      ],
    });
    render(
      <SuiteAiPanel
        spinner={TestSpinner}
        clearChat={vi.fn().mockResolvedValue(undefined)}
        open
        fetchChat={fetchChat}
        sendMessage={vi.fn()}
        resolveAction={resolveAction}
      />,
    );
    fireEvent.click(
      await screen.findByText("Review proposed content and evidence"),
    );
    expect(
      screen.getByText("Open work and next steps from the brief."),
    ).toBeVisible();
    expect(screen.getByText(/"revision_number": 3/)).toBeVisible();
    expect(resolveAction).not.toHaveBeenCalled();
  });

  it("shows before/after content and delegates only explicit confirmation", async () => {
    const action: SuiteAiAction = {
      id: "requirements",
      kind: "propose_requirement_update",
      status: "proposed",
      summary: "Update acceptance criteria",
      payload: {
        before: "Existing human note.",
        description: "Existing human note. Added acceptance criterion.",
        document_revision: 2,
        task_updated_at: "2026-10-06T10:00:00Z",
      },
    };
    const messages = [
      {
        role: "assistant" as const,
        content: "Review the change.",
        actions: [action],
      },
    ];
    const resolveAction = vi.fn().mockResolvedValue({ messages });
    render(
      <SuiteAiPanel
        spinner={TestSpinner}
        clearChat={vi.fn().mockResolvedValue(undefined)}
        open
        fetchChat={vi.fn().mockResolvedValue({ configured: true, messages })}
        sendMessage={vi.fn()}
        resolveAction={resolveAction}
      />,
    );
    fireEvent.click(
      await screen.findByText("Review proposed content and evidence"),
    );
    expect(screen.getByText("Existing human note.")).toBeVisible();
    expect(
      screen.getByText("Existing human note. Added acceptance criterion."),
    ).toBeVisible();
    expect(resolveAction).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() =>
      expect(resolveAction).toHaveBeenCalledWith("requirements", "confirm"),
    );
  });

  it("keeps workflows available in an existing chat and only prefills the composer", async () => {
    const sendMessage = vi.fn();
    render(
      <SuiteAiPanel
        spinner={TestSpinner}
        clearChat={vi.fn()}
        open
        fetchChat={vi.fn().mockResolvedValue({
          configured: true,
          messages: [{ role: "assistant", content: "Existing conversation" }],
        })}
        sendMessage={sendMessage}
        presets={[
          {
            label: "Prepare knowledge pack",
            prompt: "Prepare a reviewed knowledge pack.",
          },
        ]}
      />,
    );
    await screen.findByRole("button", { name: "Clear" });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Workflows" }));
    await user.click(
      await screen.findByRole("menuitem", { name: "Prepare knowledge pack" }),
    );
    expect(
      screen.getByDisplayValue("Prepare a reviewed knowledge pack."),
    ).toBeVisible();
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("submits human-edited task drafts without exposing scope as an editable field", async () => {
    const action: SuiteAiAction = {
      id: "tasks",
      kind: "propose_source_tasks",
      status: "proposed",
      summary: "Create source tasks",
      payload: {
        project_id: "project-1",
        tasks: [{ title: "Initial task", description: "Criteria" }],
        requested_by: "user-1",
      },
    };
    const messages = [
      {
        role: "assistant" as const,
        content: "Review task drafts.",
        actions: [action],
      },
    ];
    const resolveAction = vi.fn().mockResolvedValue({ messages });
    render(
      <SuiteAiPanel
        spinner={TestSpinner}
        clearChat={vi.fn()}
        open
        fetchChat={vi.fn().mockResolvedValue({ configured: true, messages })}
        sendMessage={vi.fn()}
        resolveAction={resolveAction}
      />,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Edit draft" }));
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Human-edited task" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() =>
      expect(resolveAction).toHaveBeenCalledWith("tasks", "confirm", {
        tasks: [{ title: "Human-edited task", description: "Criteria" }],
      }),
    );
  });
});
