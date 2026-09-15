import { useState } from "react";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SuiteIntegrationPicker } from "@/suite/components/suite-integration-picker";

describe("SuiteIntegrationPicker", () => {
  afterEach(cleanup);

  it("matches search text against provider titles only", async () => {
    const user = userEvent.setup();

    render(
      <SuiteIntegrationPicker
        open
        items={[
          {
            id: "google-calendar",
            label: "Google Calendar",
            description: "Events and scheduling",
            authSchemes: ["OAUTH2"],
          },
          {
            id: "linear",
            label: "Linear",
            description: "Calendar planning and issue tracking",
          },
        ]}
        onClose={vi.fn()}
        onConnect={vi.fn()}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Search apps" }),
      "calendar",
    );

    expect(screen.getByText("Google Calendar")).toBeInTheDocument();
    expect(screen.queryByText("Linear")).not.toBeInTheDocument();
  });

  it("shows auth tags and passes the selected method to the connector", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(
      <SuiteIntegrationPicker
        open
        items={[
          {
            id: "mixed-provider",
            label: "Mixed provider",
            description: "Supports multiple connection methods",
            categories: ["calendar", "email"],
            authSchemes: ["OAUTH2", "API_KEY"],
          },
        ]}
        onClose={vi.fn()}
        onConnect={onConnect}
      />,
    );

    expect(screen.getByText("OAuth 2.0")).toBeInTheDocument();
    expect(screen.getByText("API key")).toBeInTheDocument();
    expect(screen.getByLabelText("Works with TurtleTime")).toBeInTheDocument();
    expect(screen.getByLabelText("Works with Tides")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Connect" }));
    await user.click(screen.getByRole("button", { name: /API key Select/ }));

    expect(onConnect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "mixed-provider" }),
      { auth_scheme: "API_KEY" },
    );
  });

  it("loads and submits fields for a custom connection method", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn().mockResolvedValue(undefined);
    const onFetchAuthFields = vi.fn().mockResolvedValue({
      fields: [{ name: "api_key", label: "API key", type: "password" }],
      auth_scheme: "API_KEY",
      managed: false,
    });

    render(
      <SuiteIntegrationPicker
        open
        items={[
          {
            id: "mixed-provider",
            label: "Mixed provider",
            description: "Supports multiple connection methods",
            authSchemes: ["OAUTH2", "API_KEY"],
          },
        ]}
        onClose={vi.fn()}
        onConnect={onConnect}
        onFetchAuthFields={onFetchAuthFields}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Connect" }));
    await user.click(screen.getByRole("button", { name: /API key Select/ }));
    await waitFor(() => expect(onFetchAuthFields).toHaveBeenCalled());
    const apiKey = await screen.findByLabelText(/API key/);
    await user.type(apiKey, "secret");
    await user.click(screen.getByRole("button", { name: "Connect" }));

    await waitFor(() =>
      expect(onConnect).toHaveBeenCalledWith(
        expect.objectContaining({ id: "mixed-provider" }),
        { auth_scheme: "API_KEY", auth_fields: { api_key: "secret" } },
      ),
    );
    expect(onFetchAuthFields).toHaveBeenCalledWith(
      expect.objectContaining({ id: "mixed-provider" }),
      "API_KEY",
    );
  });

  it("supports keyboard category selection and restores focus to the control", async () => {
    const user = userEvent.setup();

    function Fixture() {
      const [category, setCategory] = useState("all");
      return (
        <SuiteIntegrationPicker
          open
          category={category}
          categories={["calendar", "email"]}
          items={[]}
          onCategoryChange={setCategory}
          onClose={vi.fn()}
          onConnect={vi.fn()}
        />
      );
    }

    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Filter by category" });
    trigger.focus();
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(trigger).toHaveTextContent("Calendar");
    expect(trigger).toHaveFocus();
    expect(
      screen.queryByRole("listbox", { name: "Integration categories" }),
    ).not.toBeInTheDocument();

    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("textbox", { name: "Search categories" }),
    ).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("announces connection errors for integrations without authentication", async () => {
    const user = userEvent.setup();

    render(
      <SuiteIntegrationPicker
        open
        items={[
          {
            id: "broken-provider",
            label: "Broken provider",
            description: "Cannot currently connect",
          },
        ]}
        onClose={vi.fn()}
        onConnect={vi.fn().mockRejectedValue(new Error("Connection failed"))}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Connect" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Connection failed",
    );
  });

  it("confirms before disconnecting a connected app", async () => {
    const user = userEvent.setup();
    const onDisconnect = vi.fn();

    render(
      <SuiteIntegrationPicker
        open
        items={[]}
        connectedItems={[
          {
            id: "google-calendar",
            label: "Google Calendar",
            description: "Events and scheduling",
          },
        ]}
        onClose={vi.fn()}
        onConnect={vi.fn()}
        onDisconnect={onDisconnect}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Disconnect" }));
    expect(onDisconnect).not.toHaveBeenCalled();

    const confirmation = screen.getByRole("dialog", { name: "Disconnect app" });
    expect(confirmation).toHaveTextContent("Disconnect Google Calendar?");
    await user.click(
      within(confirmation).getByRole("button", { name: "Disconnect app" }),
    );

    expect(onDisconnect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "google-calendar" }),
    );
  });
});
