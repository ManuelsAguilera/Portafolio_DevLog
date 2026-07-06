"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { sketchyShadow } from "@/lib/data";

export default function Recomendaciones() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { getFirestore, collection, addDoc } = await import(
        "firebase/firestore"
      );
      const { initializeApp, getApps } = await import("firebase/app");
      const app =
        getApps().length === 0
          ? initializeApp({
              apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
              storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
              messagingSenderId:
                process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
              appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
              measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
            })
          : getApps()[0];
      const db = getFirestore(app);

      await addDoc(collection(db, "suggestions"), {
        name: name.trim() || "Anónimo",
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        read: false,
      });
      toast.success("¡Gracias por tu mensaje!", {
        description: "Lo leo con mucho cariño.",
      });
      setMessage("");
      setName("");
      setEmail("");
    } catch {
      toast.error("Error al enviar", {
        description: "Intenta de nuevo más tarde.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <p
        className="text-xs text-[#45744D] mb-2 tracking-wider"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // dejar recomendación
      </p>
      <h1
        className="text-2xl font-bold text-[#3452C9] mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Escríbeme
      </h1>

      <div
        className={`border border-[#D4D4CC] bg-[#F5F5F0] p-6 ${sketchyShadow}`}
        style={{ borderRadius: "3px" }}
      >
        <p
          className="text-xs text-[#45744D] mb-5 leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          ¿Tienes alguna recomendación, comentario sobre una entrada del devlog,
          o simplemente quieres saludar? El contacto es opcional, pero lo
          agradezco si quieres recibir respuesta.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            placeholder="Escribe tu mensaje aquí..."
            className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-[#FAFAF7] text-[#3452C9] placeholder:text-[#D4D4CC] resize-none focus:outline-none focus:border-[#34C94E] transition-colors"
            style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-[#FAFAF7] text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
            style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (opcional)"
            className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-[#FAFAF7] text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
            style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
          />
          <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 text-xs px-5 py-2 bg-[#34C94E] text-white font-medium border border-[#34C94E] hover:bg-[#2ab342] active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
              >
                <Send size={13} />
                {submitting ? "Enviando..." : "Enviar"}
              </button>
          </div>
        </form>
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
