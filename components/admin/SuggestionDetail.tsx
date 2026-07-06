"use client";

import { Mail, Copy, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import DOMPurify from "dompurify";
import type { Suggestion } from "@/lib/types";

type Props = {
  suggestion: Suggestion;
  onToggleRead: () => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SuggestionDetail({ suggestion, onToggleRead }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(suggestion.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silently
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Actions bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D4D4CC]">
        <button
          onClick={onToggleRead}
          className="inline-flex items-center gap-1 text-xs text-[#45744D] hover:text-[#34C94E] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {suggestion.read ? <EyeOff size={12} /> : <Eye size={12} />}
          {suggestion.read ? "Marcar no leída" : "Marcar leída"}
        </button>
      </div>

      {/* Name */}
      <h3
        className="text-lg font-bold text-[#3452C9] mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {suggestion.name || "Anónimo"}
      </h3>

      {/* Email */}
      <div className="flex items-center gap-2 mb-4">
        <a
          href={`mailto:${suggestion.email}`}
          className="inline-flex items-center gap-1 text-xs text-[#34C94E] hover:underline"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <Mail size={11} />
          {suggestion.email}
        </a>
        <button
          onClick={handleCopyEmail}
          className="inline-flex items-center gap-1 text-[10px] text-[#45744D] hover:text-[#34C94E] transition-colors px-2 py-0.5 border border-[#D4D4CC]"
          style={{ fontFamily: "var(--font-mono)", borderRadius: "2px" }}
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? "Copiado" : "Copiar email"}
        </button>
      </div>

      {/* Date */}
      <p
        className="text-[11px] text-[#45744D] opacity-60 mb-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {formatDate(suggestion.createdAt)}
      </p>

      {/* Message */}
      <div
        className="text-sm text-[#3452C9] leading-relaxed opacity-90"
        style={{ fontFamily: "var(--font-body)" }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(suggestion.message),
        }}
      />
    </div>
  );
}
