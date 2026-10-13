import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ConfirmDialog } from "./ConfirmDialog";
import { Modal } from "./Modal";
import { ModalActions, ModalBody, ModalFrame, ModalHeader } from "./ModalParts";

afterEach(cleanup);

describe("ModalFrame", () => {
  it("labels the dialog by its title and closes from the header ✕", async () => {
    const onClose = vi.fn();
    render(
      <ModalFrame open onClose={onClose}>
        <ModalHeader title="Edit client" onClose={onClose} />
        <ModalBody>Body</ModalBody>
      </ModalFrame>,
    );

    expect(screen.getByRole("dialog", { name: "Edit client" })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape unless the overlay is locked", async () => {
    const onClose = vi.fn();
    render(
      <ModalFrame open onClose={onClose}>
        <ModalHeader title="Dialog" onClose={onClose} />
      </ModalFrame>,
    );

    await userEvent.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });
});

describe("ModalActions", () => {
  it("fires cancel and save, and locks both while saving", async () => {
    const onCancel = vi.fn();
    const onSave = vi.fn();
    const { rerender } = render(
      <ModalActions onCancel={onCancel} onSave={onSave} saveLabel="Create" />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);

    rerender(
      <ModalActions
        onCancel={onCancel}
        onSave={onSave}
        saveLabel="Create"
        saving
      />,
    );
    expect(
      (screen.getByRole("button", { name: "Cancel" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(
      (document.querySelector('[data-test="modal-save"]') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });
});

describe("ConfirmDialog", () => {
  it("focuses Cancel first so Return never confirms a destructive action", () => {
    render(
      <ConfirmDialog
        open
        destructive
        title="Delete note?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        confirmLabel="Delete"
      />,
    );

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Cancel" }),
    );
  });

  it("confirms, cancels, and honours confirmDisabled", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { rerender } = render(
      <ConfirmDialog
        open
        title="Remove?"
        confirmLabel="Remove"
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmDisabled
      />,
    );
    expect(
      (screen.getByRole("button", { name: "Remove" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);

    rerender(
      <ConfirmDialog
        open
        title="Remove?"
        confirmLabel="Remove"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

describe("Modal initial focus", () => {
  it("lands on the first text field rather than a toolbar button", () => {
    render(
      <Modal open customLayout aria-label="Note" onClose={vi.fn()}>
        <button type="button">Pin</button>
        <input aria-label="Title" />
      </Modal>,
    );

    expect(document.activeElement).toBe(screen.getByLabelText("Title"));
  });
});
