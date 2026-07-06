"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { toast } from "sonner";
import { DevlogForm } from "@/components/admin/DevlogForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Project, BlogEntry } from "@/lib/data";

export default function EditDevlog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, "projects", slug));
        if (!snap.exists()) {
          toast.error("Devlog no encontrado");
          router.replace("/admin/devlogs");
          return;
        }
        const data = snap.data() as Record<string, unknown>;
        setProject({
          id: (data.id as number) ?? 0,
          slug: data.slug as string ?? slug,
          title: data.title as string,
          description: data.description as string,
          image: data.image as string,
          link: data.link as string,
          status: (data.status as Project["status"]) ?? "future",
          tech: (data.tech as string[]) ?? [],
          likes: (data.likes as number) ?? 0,
          blog: (data.blog as BlogEntry[]) ?? [],
        });
      } catch {
        toast.error("Error al cargar devlog");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, router]);

  const handleSave = async (p: Project) => {
    setSaving(true);
    try {
      await setDoc(doc(db, "projects", p.slug), {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        image: p.image,
        link: p.link,
        status: p.status,
        tech: p.tech,
        likes: p.likes,
        blog: p.blog,
      });
      toast.success("Devlog guardado");
      if (p.slug !== slug) {
        router.replace(`/admin/devlogs/${p.slug}`);
      }
    } catch {
      toast.error("Error al guardar devlog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span
          className="text-xs text-[#45744D] animate-pulse"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          cargando devlog...
        </span>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div>
      <Link
        href="/admin/devlogs"
        className="inline-flex items-center gap-2 text-xs text-[#45744D] hover:text-[#34C94E] transition-colors mb-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <ArrowLeft size={13} /> Volver a devlogs
      </Link>

      <h1
        className="text-2xl font-bold text-[#3452C9] mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {project.title}
      </h1>

      <DevlogForm initial={project} onSave={handleSave} saving={saving} />
    </div>
  );
}
