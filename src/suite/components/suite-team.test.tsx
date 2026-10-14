import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SuiteTeamSheet, weekdaySummary, type SuiteTeam } from "./suite-team";

afterEach(cleanup);

const member = {
  id: "m1",
  user: { id: "u1", name: "Maya Chen", email: "maya@example.com", image: null },
  role: "member" as const,
  is_owner: false,
  apps: { turtletime: true, tides: true, kraken: false, shelly: false },
};

function team(canManage: boolean): SuiteTeam {
  return {
    workspace: { id: "w1", name: "Atlas" },
    can_manage: canManage,
    members: [
      canManage
        ? {
            ...member,
            client_access_mode: "all",
            client_ids: [],
            project_ids: [],
            hourly_rate: 120,
            monthly_rate: 19200,
            monthly_hours_basis: 160,
            hours_per_day: 8,
            weekdays: [0, 1, 2, 3, 4],
            client_rates: {},
          }
        : member,
    ],
    ...(canManage ? { currency: "AUD", clients: [], projects: [] } : {}),
  };
}

describe("SuiteTeamSheet", () => {
  it("shows members read-only without access or rate columns when the viewer cannot manage", () => {
    render(
      <SuiteTeamSheet
        open
        onClose={() => {}}
        team={team(false)}
        onPatch={vi.fn()}
      />,
    );

    expect(screen.getByText("Maya Chen")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Role for Maya Chen" }),
    ).toBeNull();
    expect(screen.queryByText(/Hourly/)).toBeNull();
    expect(screen.queryByText("Clients and projects")).toBeNull();
  });

  it("lets admins change a member's hourly rate in place", async () => {
    const onPatch = vi.fn().mockResolvedValue(undefined);
    render(
      <SuiteTeamSheet
        open
        onClose={() => {}}
        team={team(true)}
        onPatch={onPatch}
      />,
    );

    const hourly = screen.getByLabelText("Hourly (AUD) for Maya Chen");
    fireEvent.change(hourly, { target: { value: "135" } });
    fireEvent.blur(hourly);

    await waitFor(() =>
      expect(onPatch).toHaveBeenCalledWith(
        expect.objectContaining({ id: "m1" }),
        {
          hourly_rate: 135,
        },
      ),
    );
    expect(screen.getAllByText("AUD")).toHaveLength(2);
  });

  it("shows the recorded rate denomination after the workspace default changes", () => {
    const data = team(true);
    data.currency = "USD";
    data.members[0].rate_currency = "EUR";
    render(<SuiteTeamSheet open onClose={() => {}} team={data} onPatch={vi.fn()} />);
    expect(screen.getByLabelText("Hourly (EUR) for Maya Chen")).toBeTruthy();
    expect(screen.getAllByText("EUR")).toHaveLength(2);
    expect(screen.queryByText("USD")).toBeNull();
  });

  it("summarises working days as a range when they are consecutive", () => {
    expect(weekdaySummary([0, 1, 2, 3, 4])).toBe("Mon–Fri");
    expect(weekdaySummary([0, 2, 4])).toBe("Mon, Wed, Fri");
  });
});
