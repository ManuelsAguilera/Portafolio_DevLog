"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { toast } from "sonner";
import { DevlogTable } from "@/components/admin/DevlogTable";
import type { Project } from "@/lib/data";

const STATUS_MAP: Record<string, Project["status"]> = {
  past: "past",
  current: "current",
  future: "future",
};

function serializeProject(id: number, data: Record<string, unknown>): Project {
  return {
    id,
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

export default function AdminDevlogs() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const fetchProjects = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const list = snapshot.docs.map((d, i) =>
        serializeProject(i + 1, d.data() as Record<string, unknown>)
      );
      setProjects(list);
    } catch {
      toast.error("Error al cargar devlogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || p.status === STATUS_MAP[filter];
    return matchSearch && matchFilter;
  });

  const handleToggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  };

  const handleDeleteSelected = async () => {
    const count = selected.size;
    try {
      await Promise.all(
        projects
          .filter((p) => selected.has(p.id))
          .map((p) => deleteDoc(doc(db, "projects", p.slug)))
      );
      toast.success(`${count} devlog${count > 1 ? "s" : ""} eliminado${count > 1 ? "s" : ""}`);
      setSelected(new Set());
      fetchProjects();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span
          className="text-xs text-[#45744D] animate-pulse"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          cargando devlogs...
        </span>
      </div>
    );
  }

  return (
    <div>
      <p
        className="text-xs text-[#45744D] mb-1 tracking-wider"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // gestión de devlogs
      </p>
      <h1
        className="text-2xl font-bold text-[#3452C9] mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Devlogs
      </h1>

      <DevlogTable
        projects={filtered}
        selected={selected}
        onToggle={handleToggle}
        onToggleAll={handleToggleAll}
        onDeleteSelected={handleDeleteSelected}
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
}
