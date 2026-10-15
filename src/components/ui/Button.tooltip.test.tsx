import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "@/components/ui/Button";

afterEach(cleanup);

describe("Button tooltips", () => {
  it("names an icon-only button once and does not keep a native title", async () => {
    const user = userEvent.setup();
    render(
      <Button aria-label="Sign out" title="Sign out" icon={<span aria-hidden>↪</span>} />,
    );

    const button = screen.getByRole("button", { name: "Sign out" });
    expect(button).not.toHaveAttribute("title");
    await user.hover(button);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Sign out");
    expect(screen.getAllByRole("tooltip")).toHaveLength(1);
  });

  it("does not tip a labelled button whose title only repeats the label", async () => {
    const user = userEvent.setup();
    render(<Button title="Save">Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).not.toHaveAttribute("title");
    await user.hover(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("uses a title that adds detail the visible label does not", async () => {
    const user = userEvent.setup();
    render(
      <Button title="Start a new timer for this project">Resume</Button>,
    );

    await user.hover(screen.getByRole("button", { name: "Resume" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Start a new timer for this project",
    );
  });
});
