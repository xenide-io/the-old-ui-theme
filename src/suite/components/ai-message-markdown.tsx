"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SuiteAiMarkdownMessage({
  markdown,
}: {
  markdown: string;
}) {
  return (
    <div className="suite-ai-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ img: () => null }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
