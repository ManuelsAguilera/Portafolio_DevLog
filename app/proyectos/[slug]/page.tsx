"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag, ExternalLink, Heart } from "lucide-react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { statusLabel, statusColor, sketchyShadow } from "@/lib/data";
import type { Project } from "@/lib/data";

function serializeProject(data: Record<string, unknown>): Project {
  return {
    id: data.id as number,
    slug: data.slug as string,
    title: data.title as string,
    description: data.description as string,
    image: data.image as string,
    link: data.link as string,
    status: (data.status as Project["status"]) ?? "future",
    tech: (data.tech as string[]) ?? [],
    likes: (data.likes as number) ?? 0,
    blog: (data.blog as Project["blog"]) ?? [],
  };
}

export default function ProyectoDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, "projects", slug)).then((snap) => {
      if (snap.exists()) {
        setProject(serializeProject(snap.data() as Record<string, unknown>));
      }
      setLoading(false);
    });
  }, [slug]);

  const [expanded, setExpanded] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    setLiked(localStorage.getItem("liked_" + slug) === "true");
  }, [slug]);

  useEffect(() => {
    if (project) setLikesCount(project.likes);
  }, [project]);

  const handleLike = async () => {
    const wasLiked = liked;
    const delta = wasLiked ? -1 : 1;
    setLiked(!wasLiked);
    setLikesCount((c) => c + delta);
    if (wasLiked) {
      localStorage.removeItem("liked_" + slug);
    } else {
      localStorage.setItem("liked_" + slug, "true");
    }
    try {
      await updateDoc(doc(db, "projects", slug), { likes: increment(delta) });
    } catch {
      setLiked(wasLiked);
      setLikesCount((c) => c - delta);
      if (wasLiked) {
        localStorage.setItem("liked_" + slug, "true");
      } else {
        localStorage.removeItem("liked_" + slug);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] py-6">
        <span
          className="text-xs text-[#45744D] animate-pulse"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          cargando proyecto...
        </span>
      </div>
    );
  }

  if (!project) notFound();

  return (
    <div className="py-6">
      <Link
        href="/proyectos"
        className="inline-flex items-center gap-2 text-xs text-[#45744D] hover:text-[#34C94E] transition-colors mb-8"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <ArrowLeft size={13} /> Volver a proyectos
      </Link>

      {/* Project header */}
      <div
        className={`border border-[#D4D4CC] bg-[#F5F5F0] overflow-hidden mb-8 ${sketchyShadow}`}
        style={{ borderRadius: "3px" }}
      >
        <div className="w-full h-52 bg-[#EDEEE8] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2
              className="text-2xl font-bold text-[#3452C9] leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.title}
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
            {project.description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
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
            <span
              className="inline-flex items-center gap-1 text-xs text-[#45744D] opacity-60 ml-auto"
              style={{ fontFamily: "var(--font-mono)" }}
            >
            </span>
          </div>
          <div className="flex items-center gap-4 mt-4">
            {project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#34C94E] font-medium hover:underline"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Ver proyecto <ExternalLink size={11} />
              </a>
            )}
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border transition-all cursor-pointer ${
                liked
                  ? "border-[#C93453] text-[#C93453] bg-[#C93453]/5"
                  : "border-[#D4D4CC] text-[#45744D] hover:border-[#C93453] hover:text-[#C93453]"
              }`}
              style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
            >
              <Heart size={12} fill={liked ? "#C93453" : "none"} />
              {likesCount}
            </button>
          </div>
        </div>
      </div>

      {/* Blog entries */}
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
                      {new Date(entry.date).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h4
                    className="text-sm font-semibold text-[#3452C9] group-hover:text-[#34C94E] transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {entry.title}
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
                  <p
                    className="text-sm text-[#3452C9] leading-relaxed mt-4 opacity-90"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {entry.body}
                  </p>
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

      <div className="flex justify-start pt-10 mt-4 border-t border-[#D4D4CC]">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 text-xs text-[#45744D] hover:text-[#34C94E] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← Proyectos
        </Link>
      </div>
    </div>
  );
}
