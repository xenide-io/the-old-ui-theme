import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthCard, AuthLayout } from "@/components/ui/AuthLayout";
import { FilterControls } from "@/components/ui/FilterControls";
import { Loader, LoadingState, Skeleton } from "@/components/ui/Loader";
import { SettingsLayout, SettingsNav } from "@/components/ui/SettingsLayout";
import { getTheme, isThemeId, THEMES } from "@/themes/registry";

describe("loading patterns", () => {
  it("announces one useful loading status and keeps skeleton geometry decorative", () => {
    render(
      <>
        <Loader variant="dots" label="Loading events" />
        <LoadingState label="Preparing workspace" title="Almost ready" />
        <Skeleton shape="block" data-testid="skeleton" />
      </>,
    );

    expect(screen.getByRole("status", { name: "Loading events" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Preparing workspace" })).toHaveTextContent("Almost ready");
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("product layouts", () => {
  it("labels auth and settings regions without owning their application state", () => {
    render(
      <>
        <AuthLayout brand="Acme">
          <AuthCard title="Welcome back"><input aria-label="Email" /></AuthCard>
        </AuthLayout>
        <SettingsLayout
          title="Workspace settings"
          navigation={
            <SettingsNav groups={[{
              label: "Workspace",
              items: [{ id: "general", label: "General", href: "/settings", active: true }],
            }]} />
          }
        >
          Settings content
        </SettingsLayout>
      </>,
    );

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getAllByRole("navigation", { name: "Settings" })).toHaveLength(2);
    for (const link of screen.getAllByRole("link", { name: "General" })) {
      expect(link).toHaveAttribute("aria-current", "page");
    }
  });

  it("composes filter controls and applied chips in one explicit pattern", () => {
    render(
      <FilterControls
        barProps={{ resultCount: "12 results" }}
        chipsProps={{ chips: [{ id: "status", label: "Status", value: "Active", active: true }] }}
      >
        <button type="button">Add filter</button>
      </FilterControls>,
    );

    expect(screen.getByRole("button", { name: "Add filter" })).toBeInTheDocument();
    expect(screen.getByText("12 results")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Applied filters" })).toHaveTextContent("StatusActive");
  });
});

describe("Kraken themes", () => {
  it("registers a complete light and dark pair", () => {
    expect(isThemeId("kraken-light")).toBe(true);
    expect(isThemeId("kraken-dark")).toBe(true);
    expect(getTheme("kraken-light")).toMatchObject({ colorScheme: "light", group: "Kraken" });
    expect(getTheme("kraken-dark")).toMatchObject({ colorScheme: "dark", group: "Kraken" });
    expect(THEMES.filter((theme) => theme.group === "Kraken")).toHaveLength(2);
  });
});
