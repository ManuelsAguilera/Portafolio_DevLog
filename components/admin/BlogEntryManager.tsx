"use client";

import { Plus } from "lucide-react";
import { BlogEntryForm } from "./BlogEntryForm";
import type { BlogEntry } from "@/lib/data";

type Props = {
  entries: BlogEntry[];
  onChange: (entries: BlogEntry[]) => void;
};

function emptyEntry(): BlogEntry {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  return { date, title: "", body: "", tags: [] };
}

export function BlogEntryManager({ entries, onChange }: Props) {
  const handleChange = (index: number, entry: BlogEntry) => {
    const next = [...entries];
    next[index] = entry;
    onChange(next);
  };

  const handleRemove = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...entries, emptyEntry()]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className="text-xs text-[#45744D] font-medium"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Entradas del blog ({entries.length})
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-[#34C94E] text-white border border-[#34C94E] hover:bg-[#2ab342] transition-colors"
          style={{ borderRadius: "2px", fontFamily: "var(--font-mono)" }}
        >
          <Plus size={11} />
          Agregar entrada
        </button>
      </div>
      {entries.length === 0 ? (
        <p
          className="text-xs text-[#45744D] opacity-50 py-4 text-center"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          No hay entradas aún. Agrega la primera.
        </p>
      ) : (
        entries.map((entry, i) => (
          <BlogEntryForm
            key={i}
            entry={entry}
            index={i}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        ))
      )}
    </div>
  );
}
