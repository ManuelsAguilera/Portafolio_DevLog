"use client";

import { useState } from "react";
import { Save, Eye, Edit3 } from "lucide-react";
import { BlogEntryManager } from "./BlogEntryManager";
import { DevlogPreview } from "./DevlogPreview";
import type { Project, BlogEntry } from "@/lib/data";

type Props = {
  initial?: Project;
  onSave: (project: Project) => Promise<void>;
  saving: boolean;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function DevlogForm({ initial, onSave, saving }: Props) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [link, setLink] = useState(initial?.link ?? "#");
  const [status, setStatus] = useState(initial?.status ?? "future");
  const [tech, setTech] = useState((initial?.tech ?? []).join(", "));
  const [blog, setBlog] = useState<BlogEntry[]>(initial?.blog ?? []);
  const [slugEdited, setSlugEdited] = useState(!!initial);

  const isNew = !initial;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) {
      setSlug(slugify(val));
    }
  };

  const draft: Project = {
    id: initial?.id ?? 0,
    slug,
    title,
    description,
    image,
    link,
    status,
    tech: tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    likes: initial?.likes ?? 0,
    blog,
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    const finalSlug = slug || slugify(title);
    await onSave({
      ...draft,
      slug: finalSlug,
      id: initial?.id ?? Date.now(),
    });
  };

  return (
    <div>
      {/* Tab toggle */}
      <div className="flex gap-1 mb-6 border-b border-[#D4D4CC]">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={`inline-flex items-center gap-1 text-xs px-4 py-2 border-b-2 transition-colors -mb-px ${
            tab === "edit"
              ? "border-[#34C94E] text-[#34C94E]"
              : "border-transparent text-[#45744D] hover:text-[#3452C9]"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Edit3 size={12} />
          Editar
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`inline-flex items-center gap-1 text-xs px-4 py-2 border-b-2 transition-colors -mb-px ${
            tab === "preview"
              ? "border-[#34C94E] text-[#34C94E]"
              : "border-transparent text-[#45744D] hover:text-[#3452C9]"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Eye size={12} />
          Vista previa
        </button>
      </div>

      {tab === "edit" ? (
        <div className="flex flex-col gap-5">
          {/* Title + Slug */}
          <div>
            <label className="block text-xs text-[#45744D] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="Título del devlog"
              className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
              style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
            />
          </div>

          {isNew ? (
            <div>
              <label className="block text-xs text-[#45744D] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                placeholder="slug-del-devlog"
                className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-white text-[#45744D] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors font-mono text-xs"
                style={{ fontFamily: "var(--font-mono)", borderRadius: "3px" }}
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs text-[#45744D] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                Slug
              </label>
              <input
                type="text"
                value={slug}
                disabled
                className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-[#EDEEE8] text-[#45744D] cursor-not-allowed font-mono text-xs"
                style={{ fontFamily: "var(--font-mono)", borderRadius: "3px" }}
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs text-[#45744D] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Descripción del proyecto"
              className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] placeholder:text-[#D4D4CC] resize-none focus:outline-none focus:border-[#34C94E] transition-colors"
              style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs text-[#45744D] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              URL de imagen
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
              style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-xs text-[#45744D] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              Link del proyecto
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="#"
              className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
              style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-[#45744D] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project["status"])}
              className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] focus:outline-none focus:border-[#34C94E] transition-colors"
              style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
            >
              <option value="past">Finalizado</option>
              <option value="current">En curso</option>
              <option value="future">Próximo</option>
            </select>
          </div>

          {/* Tech */}
          <div>
            <label className="block text-xs text-[#45744D] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              Tecnologías (separadas por coma)
            </label>
            <input
              type="text"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="React, Node.js, PostgreSQL"
              className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
              style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
            />
          </div>

          {/* Blog entries */}
          <BlogEntryManager entries={blog} onChange={setBlog} />

          {/* Save */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="inline-flex items-center gap-2 text-xs px-5 py-2 bg-[#34C94E] text-white font-medium border border-[#34C94E] hover:bg-[#2ab342] active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
            >
              <Save size={13} />
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      ) : (
        <DevlogPreview project={draft} />
      )}
    </div>
  );
}
