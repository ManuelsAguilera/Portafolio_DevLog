"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { collection, addDoc } from "firebase/firestore";

export default function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "emailSubscribers"), {
        email: email.trim(),
        subscribedAt: new Date().toISOString(),
        confirmed: false,
      });
      setDone(true);
      toast.success("¡Gracias por suscribirte!", {
        description: "Recibirás un correo de confirmación pronto.",
      });
    } catch {
      toast.error("Error al suscribir", {
        description: "Intenta de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="border border-[#D4D4CC] bg-[#F5F5F0] p-5 shadow-[2px_3px_0px_#45744D]"
      style={{ borderRadius: "3px" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 w-8 h-8 shrink-0 bg-[#EDEEE8] border border-[#D4D4CC] flex items-center justify-center"
          style={{ borderRadius: "3px" }}
        >
          {done ? (
            <Check size={14} className="text-[#34C94E]" />
          ) : (
            <Mail size={14} className="text-[#45744D]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold text-[#3452C9] mb-1"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Newsletter por email
          </p>
          <p
            className="text-xs text-[#45744D] mb-3 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Recibe un resumen cuando publique contenido nuevo.
          </p>
          {!done ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="flex-1 text-xs px-2.5 py-1.5 border border-[#D4D4CC] bg-[#FAFAF7] text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors min-w-0"
                style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
              />
              <button
                type="submit"
                disabled={loading}
                className="text-xs px-3 py-1.5 bg-[#34C94E] text-white font-medium border border-[#34C94E] hover:bg-[#2ab342] active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
              >
                {loading ? "..." : "Suscribir"}
              </button>
            </form>
          ) : (
            <p
              className="text-xs text-[#34C94E]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ✓ Suscrito
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
