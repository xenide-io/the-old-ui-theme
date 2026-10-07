"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { trackSuiteEvent } from "@/lib/suite-analytics";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = "tsx", filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return;
    }
    trackSuiteEvent("Link Copied", {
      kind: "code",
      copy_kind: "code_block",
      label: filename ?? language,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("ph-code-block", className)}>
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-xs text-white/60">{filename ?? language}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="ph-code-block__copy"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-[#e4e4e7]">{code}</code>
      </pre>
    </div>
  );
}
