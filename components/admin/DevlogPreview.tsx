"use client";

import { useState } from "react";
import DOMPurify from "dompurify";
import { Calendar, Tag } from "lucide-react";
import { statusLabel, statusColor } from "@/lib/data";
import type { Project } from "@/lib/data";

type Props = {
  project: Project;
};

export function DevlogPreview({ project }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (!project.title && !project.description) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] border border-dashed border-[#D4D4CC] bg-[#F5F5F0]" style={{ borderRadius: "3px" }}>
        <p
          className="text-xs text-[#45744D] opacity-50"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Completa los campos para ver una vista previa
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Header card */}
      <div
        className="border border-[#D4D4CC] bg-[#F5F5F0] overflow-hidden mb-6"
        style={{ borderRadius: "3px" }}
      >
        <div className="w-full h-52 bg-[#EDEEE8] overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-[#D4D4CC]" style={{ fontFamily: "var(--font-mono)" }}>
                Sin imagen
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2
              className="text-2xl font-bold text-[#3452C9] leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.title || "Sin título"}
            </h2>
            <span
              className={`text-[10px] px-2 py-1 border shrink-0 ${statusColor[project.status]}`}
              style={{ fontFamily: "var(--font-mono)", borderRadius: "2px" }}
            >
              {statusLabel[project.status]}
            </span>
          </div>
          <p
            className="text-sm text-[#3452C9] opacity-80 leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {project.description || "Sin descripción"}
          </p>
          {project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 border border-[#D4D4CC] text-[#45744D]"
                  style={{ fontFamily: "var(--font-mono)", borderRadius: "2px" }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Blog entries */}
      {project.blog.length > 0 && (
        <>
          <p
            className="text-xs text-[#45744D] mb-4 tracking-wider"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // entradas del devlog
          </p>
          <div className="flex flex-col gap-4">
            {project.blog.map((entry, i) => {
              const isOpen = expanded === i;
              return (
                <div
                  key={i}
                  className={`border border-[#D4D4CC] bg-[#F5F5F0] transition-all duration-200 ${
                    isOpen
                      ? "shadow-[2px_3px_0px_#45744D]"
                      : "hover:shadow-[1px_2px_0px_#45744D]"
                  }`}
                  style={{ borderRadius: "3px" }}
                >
                  <button
                    className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 group"
                    onClick={() => setExpanded(isOpen ? null : i)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] text-[#45744D] opacity-60"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          <Calendar size={10} />
                          {entry.date
                            ? new Date(entry.date).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Sin fecha"}
                        </span>
                      </div>
                      <h4
                        className="text-sm font-semibold text-[#3452C9] group-hover:text-[#34C94E] transition-colors leading-snug"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {entry.title || "Sin título"}
                      </h4>
                    </div>
                    <span
                      className="text-[#45744D] opacity-50 text-xs mt-1 shrink-0 transition-transform duration-200"
                      style={{
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ▶
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-[#D4D4CC]">
                      <div
                        className="text-sm text-[#3452C9] leading-relaxed mt-4 opacity-90"
                        style={{ fontFamily: "var(--font-body)" }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(entry.body || ""),
                        }}
                      />
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-[11px] text-[#C9A334] border border-[#C9A334] px-2 py-0.5"
                              style={{ fontFamily: "var(--font-mono)", borderRadius: "2px" }}
                            >
                              <Tag size={9} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
