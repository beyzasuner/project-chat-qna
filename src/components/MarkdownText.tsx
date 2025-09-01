"use client";

import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type CodeProps = React.HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const Code = ({ inline = false, className, children, ...props }: CodeProps) => {
  const hasLang = /language-/.test(className ?? "");
  if (!inline && hasLang) {
    // Kod bloğu + dil -> highlight.js renklendirecek
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }
  // Satır içi kod
  return (
    <code className="rounded bg-muted px-1.5 py-0.5" {...props}>
      {children}
    </code>
  );
};

export function MarkdownText({ children }: { children: string }) {
  const components: Components = {
    code: Code as unknown as Components["code"],
    pre: (props) => <pre className="overflow-x-auto" {...props} />, // güvenli kaydırma
  };

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
