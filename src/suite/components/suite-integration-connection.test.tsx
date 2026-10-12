import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SuiteIntegrationConnection } from "./suite-integration-connection";

describe("SuiteIntegrationConnection", () => {
  afterEach(cleanup);

  it("keeps account identity, status and host actions separate", async () => {
    const onDisconnect = vi.fn();
    render(
      <ul>
        <SuiteIntegrationConnection
          label="google-calendar"
          account="avery@a-very-long-workspace-domain.example"
          detail={<span>2 workspaces enabled</span>}
          actions={<button onClick={onDisconnect}>Disconnect</button>}
          dataTest="integrated-app-google-calendar"
        >
          <div>Workspace settings</div>
        </SuiteIntegrationConnection>
      </ul>,
    );

    expect(
      screen.getByRole("heading", { name: "Google Calendar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("avery@a-very-long-workspace-domain.example"),
    ).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByText("2 workspaces enabled")).toBeInTheDocument();
    expect(screen.getByText("Workspace settings")).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveAttribute(
      "data-test", "integrated-app-google-calendar",
    );
    await userEvent.setup().click(
      screen.getByRole("button", { name: "Disconnect" }),
    );
    expect(onDisconnect).toHaveBeenCalledOnce();
  });

  it("shows attention states and full errors without implying a healthy connection", () => {
    render(
      <ul>
        <SuiteIntegrationConnection
          label="GitHub"
          status="Needs attention"
          statusVariant="danger"
          error="Authorisation has expired. Reconnect your account to continue."
          actions={<button disabled>Working…</button>}
        />
      </ul>,
    );
    expect(screen.queryByText("Connected")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByText("Needs attention")).toBeInTheDocument();
    expect(screen.getByText(/Authorisation has expired/)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("keeps a letter fallback if the provider logo fails", () => {
    const { container, rerender } = render(
      <SuiteIntegrationConnection
        label="Linear"
        icon="https://example.com/logo.svg"
        actions={null}
      />,
    );
    const image = container.querySelector("img")!;
    fireEvent.error(image);
    expect(image).toHaveStyle({ display: "none" });
    expect(screen.getByText("L")).toBeInTheDocument();
    rerender(
      <SuiteIntegrationConnection
        label="Linear"
        icon="https://example.com/new.svg"
        actions={null}
      />,
    );
    expect(container.querySelector("img")).not.toHaveStyle({ display: "none" });
  });
});
