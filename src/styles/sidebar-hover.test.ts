import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss, { type Rule } from "postcss";
import { expect, it } from "vitest";

const skin = postcss.parse(readFileSync(resolve("src/styles/suite-skin.css"), "utf8"));
const hoverRule = skin.nodes.find(
  (node): node is Rule => node.type === "rule" && node.selector.includes(".suite-tree-navigation .suite-sidebar-link:") && node.nodes.some((declaration) => declaration.type === "decl" && declaration.prop === "background"),
)!;

it("applies the shared sidebar hover background only to unselected destinations", () => {
  const container = document.createElement("nav");
  container.className = "suite-tree-navigation";
  for (const [className, selected, attribute] of [
    ["suite-sidebar-link", false, ""],
    ["suite-sidebar-link", true, 'aria-current="page"'],
    ["suite-sidebar-link ph-nav-highlight", true, 'aria-current="page"'],
    ["suite-sidebar-tree-row", false, ""],
    ["suite-sidebar-tree-row", true, 'data-suite-tree-current="true"'],
    ["suite-sidebar-tree-row ph-nav-highlight", true, ""],
  ] as const) {
    container.innerHTML = `<a class="${className}" data-hover ${attribute}>Destination</a>`;
    const item = container.firstElementChild!;
    const matchesHover = hoverRule.selectors.some((selector) => item.matches(selector.replaceAll(":hover", "[data-hover]")));
    expect(matchesHover, `${className} ${attribute}`).toBe(!selected);
  }
  expect(skin.toString()).not.toContain(".suite-sidebar-tree-row.ph-nav-highlight:hover");
});

it("moves the selected-row pill instantly instead of sliding", () => {
  const indicator = skin.nodes.find(
    (node): node is Rule => node.type === "rule" && node.selector === ".suite-tree-indicator",
  )!;
  expect(indicator.nodes.some((node) => node.type === "decl" && node.prop === "transition")).toBe(false);
  const nav = readFileSync(resolve("src/suite/components/suite-sidebar.tsx"), "utf8");
  expect(nav).not.toContain("transition-[transform,width,height]");
});

it("keeps the route entrance short and free of travel", () => {
  const css = skin.toString();
  const animation = /\.suite-route-transition\s*\{([^}]*)\}/.exec(css)![1];
  expect(animation).toContain("90ms");
  expect(css).not.toContain("translateY(6px)");
});
