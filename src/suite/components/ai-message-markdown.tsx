"use client";

import ReactMarkdown, { type Options } from "react-markdown";
import remarkGfm from "remark-gfm";

/** Per-word stagger step, and the ceiling so a long reply still settles fast. */
const WORD_STEP_MS = 18;
const MAX_DELAY_MS = 600;

/** Tags whose text is left alone — animating code word by word reads badly. */
const SKIP_TAGS = new Set(["code", "pre", "style", "script"]);

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/**
 * Wrap each word of prose in a span that fades in on a stagger, so a reply
 * that arrived in one payload reads as if it were being written.
 *
 * Delay lives inline on the span, so React re-rendering the same tree reuses
 * the same elements and the animation does not replay.
 */
function rehypeStaggerWords() {
  return (tree: HastNode) => {
    let wordIndex = 0;

    const visit = (node: HastNode) => {
      if (!node.children) return;
      if (node.tagName && SKIP_TAGS.has(node.tagName)) return;

      const next: HastNode[] = [];
      for (const child of node.children) {
        const isText =
          child.type === "text" &&
          typeof child.value === "string" &&
          /\S/.test(child.value);

        if (!isText) {
          visit(child);
          next.push(child);
          continue;
        }

        for (const part of child.value!.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            next.push({ type: "text", value: part });
            continue;
          }
          const delay = Math.min(wordIndex * WORD_STEP_MS, MAX_DELAY_MS);
          wordIndex += 1;
          next.push({
            type: "element",
            tagName: "span",
            properties: {
              className: ["suite-word-in"],
              style: `animation-delay:${delay}ms`,
            },
            children: [{ type: "text", value: part }],
          });
        }
      }
      node.children = next;
    };

    visit(tree);
  };
}

export default function SuiteAiMarkdownMessage({
  markdown,
  animate = false,
}: {
  markdown: string;
  animate?: boolean;
}) {
  return (
    <div className="suite-ai-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={
          (animate ? [rehypeStaggerWords] : undefined) as Options["rehypePlugins"]
        }
        components={{ img: () => null }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
