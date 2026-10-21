import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { SnailAvatar } from "@/components/ui/SnailAvatar";

it("keeps the same shell shape, tint and seeded identity across apps", () => {
  const { container, rerender } = render(
    <SnailAvatar
      title="Pearl"
      seed="crew-id"
      species="nacre"
      colour="#123456"
      size={24}
    />,
  );
  const avatar = screen.getByRole("img", { name: "Pearl" });
  expect(avatar).toHaveAttribute("data-species", "nacre");
  expect(container.querySelector('path[fill="#123456"]')).toBeInTheDocument();
  const shape = container
    .querySelector('path[fill="#123456"]')
    ?.getAttribute("d");
  const variant = avatar.getAttribute("data-variant");
  rerender(
    <SnailAvatar
      title="Pearl"
      seed="crew-id"
      species="nacre"
      colour="#123456"
      size={64}
    />,
  );
  expect(screen.getByRole("img", { name: "Pearl" })).toHaveAttribute(
    "data-variant",
    variant,
  );
  expect(container.querySelector('path[fill="#123456"]')).toHaveAttribute(
    "d",
    shape,
  );
});
