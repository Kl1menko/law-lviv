import type { ReactNode } from "react";

type MarkdownRendererProps = {
  content: string;
};

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "hr" }
  | { type: "p"; text: string };

function renderInlineContent(text: string): ReactNode[] {
  const matches = Array.from(text.matchAll(/(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*]+)\*)/g));
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const [match, linkMatch, linkText, linkHref, boldMatch, boldText, codeMatch, codeText, italicMatch, italicText] of matches) {
    const start = match ? text.indexOf(match, lastIndex) : -1;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    if (linkMatch && linkText && linkHref) {
      const isExternal = /^https?:\/\//.test(linkHref);

      nodes.push(
        <a
          key={`${linkHref}-${start}`}
          href={linkHref}
          className="underline decoration-[var(--border)] underline-offset-4 transition hover:decoration-[var(--foreground)]"
          {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {linkText}
        </a>,
      );
    } else if (boldMatch && boldText) {
      nodes.push(
        <strong key={`strong-${start}`} className="font-semibold text-[var(--foreground)]">
          {boldText}
        </strong>,
      );
    } else if (codeMatch && codeText) {
      nodes.push(
        <code key={`code-${start}`} className="rounded-md bg-[var(--muted)] px-2 py-1 font-mono text-[0.9em] text-[var(--foreground)]">
          {codeText}
        </code>,
      );
    } else if (italicMatch && italicText) {
      nodes.push(
        <em key={`em-${start}`} className="italic text-[var(--foreground)]">
          {italicText}
        </em>,
      );
    }

    lastIndex = start + match.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : [text];
}

function parseMarkdown(content: string): Block[] {
  const blocks = content
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const firstLine = lines[0] ?? "";

    if (firstLine === "---") {
      return { type: "hr" };
    }

    if (lines.every((line) => line.startsWith("> "))) {
      return {
        type: "blockquote",
        text: lines.map((line) => line.replace(/^>\s?/, "").trim()).join(" "),
      };
    }

    if (lines.every((line) => /^- /.test(line))) {
      return {
        type: "ul",
        items: lines.map((line) => line.replace(/^- /, "").trim()),
      };
    }

    if (lines.every((line) => /^\d+\.\s/.test(line))) {
      return {
        type: "ol",
        items: lines.map((line) => line.replace(/^\d+\.\s/, "").trim()),
      };
    }

    if (firstLine.startsWith("## ")) {
      return {
        type: "h2",
        text: firstLine.replace(/^## /, "").trim(),
      };
    }

    if (firstLine.startsWith("### ")) {
      return {
        type: "h3",
        text: firstLine.replace(/^### /, "").trim(),
      };
    }

    return {
      type: "p",
      text: lines.join(" "),
    };
  });
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = parseMarkdown(content);
  const firstParagraphIndex = blocks.findIndex((block) => block.type === "p");

  return (
    <article className="prose-shell space-y-6">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "h2") {
          return (
            <h2 key={key} className="border-t border-[var(--border)] pt-8 text-3xl tracking-tight sm:text-4xl">
              {block.text}
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3 key={key} className="pt-2 text-2xl tracking-tight sm:text-3xl">
              {block.text}
            </h3>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote key={key} className="rounded-[24px] border border-[var(--border)] bg-[var(--muted)] px-6 py-5 text-lg leading-8 text-[var(--foreground)]">
              {renderInlineContent(block.text)}
            </blockquote>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={key} className="space-y-3 pl-6 text-base leading-8 text-[var(--foreground)] sm:text-lg">
              {block.items.map((item) => (
                <li key={item} className="list-disc marker:text-[var(--muted-foreground)]">
                  {renderInlineContent(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={key} className="space-y-3 pl-6 text-base leading-8 text-[var(--foreground)] sm:text-lg">
              {block.items.map((item) => (
                <li key={item} className="list-decimal marker:text-[var(--muted-foreground)]">
                  {renderInlineContent(item)}
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "hr") {
          return <hr key={key} className="border-0 border-t border-[var(--border)]" />;
        }

        return (
          <p
            key={key}
            className={
              index === firstParagraphIndex
                ? "text-xl leading-9 text-[var(--foreground)] sm:text-2xl"
                : "text-base leading-8 text-[var(--muted-foreground)] sm:text-lg"
            }
          >
            {renderInlineContent(block.text)}
          </p>
        );
      })}
    </article>
  );
}
