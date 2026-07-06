"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/client";

export function AdminHeader() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setEmail(user?.email ?? null));
    return unsub;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Sesión cerrada");
      router.push("/admin/login");
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-between px-4 border-b-2 border-[#C9A334]"
      style={{ background: "#45744D", fontFamily: "var(--font-mono)" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-medium px-2 py-0.5 border border-[#C9A334] text-[#C9A334]"
          style={{ borderRadius: "2px" }}
        >
          MA
        </span>
        <span className="text-[#FAFAF7] text-xs opacity-80">
          Admin Panel
        </span>
      </div>

      <div className="flex items-center gap-3">
        {email && (
          <span className="text-[#FAFAF7] text-xs opacity-60 hidden sm:block">
            {email}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1 text-xs text-[#FAFAF7] hover:text-[#C9A334] transition-colors px-2 py-1"
          style={{ borderRadius: "2px" }}
        >
          <LogOut size={12} />
          Salir
        </button>
      </div>
    </header>
  );
}
