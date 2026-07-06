"use client";

import { Search } from "lucide-react";
import type { Suggestion } from "@/lib/types";

type Props = {
  suggestions: Suggestion[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  selectedId: string | null;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export function SuggestionInbox({
  suggestions,
  selected,
  onToggle,
  onSelect,
  search,
  onSearchChange,
  selectedId,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative mb-3">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45744D] opacity-50"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar en sugerencias..."
          className="w-full text-xs pl-8 pr-3 py-2 border border-[#D4D4CC] bg-[#FAFAF7] text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
          style={{ fontFamily: "var(--font-body)", borderRadius: "2px" }}
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto border border-[#D4D4CC]" style={{ borderRadius: "2px" }}>
        {suggestions.length === 0 ? (
          <p
            className="text-xs text-[#45744D] opacity-50 text-center py-8"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {search ? "Sin resultados" : "No hay sugerencias aún"}
          </p>
        ) : (
          suggestions.map((s) => {
            const docId = (s as Suggestion & { _id?: string })._id ?? "";
            const isSelected = selectedId === docId;
            return (
              <button
                key={docId}
                onClick={() => onSelect(docId)}
                className={`w-full text-left px-3 py-3 border-b border-[#D4D4CC] last:border-b-0 transition-colors flex items-start gap-2 ${
                  isSelected
                    ? "bg-[#EDEEE8]"
                    : "hover:bg-[#FAFAF7]"
                } ${!s.read ? "bg-[#FAFAF7]" : ""}`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={selected.has(docId)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggle(docId);
                    }}
                    className="accent-[#34C94E]"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {!s.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34C94E] shrink-0" />
                    )}
                    <span className={`text-xs ${!s.read ? "font-semibold" : ""} text-[#3452C9] truncate`}>
                      {s.name || "Anónimo"}
                    </span>
                    <span className="text-[10px] text-[#45744D] opacity-50 ml-auto shrink-0">
                      {formatDate(s.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#45744D] opacity-70 truncate">
                    {truncate(s.message, 80)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
