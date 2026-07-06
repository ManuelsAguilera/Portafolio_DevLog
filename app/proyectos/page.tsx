"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { statusLabel, statusColor, sketchyShadow, sketchyShadowHover } from "@/lib/data";
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className={`block border border-[#D4D4CC] bg-[#F5F5F0] overflow-hidden ${sketchyShadow} ${sketchyShadowHover} transition-all duration-200`}
      style={{ borderRadius: "3px" }}
    >
      <div className="w-full h-40 bg-[#EDEEE8] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4
            className="text-sm font-semibold text-[#3452C9] leading-snug"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h4>
          <span
            className={`text-[10px] px-2 py-0.5 border shrink-0 ${statusColor[project.status]}`}
            style={{ fontFamily: "var(--font-mono)", borderRadius: "2px" }}
          >
            {statusLabel[project.status]}
          </span>
        </div>
        <p
          className="text-xs text-[#3452C9] opacity-75 leading-relaxed mb-3 line-clamp-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1 text-xs text-[#45744D] opacity-60"
            style={{ fontFamily: "var(--font-mono)" }}
          >
          </span>
          <span
            className="inline-flex items-center gap-1 text-xs text-[#34C94E] font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Leer devlog →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "projects")).then((snapshot) => {
      setProjects(snapshot.docs.map((d) => serializeProject(d.data() as Record<string, unknown>)));
      setLoading(false);
    });
  }, []);

  const tabs = [
    { value: "past", label: "Pasados" },
    { value: "current", label: "Actuales" },
    { value: "future", label: "Futuros" },
  ] as const;

  return (
    <div className="py-6">
      <p
        className="text-xs text-[#45744D] mb-2 tracking-wider"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // proyectos
      </p>
      <h1
        className="text-2xl font-bold text-[#3452C9] mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Devlog de proyectos
      </h1>
      <p
        className="text-sm text-[#3452C9] opacity-70 mb-8"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Cada tarjeta abre el diario de ese proyecto — lo que funcionó, lo que
        no, y por qué.
      </p>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <span
            className="text-xs text-[#45744D] animate-pulse"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            cargando proyectos...
          </span>
        </div>
      ) : (
        <Tabs.Root defaultValue="current">
          <Tabs.List className="flex gap-1 mb-6 border-b border-[#D4D4CC] pb-0">
            {tabs.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className="text-xs px-4 py-2 border-b-2 border-transparent text-[#45744D] transition-colors data-[state=active]:border-[#34C94E] data-[state=active]:text-[#34C94E] hover:text-[#3452C9] -mb-px"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Content key={tab.value} value={tab.value}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {projects
                  .filter((p) => p.status === tab.value)
                  .map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      )}

      <div className="flex justify-between pt-10 mt-4 border-t border-[#D4D4CC]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#45744D] hover:text-[#34C94E] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← Inicio
        </Link>
        <Link
          href="/recomendaciones"
          className="inline-flex items-center gap-2 text-xs text-[#45744D] hover:text-[#34C94E] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Recomendaciones <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
