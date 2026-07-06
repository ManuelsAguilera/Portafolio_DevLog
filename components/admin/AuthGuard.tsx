"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setStatus("unauthorized");
        return;
      }
      try {
        const result = await u.getIdTokenResult();
        if (result.claims.admin === true) {
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
        }
      } catch {
        setStatus("unauthorized");
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthorized" && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
    if (status === "authorized" && pathname === "/admin/login") {
      router.replace("/admin/devlogs");
    }
  }, [status, pathname, router]);

  if (status === "loading" || (status === "unauthorized" && pathname !== "/admin/login")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span
          className="text-xs text-[#45744D] animate-pulse"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {status === "loading" ? "verificando acceso..." : "redirigiendo al login..."}
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
