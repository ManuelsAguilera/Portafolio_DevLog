"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { toast } from "sonner";
import { DevlogForm } from "@/components/admin/DevlogForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/data";

export default function NewDevlog() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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
      toast.success("Devlog creado");
      router.push(`/admin/devlogs/${p.slug}`);
    } catch {
      toast.error("Error al crear devlog");
    } finally {
      setSaving(false);
    }
  };

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
        Nuevo devlog
      </h1>

      <DevlogForm onSave={handleSave} saving={saving} />
    </div>
  );
}
