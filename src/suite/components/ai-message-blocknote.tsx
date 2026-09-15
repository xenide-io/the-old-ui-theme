"use client";

import { useEffect } from "react";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteViewRaw, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";

import { useSuiteTheme } from "./theme-provider";

const assistantSchema = BlockNoteSchema.create({
  blockSpecs: {
    paragraph: defaultBlockSpecs.paragraph,
    heading: defaultBlockSpecs.heading,
    bulletListItem: defaultBlockSpecs.bulletListItem,
    numberedListItem: defaultBlockSpecs.numberedListItem,
    checkListItem: defaultBlockSpecs.checkListItem,
    codeBlock: defaultBlockSpecs.codeBlock,
    quote: defaultBlockSpecs.quote,
    table: defaultBlockSpecs.table,
    divider: defaultBlockSpecs.divider,
  },
});

export default function SuiteAiBlockNoteMessage({
  markdown,
}: {
  markdown: string;
}) {
  const { resolvedTheme } = useSuiteTheme();
  const editor = useCreateBlockNote({ schema: assistantSchema });

  useEffect(() => {
    try {
      const blocks = editor.tryParseMarkdownToBlocks(markdown);
      editor.replaceBlocks(
        editor.document,
        blocks.length > 0 ? blocks : [{ type: "paragraph", content: markdown }],
      );
    } catch {
      editor.replaceBlocks(editor.document, [
        { type: "paragraph", content: markdown },
      ]);
    }
  }, [editor, markdown]);

  // BlockNote renders the body as a ProseMirror contenteditable (.tiptap);
  // give that node an accessible name so axe's aria-input-field-name passes.
  useEffect(() => {
    const el = (editor as unknown as { domElement?: HTMLElement }).domElement;
    el?.setAttribute("aria-label", "Assistant message");
  }, [editor]);

  return (
    <BlockNoteViewRaw
      editor={editor}
      editable={false}
      theme={resolvedTheme}
      className="suite-ai-blocknote"
      formattingToolbar={false}
      sideMenu={false}
      slashMenu={false}
      linkToolbar={false}
      filePanel={false}
      tableHandles={false}
      comments={false}
    />
  );
}
