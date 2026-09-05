import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SuiteIntegrationRules } from "@/suite/components/suite-integration-rules";

describe("SuiteIntegrationRules", () => {
  afterEach(cleanup);

  const rule = {
    id: "rule-1",
    name: "GitHub issues to tasks",
    trigger_event_type: "github.issue_assigned",
    action_type: "create_tides_task",
    action_config: {},
    enabled: true,
    last_fired_at: null,
  };

  it("lists rules and recent events read-only for members", () => {
    render(
      <SuiteIntegrationRules
        canManage={false}
        projects={[]}
        rules={[rule]}
        events={[
          {
            id: "evt-1",
            provider: "github",
            event_type: "github.issue_assigned",
            processed_at: "2026-09-04T01:00:00Z",
            created_at: "2026-09-04T01:00:00Z",
          },
        ]}
      />,
    );

    expect(screen.getByText("GitHub issues to tasks")).toBeInTheDocument();
    expect(
      screen.getByText("github.issue_assigned → Create a Tides task"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("github · github.issue_assigned"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "New rule" }),
    ).not.toBeInTheDocument();
  });

  it("creates a rule with the selected action configuration", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    const onRefresh = vi.fn();

    render(
      <SuiteIntegrationRules
        canManage
        projects={[{ id: "proj-1", name: "Atlas" }]}
        rules={[]}
        events={[]}
        onCreate={onCreate}
        onRefresh={onRefresh}
      />,
    );

    await user.click(screen.getByRole("button", { name: "New rule" }));
    await user.type(screen.getByLabelText("Rule name *"), "Issues to Atlas");
    await user.type(
      screen.getByLabelText(/Trigger event type/),
      "github.issue_assigned",
    );
    await user.click(screen.getByRole("button", { name: "Create rule" }));

    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        name: "Issues to Atlas",
        trigger_event_type: "github.issue_assigned",
        action_type: "create_tides_task",
        action_config: {},
      }),
    );
    expect(onRefresh).toHaveBeenCalled();
  });

  it("includes the chosen project in the rule configuration", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);

    render(
      <SuiteIntegrationRules
        canManage
        projects={[{ id: "proj-1", name: "Atlas" }]}
        rules={[]}
        events={[]}
        onCreate={onCreate}
      />,
    );

    await user.click(screen.getByRole("button", { name: "New rule" }));
    await user.type(screen.getByLabelText("Rule name *"), "Time entries");
    await user.type(
      screen.getByLabelText(/Trigger event type/),
      "googlecalendar.event_ended",
    );
    await user.selectOptions(
      screen.getByLabelText("Action"),
      "draft_time_entry",
    );
    await user.selectOptions(screen.getByLabelText("Project"), "proj-1");
    await user.type(screen.getByLabelText("Minutes (optional)"), "30");
    await user.click(screen.getByRole("button", { name: "Create rule" }));

    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        name: "Time entries",
        trigger_event_type: "googlecalendar.event_ended",
        action_type: "draft_time_entry",
        action_config: { project_id: "proj-1", minutes: "30" },
      }),
    );
  });
});
