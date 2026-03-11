"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
};

export function Tabs({ items }: TabsProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.id);

  return (
    <div className="space-y-6">
      <div role="tablist" aria-orientation="horizontal" className="inline-flex flex-wrap gap-2 rounded-full border border-[var(--border)] p-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${item.id}-tab`}
            aria-selected={activeTab === item.id}
            aria-controls={`${item.id}-panel`}
            tabIndex={activeTab === item.id ? 0 : -1}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition",
              activeTab === item.id ? "bg-[var(--foreground)] text-white" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]",
            )}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) =>
        item.id === activeTab ? (
          <div
            key={item.id}
            role="tabpanel"
            id={`${item.id}-panel`}
            aria-labelledby={`${item.id}-tab`}
          >
            {item.content}
          </div>
        ) : null,
      )}
    </div>
  );
}
