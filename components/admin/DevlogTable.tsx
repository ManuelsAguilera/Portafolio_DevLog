"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  FileText,
  Calendar,
} from "lucide-react";
import { statusLabel, statusColor } from "@/lib/data";
import type { Project } from "@/lib/data";

type Props = {
  projects: Project[];
  selected: Set<number>;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  onDeleteSelected: () => void;
  search: string;
  onSearchChange: (v: string) => void;
  filter: string;
  onFilterChange: (v: string) => void;
};

const tabs = [
  { value: "", label: "Todos" },
  { value: "past", label: "Pasados" },
  { value: "current", label: "Actuales" },
  { value: "future", label: "Futuros" },
];

export function DevlogTable({
  projects,
  selected,
  onToggle,
  onToggleAll,
  onDeleteSelected,
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: Props) {
  const allSelected = projects.length > 0 && selected.size === projects.length;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45744D] opacity-50"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar devlog..."
            className="w-full text-sm pl-8 pr-3 py-2 border border-[#D4D4CC] bg-[#FAFAF7] text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
            style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
          />
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={onDeleteSelected}
              className="inline-flex items-center gap-1 text-xs px-3 py-2 bg-[#C93453] text-white border border-[#C93453] hover:opacity-90 transition-opacity"
              style={{ borderRadius: "2px", fontFamily: "var(--font-mono)" }}
            >
              <Trash2 size={12} />
              Eliminar ({selected.size})
            </button>
          )}
          <Link
            href="/admin/devlogs/nuevo"
            className="inline-flex items-center gap-1 text-xs px-3 py-2 bg-[#34C94E] text-white border border-[#34C94E] hover:bg-[#2ab342] transition-colors"
            style={{ borderRadius: "2px", fontFamily: "var(--font-mono)" }}
          >
            <Plus size={12} />
            Nuevo devlog
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 border-b border-[#D4D4CC]">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={`text-xs px-4 py-2 border-b-2 transition-colors -mb-px ${
              filter === tab.value
                ? "border-[#34C94E] text-[#34C94E]"
                : "border-transparent text-[#45744D] hover:text-[#3452C9]"
            }`}
            style={{ fontFamily: "var(--font-body)" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {projects.length === 0 ? (
        <p
          className="text-sm text-[#45744D] opacity-60 text-center py-12"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {search || filter
            ? "No se encontraron devlogs con esos filtros"
            : "Aún no hay devlogs. Crea el primero."}
        </p>
      ) : (
        <div className="overflow-x-auto border border-[#D4D4CC]" style={{ borderRadius: "3px" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EDEEE8] border-b border-[#D4D4CC]">
                <th className="w-10 px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleAll}
                    className="accent-[#34C94E]"
                  />
                </th>
                <th className="text-left px-3 py-3 text-xs text-[#45744D] font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                  Título
                </th>
                <th className="text-left px-3 py-3 text-xs text-[#45744D] font-medium hidden sm:table-cell" style={{ fontFamily: "var(--font-mono)" }}>
                  Estado
                </th>
                <th className="text-center px-3 py-3 text-xs text-[#45744D] font-medium hidden md:table-cell" style={{ fontFamily: "var(--font-mono)" }}>
                  Entradas
                </th>
                <th className="text-right px-3 py-3 text-xs text-[#45744D] font-medium hidden md:table-cell" style={{ fontFamily: "var(--font-mono)" }}>
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-[#D4D4CC] last:border-b-0 hover:bg-[#FAFAF7] transition-colors"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(project.id)}
                      onChange={() => onToggle(project.id)}
                      className="accent-[#34C94E]"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={13} className="text-[#45744D] opacity-50 shrink-0" />
                      <span
                        className="text-sm text-[#3452C9] font-medium"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {project.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span
                      className={`text-[10px] px-2 py-0.5 border ${statusColor[project.status]}`}
                      style={{ fontFamily: "var(--font-mono)", borderRadius: "2px" }}
                    >
                      {statusLabel[project.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center hidden md:table-cell">
                    <span
                      className="inline-flex items-center gap-1 text-xs text-[#45744D] opacity-60"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <Calendar size={10} />
                      {project.blog.length}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href={`/admin/devlogs/${project.slug}`}
                      className="text-xs text-[#34C94E] hover:underline"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
