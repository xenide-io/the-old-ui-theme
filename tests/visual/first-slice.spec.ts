import { expect, test } from "@playwright/test";
import { THEMES } from "../../src/themes/registry";

async function prepareFixture(page: import("@playwright/test").Page) {
  await expect(async () => {
    await page.goto("/visual-tests/first-slice");
  }).toPass({ intervals: [250, 500, 1_000], timeout: 10_000 });
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("nextjs-portal")
    .evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
}

for (const theme of [
  "hedgehog-light",
  "hedgehog-dark",
  "malibu-light",
  "malibu-dark",
  "kraken-light",
  "kraken-dark",
] as const) {
  test(`${theme} component workflow`, async ({ page }) => {
    await prepareFixture(page);
    await page.evaluate((nextTheme) => {
      document.documentElement.dataset.theme = nextTheme;
    }, theme);

    await expect(page.getByTestId("first-slice-fixture")).toHaveScreenshot(
      `${theme}-workflow.png`,
      {
        animations: "disabled",
      },
    );
  });
}

test("modal workflow", async ({ page }) => {
  await prepareFixture(page);
  await page.evaluate(() => {
    document.documentElement.dataset.theme = "hedgehog-dark";
  });
  await page.getByRole("button", { name: "Invite teammate" }).click();

  await expect(
    page.getByRole("dialog", { name: "Invite teammate" }),
  ).toHaveScreenshot("modal.png", {
    animations: "disabled",
  });
});

test("button chrome interaction states", async ({ page, isMobile }) => {
  test.skip(
    isMobile,
    "Pointer hover and held-active states are desktop-only fixtures.",
  );
  await prepareFixture(page);
  const button = page.getByRole("button", { name: "Signal" });

  const frameTransition = await button.evaluate((element) => {
    const face = element.querySelector(".ph-btn-chrome");
    return face ? getComputedStyle(face, "::after").transitionProperty : "";
  });
  expect(frameTransition).not.toContain("box-shadow");

  await expect(button).toHaveScreenshot("button-rest.png", {
    animations: "disabled",
  });
  await button.hover();
  await expect(button).toHaveScreenshot("button-hover.png", {
    animations: "disabled",
  });
  await page.mouse.down();
  await expect(button).toHaveScreenshot("button-active.png", {
    animations: "disabled",
  });
  await page.mouse.up();
});

test("dropdown resolves against the viewport", async ({ page }) => {
  await prepareFixture(page);
  const trigger = page.getByRole("button", { name: "More" });
  await trigger.evaluate((element) => {
    const root = element.closest<HTMLElement>(".ph-dropdown");
    if (!root) return;
    root.style.position = "fixed";
    root.style.right = "4px";
    root.style.bottom = "4px";
    root.style.zIndex = "60";
  });
  await trigger.click();

  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("data-side", "top");
  const box = await menu.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(8);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width - 8);
  expect(box!.y).toBeGreaterThanOrEqual(8);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height - 8);
});

test("suite shell tracks the selected section and resizes its sidebar", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Sidebar resizing is a desktop-only interaction.");
  await expect(async () => {
    await page.goto("/demo/patterns");
  }).toPass({ intervals: [250, 500, 1_000], timeout: 30_000 });
  await page
    .locator("nextjs-portal")
    .evaluateAll((portals) => portals.forEach((portal) => portal.remove()));

  const patternsLink = page
    .locator('[data-test="nav-link"]')
    .filter({ hasText: "Patterns" })
    .first();
  await expect(patternsLink).toHaveAttribute("aria-current", "page");
  const sidebarAvatar = page.getByRole("button", { name: "Account menu" });
  const sidebarSignOut = page.locator('[data-test="sidebar-sign-out"]');
  await expect(sidebarAvatar).toBeVisible();
  await expect(sidebarSignOut).toBeVisible();
  const avatarBox = await sidebarAvatar.boundingBox();
  const signOutBox = await sidebarSignOut.boundingBox();
  expect(avatarBox).not.toBeNull();
  expect(signOutBox).not.toBeNull();
  expect(Math.round(avatarBox!.width)).toBe(44);
  expect(Math.round(signOutBox!.width)).toBe(44);
  const componentsLink = page.locator(
    '[data-test="suite-sidebar-secondary-nav"] a[href="/demo/components"]',
  );
  await componentsLink.click();
  await expect(page).toHaveURL(/\/demo\/components$/);
  await expect(
    page
      .locator('[data-test="nav-link"]')
      .filter({ hasText: "Components" })
      .first(),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.locator(
      '[data-test="suite-sidebar-secondary-nav"] a[href="/demo/components"]',
    ),
  ).toHaveAttribute("aria-current", "page");

  const handle = page.locator('[data-test="sidebar-resize-handle"]');
  const box = await handle.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + 80);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 + 48, box!.y + 80, {
    steps: 4,
  });
  await page.mouse.up();

  await expect
    .poll(() =>
      page
        .locator('[data-test="app-shell"] > aside')
        .first()
        .evaluate((aside) => Math.round(aside.getBoundingClientRect().width)),
    )
    .toBe(288);
});

test("demo theme switcher persists the selected theme", async ({ page }) => {
  await expect(async () => {
    await page.goto("/demo");
  }).toPass({ intervals: [250, 500, 1_000], timeout: 30_000 });

  const switcher = page.locator('select[aria-label="Colour theme"]:visible');
  await expect(switcher).toBeVisible();
  await switcher.selectOption("malibu-dark");
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "malibu-dark",
  );
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("ph-theme")))
    .toBe("malibu-dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "malibu-dark",
  );
});

test("auth, settings, loading, and filter patterns", async ({ page }) => {
  await expect(async () => {
    await page.goto("/demo/patterns");
  }).toPass({ intervals: [250, 500, 1_000], timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("nextjs-portal")
    .evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
  await page
    .locator(".suite-app-layout__main header")
    .first()
    .evaluate((header) => {
      (header as HTMLElement).style.display = "none";
    });
  await expect(page.locator(".ph-auth-layout").first()).toHaveCSS(
    "display",
    "grid",
  );
  await page.waitForTimeout(150);

  for (const id of ["auth", "settings", "progress", "filters"] as const) {
    await expect(page.locator(`#${id}`)).toHaveScreenshot(`${id}-pattern.png`, {
      animations: "disabled",
    });
  }
});

test("semantic solid buttons maintain readable foreground contrast", async ({
  page,
}) => {
  await expect(async () => {
    await page.goto("/demo/patterns");
  }).toPass({ intervals: [250, 500, 1_000], timeout: 30_000 });

  const panel = page
    .getByRole("heading", { name: "Semantic solids" })
    .locator("..");
  const primaryPanel = page
    .getByRole("heading", { name: "Marketing signal vs in-app" })
    .locator("..");
  const solidButtons = panel
    .locator("button")
    .or(primaryPanel.locator("button"));
  const failures: string[] = [];

  for (const theme of THEMES) {
    await page.evaluate((themeId) => {
      document.documentElement.dataset.theme = themeId;
    }, theme.id);
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
    await page.waitForTimeout(200);

    const measurements = await solidButtons.evaluateAll((buttons) => {
      const luminance = (color: string) => {
        const channels = color
          .match(/[\d.]+/g)
          ?.slice(0, 3)
          .map(Number) ?? [0, 0, 0];
        const linear = channels.map((channel) => {
          const value = channel / 255;
          return value <= 0.04045
            ? value / 12.92
            : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };

      return buttons.map((button) => {
        const chrome = button.querySelector<HTMLElement>(".ph-btn-chrome");
        const foreground = getComputedStyle(chrome ?? button).color;
        const background = chrome
          ? getComputedStyle(chrome, "::after").backgroundColor
          : "";
        const values = [luminance(foreground), luminance(background)].sort(
          (a, b) => b - a,
        );
        return {
          label: button.textContent?.trim() ?? "button",
          foreground,
          background,
          ratio: (values[0] + 0.05) / (values[1] + 0.05),
        };
      });
    });

    for (const measurement of measurements) {
      if (measurement.ratio < 4.5) {
        failures.push(
          `${theme.id} ${measurement.label}: ${measurement.ratio.toFixed(2)} (${measurement.foreground} on ${measurement.background})`,
        );
      }
    }
  }

  expect(failures).toEqual([]);
});
