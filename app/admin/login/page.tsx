"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Sesión iniciada");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      toast.error("Error", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] px-4">
      <div
        className="w-full max-w-sm border border-[#D4D4CC] bg-[#F5F5F0] p-6 shadow-[2px_3px_0px_#45744D]"
        style={{ borderRadius: "3px" }}
      >
        <div className="text-center mb-6">
          <span
            className="inline-block text-xs font-medium px-2 py-0.5 border border-[#C9A334] text-[#C9A334] mb-2"
            style={{ borderRadius: "2px" }}
          >
            MA
          </span>
          <h1
            className="text-lg font-bold text-[#3452C9]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Admin Panel
          </h1>
          <p
            className="text-xs text-[#45744D] mt-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Inicia sesión para gestionar el devlog
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-[#FAFAF7] text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
            style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña"
            className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-[#FAFAF7] text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
            style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 text-xs px-5 py-2 bg-[#34C94E] text-white font-medium border border-[#34C94E] hover:bg-[#2ab342] active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
          >
            <LogIn size={13} />
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
