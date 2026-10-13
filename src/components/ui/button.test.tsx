import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";

import { Button } from "./Button";

afterEach(cleanup);

it("uses the loading label only while busy", () => {
  const { rerender } = render(
    <Button loadingLabel="Creating…">Create snail</Button>,
  );
  expect(screen.getByRole("button", { name: "Create snail" })).toBeEnabled();

  rerender(<Button loading loadingLabel="Creating…">Create snail</Button>);
  expect(screen.getByRole("button", { name: "Creating…" })).toBeDisabled();

  rerender(<Button loading>Create snail</Button>);
  expect(screen.getByRole("button", { name: "Create snail" })).toBeDisabled();

  rerender(<Button variant="ghost" loadingLabel="Creating…">Create snail</Button>);
  expect(screen.getByRole("button", { name: "Create snail" })).toBeEnabled();
});
