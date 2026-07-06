"use client";

import { X } from "lucide-react";
import type { BlogEntry } from "@/lib/data";

type Props = {
  entry: BlogEntry;
  index: number;
  onChange: (index: number, entry: BlogEntry) => void;
  onRemove: (index: number) => void;
};

export function BlogEntryForm({ entry, index, onChange, onRemove }: Props) {
  return (
    <div className="border border-[#D4D4CC] bg-[#FAFAF7] p-4" style={{ borderRadius: "3px" }}>
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs text-[#45744D] font-medium"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Entrada #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-[#C93453] hover:opacity-80 transition-opacity"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={entry.date}
            onChange={(e) =>
              onChange(index, { ...entry, date: e.target.value })
            }
            required
            className="w-full text-xs px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] focus:outline-none focus:border-[#34C94E] transition-colors"
            style={{ fontFamily: "var(--font-body)", borderRadius: "2px" }}
          />
          <input
            type="text"
            value={entry.title}
            onChange={(e) =>
              onChange(index, { ...entry, title: e.target.value })
            }
            required
            placeholder="Título de la entrada"
            className="w-full text-xs px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
            style={{ fontFamily: "var(--font-body)", borderRadius: "2px" }}
          />
        </div>

        <textarea
          value={entry.body}
          onChange={(e) => onChange(index, { ...entry, body: e.target.value })}
          required
          rows={4}
          placeholder="Cuerpo de la entrada..."
          className="w-full text-xs px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] placeholder:text-[#D4D4CC] resize-none focus:outline-none focus:border-[#34C94E] transition-colors"
          style={{ fontFamily: "var(--font-body)", borderRadius: "2px" }}
        />

        <input
          type="text"
          value={entry.tags.join(", ")}
          onChange={(e) =>
            onChange(index, {
              ...entry,
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          placeholder="Tags (separados por coma)"
          className="w-full text-xs px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
          style={{ fontFamily: "var(--font-body)", borderRadius: "2px" }}
        />
      </div>
    </div>
  );
}
