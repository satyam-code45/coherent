"use client"

import { memo, ComponentPropsWithoutRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export const DisplayMarkDown = memo(function MarkdownBubble({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => (
          <a
            {...props}
            className="underline underline-offset-2 mr-1"
            target="_blank"
            rel="noreferrer"
          />
        ),
        ul: ({ ...props }) => (
          <ul className="list-disc list-inside space-y-2 mb-5" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-decimal" {...props} />
        ),
        li: ({ ...props }) => (
          <li style={{ marginBottom: '7px' }} {...props} />
        ),
        p: ({ ...props }) => <p className="mb-5" {...props} />,
        h1: ({ ...props }) => (
          <h1 className="text-xl font-bold mt-2 mb-2" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2 className="text-lg font-semibold mt-2 mb-2" {...props} />
        ),
        h3: ({ ...props }) => (
          <h3 className="text-base font-semibold mt-2" {...props} />
        ),
        strong: ({ ...props }) => (
          <strong className="font-bold" {...props} />
        ),
        // Changed 'any' to ComponentPropsWithoutRef<"code">
        code: ({ className, children, ...props }: ComponentPropsWithoutRef<"code">) => {
          const inline = !className;
          return inline ? (
            <code
              className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ ...props }) => (
          <pre className="p-3 rounded-lg overflow-x-auto bg-black/10 dark:bg-white/10" {...props} />
        ),
        table: ({ ...props }) => (
          <table className="table-auto border-collapse border border-gray-300 w-full mb-5" {...props} />
        ),
        thead: ({ ...props }) => (
          <thead className="bg-gray-200 dark:bg-gray-700" {...props} />
        ),
        tbody: ({ ...props }) => <tbody {...props} />,
        tr: ({ ...props }) => (
          <tr className="border-b border-gray-300 dark:border-gray-600" {...props} />
        ),
        th: ({ ...props }) => (
          <th className="px-3 py-2 text-left font-semibold border border-gray-300" {...props} />
        ),
        td: ({ ...props }) => (
          <td className="px-3 py-2 border border-gray-300 dark:border-gray-600" {...props} />
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  )
})