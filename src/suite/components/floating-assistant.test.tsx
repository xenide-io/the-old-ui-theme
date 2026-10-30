import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { SuiteFloatingAssistant } from "./floating-assistant";
import type { CompanionCue } from "./companion-provider";
import { Modal } from "../../components/ui/Modal";

let main: HTMLElement, anchor: HTMLButtonElement;
const props = {
  open: false,
  onOpenChange: vi.fn(),
  avatar: <span>Kiki</span>,
  chatAvatar: <span>Kiki</span>,
  title: "Kiki",
  status: "Ready",
  motion: false,
  children: <p>Chat</p>,
};
beforeEach(() => {
  vi.stubGlobal("innerWidth", 1280);
  vi.stubGlobal("innerHeight", 900);
  main = document.createElement("main");
  main.id = "main-content";
  document.body.append(main);
  anchor = document.createElement("button");
  main.append(anchor);
  main.getBoundingClientRect = () => ({
    left: 280,
    top: 56,
    right: 1280,
    bottom: 900,
    width: 1000,
    height: 844,
    x: 280,
    y: 56,
    toJSON() {},
  });
  anchor.getBoundingClientRect = () => ({
    left: 600,
    top: 300,
    right: 700,
    bottom: 340,
    width: 100,
    height: 40,
    x: 600,
    y: 300,
    toJSON() {},
  });
});
afterEach(() => {
  cleanup();
  main.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("ignores dragging and old saved coordinates and stays at its fixed home", () => {
  const getItem = vi.fn().mockReturnValue(JSON.stringify({ x: 0, y: 0 }));
  vi.stubGlobal("localStorage", { getItem });
  render(<SuiteFloatingAssistant {...props} />);
  const friend = screen.getByRole("button", { name: "Open assistant: Kiki" });
  expect(friend).toHaveStyle({ left: "1212px", top: "832px" });
  fireEvent.pointerDown(friend, {
    button: 0,
    pointerId: 1,
    clientX: 1240,
    clientY: 860,
  });
  fireEvent.pointerMove(friend, { pointerId: 1, clientX: 0, clientY: 0 });
  fireEvent.pointerUp(friend, { pointerId: 1 });
  expect(friend).toHaveStyle({ left: "1212px", top: "832px" });
  expect(friend).toHaveAttribute("draggable", "false");
  expect(getItem).not.toHaveBeenCalled();
});

it("tucks chat into the artwork's transparent headroom, outside shell stacking contexts", () => {
  const view = render(<SuiteFloatingAssistant {...props} open />);
  const friend = screen.getByRole("button", { name: "Open assistant: Kiki" });
  const chat = screen.getByRole("dialog", { name: "Kiki companion" });
  expect(
    Number.parseFloat(chat.style.top) + Number.parseFloat(chat.style.height),
  ).toBe(Number.parseFloat(friend.style.top) - 2);
  expect(view.container).not.toContainElement(friend);
  expect(friend.closest(".suite-companion-stage")).toHaveStyle({
    zIndex: "2147483647",
  });
});

it("keeps chat interactive inside modal focus boundaries without losing its draft", async () => {
  const onClose = vi.fn();
  const onOpenChange = vi.fn();
  const content = (open: boolean) => (
    <>
      <SuiteFloatingAssistant {...props} open onOpenChange={onOpenChange}>
        <input aria-label="Draft" />
      </SuiteFloatingAssistant>
      <Modal open={open} onClose={onClose} title="Review">
        <input aria-label="Modal field" />
      </Modal>
    </>
  );
  const view = render(content(false));
  const draft = screen.getByRole("textbox", { name: "Draft" });
  fireEvent.change(draft, { target: { value: "Keep this draft" } });
  view.rerender(content(true));
  const modal = screen.getByRole("dialog", { name: "Review" });
  await waitFor(() => expect(modal).toContainElement(draft));
  draft.focus();
  expect(draft).toHaveFocus();
  fireEvent.pointerDown(draft);
  fireEvent.keyDown(draft, { key: "Escape" });
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(onClose).not.toHaveBeenCalled();
  expect(draft).toHaveValue("Keep this draft");
  view.rerender(content(false));
  await waitFor(() => expect(draft).toBeInTheDocument());
  expect(screen.getByRole("textbox", { name: "Draft" })).toBe(draft);
  expect(draft).toHaveValue("Keep this draft");
});

it("summons keyboard-accessible tools, invokes only the selected action, and returns home", async () => {
  const action = vi.fn(),
    dismiss = vi.fn(),
    Icon = () => <span />;
  const cue: CompanionCue = {
    anchor,
    mode: "menu",
    label: "Choose a tool",
    tools: [
      { id: "summarise", label: "Summarise", icon: Icon, onSelect: action },
      {
        id: "improve",
        label: "Improve writing",
        icon: Icon,
        onSelect: vi.fn(),
      },
    ],
  };
  const view = render(
    <SuiteFloatingAssistant {...props} cue={cue} onDismissCue={dismiss} />,
  );
  await waitFor(() =>
    expect(screen.getByRole("menuitem", { name: "Summarise" })).toHaveFocus(),
  );
  expect(action).not.toHaveBeenCalled();
  fireEvent.keyDown(screen.getByRole("menu"), { key: "ArrowRight" });
  expect(
    screen.getByRole("menuitem", { name: "Improve writing" }),
  ).toHaveFocus();
  fireEvent.click(screen.getByRole("menuitem", { name: "Summarise" }));
  expect(action).toHaveBeenCalledOnce();
  fireEvent.keyDown(window, { key: "Escape" });
  expect(dismiss).toHaveBeenCalledOnce();
  expect(anchor).toHaveFocus();
  view.rerender(<SuiteFloatingAssistant {...props} cue={null} />);
  expect(
    screen.getByRole("button", { name: "Open assistant: Kiki" }),
  ).toHaveStyle({ left: "1212px", top: "832px" });
});

it("offers a click-me invitation, reacts to hover and opens the chat", async () => {
  vi.useFakeTimers();
  const onOpenChange = vi.fn();
  render(
    <SuiteFloatingAssistant
      {...props}
      motion
      onOpenChange={onOpenChange}
    />,
  );
  expect(screen.queryByTestId("assistant-invite")).toBeNull();
  await act(async () => vi.advanceTimersByTime(2300));
  const invite = screen.getByTestId("assistant-invite");
  expect(invite).toHaveTextContent("Click me");
  expect(invite).toHaveAttribute("aria-hidden", "true");

  const friend = screen.getByRole("button", { name: "Open assistant: Kiki" });
  fireEvent.click(friend);
  expect(onOpenChange).toHaveBeenCalledWith(true);
  fireEvent.pointerEnter(friend);
  expect(
    friend.querySelector("[data-assistant-avatar]"),
  ).toHaveAttribute("data-hover", "true");
  fireEvent.pointerLeave(friend);
  expect(
    friend.querySelector("[data-assistant-avatar]"),
  ).not.toHaveAttribute("data-hover");
});

it("does not fake completion during work; only a real outcome starts the return timer", async () => {
  vi.useFakeTimers();
  const dismiss = vi.fn();
  const cue: CompanionCue = {
    anchor,
    mode: "work",
    label: "Calculating forecast",
    motion: "jump",
  };
  const view = render(
    <SuiteFloatingAssistant {...props} cue={cue} onDismissCue={dismiss} />,
  );
  await act(async () => vi.advanceTimersByTime(10000));
  expect(dismiss).not.toHaveBeenCalled();
  expect(
    screen.getByRole("button", { name: "Open assistant: Kiki" }),
  ).toBeDisabled();
  expect(
    screen.getByRole("button", { name: "Open assistant: Kiki" }),
  ).toHaveStyle({ pointerEvents: "none" });
  expect(
    document.querySelector('[data-test="assistant-particles"]'),
  ).toBeNull();
  view.rerender(
    <SuiteFloatingAssistant
      {...props}
      cue={{ ...cue, mode: "success", label: "Preview ready" }}
      onDismissCue={dismiss}
    />,
  );
  expect(
    document.querySelector('[data-test="assistant-particles"]'),
  ).not.toBeNull();
  await act(async () => vi.advanceTimersByTime(1500));
  expect(dismiss).toHaveBeenCalledOnce();
});
