"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { toast } from "sonner";
import { SuggestionInbox } from "@/components/admin/SuggestionInbox";
import { SuggestionDetail } from "@/components/admin/SuggestionDetail";
import { Copy } from "lucide-react";
import type { Suggestion } from "@/lib/types";

type SuggestionWithId = Suggestion & { _id: string };

export default function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestionWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      const q = query(
        collection(db, "suggestions"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({
        _id: d.id,
        ...(d.data() as Suggestion),
      }));
      setSuggestions(list);
    } catch {
      toast.error("Error al cargar sugerencias");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const filtered = suggestions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.message.toLowerCase().includes(q)
    );
  });

  const activeSuggestion = selectedId
    ? suggestions.find((s) => s._id === selectedId) ?? null
    : null;

  const handleToggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    // Auto-mark as read when selected
    const s = suggestions.find((s) => s._id === id);
    if (s && !s.read) {
      updateDoc(doc(db, "suggestions", id), { read: true }).then(() => {
        setSuggestions((prev) =>
          prev.map((p) => (p._id === id ? { ...p, read: true } : p))
        );
      });
    }
  };

  const handleToggleRead = async () => {
    if (!selectedId || !activeSuggestion) return;
    const newRead = !activeSuggestion.read;
    try {
      await updateDoc(doc(db, "suggestions", selectedId), { read: newRead });
      setSuggestions((prev) =>
        prev.map((s) => (s._id === selectedId ? { ...s, read: newRead } : s))
      );
    } catch {
      toast.error("Error al actualizar");
    }
  };

  const handleCopySelectedEmails = async () => {
    const emails = suggestions
      .filter((s) => selected.has(s._id))
      .map((s) => s.email)
      .filter(Boolean);
    if (emails.length === 0) {
      toast.error("Ninguna sugerencia seleccionada tiene email");
      return;
    }
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      toast.success(`${emails.length} email${emails.length > 1 ? "s" : ""} copiado${emails.length > 1 ? "s" : ""}`);
    } catch {
      toast.error("Error al copiar");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span
          className="text-xs text-[#45744D] animate-pulse"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          cargando sugerencias...
        </span>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <p
        className="text-xs text-[#45744D] mb-1 tracking-wider"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // sugerencias recibidas
      </p>
      <h1
        className="text-2xl font-bold text-[#3452C9] mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Sugerencias
      </h1>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="mb-3">
          <button
            onClick={handleCopySelectedEmails}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-[#45744D] text-white border border-[#45744D] hover:opacity-90 transition-opacity"
            style={{ borderRadius: "2px", fontFamily: "var(--font-mono)" }}
          >
            <Copy size={11} />
            Copiar emails ({selected.size})
          </button>
        </div>
      )}

      {/* Two-panel layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-80 shrink-0">
          <SuggestionInbox
            suggestions={filtered}
            selected={selected}
            onToggle={handleToggle}
            onSelect={handleSelect}
            search={search}
            onSearchChange={setSearch}
            selectedId={selectedId}
          />
        </div>
        <div className="flex-1 border border-[#D4D4CC] bg-[#F5F5F0] p-5 overflow-y-auto" style={{ borderRadius: "3px" }}>
          {activeSuggestion ? (
            <SuggestionDetail
              suggestion={activeSuggestion}
              onToggleRead={handleToggleRead}
            />
          ) : (
            <div className="flex items-center justify-center min-h-full">
              <p
                className="text-xs text-[#45744D] opacity-50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Selecciona una sugerencia para ver su detalle
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
