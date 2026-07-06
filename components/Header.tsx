"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useNotificationModal } from "@/components/NotificationModalContext";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Proyectos", to: "/proyectos" },
  { label: "Recomendaciones", to: "/recomendaciones" },
];

export function Header() {
  const pathname = usePathname();
  const { open } = useNotificationModal();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-between px-4 border-b-2 border-[#34C94E]"
      style={{ background: "#45744D", fontFamily: "var(--font-mono)" }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span
          className="text-xs font-medium px-2 py-0.5 border border-[#34C94E] text-[#34C94E]"
          style={{ borderRadius: "2px" }}
        >
          MA
        </span>
        <span className="text-[#FAFAF7] text-xs hidden sm:block opacity-80">
          manuel-aguilera.dev
        </span>
      </Link>

      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`text-xs px-3 py-1 transition-colors ${
                isActive
                  ? "bg-[#34C94E] text-white"
                  : "text-[#FAFAF7] hover:bg-[#3a6341]"
              }`}
              style={{ borderRadius: "2px" }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={open}
        className="text-[#FAFAF7] hover:text-[#34C94E] transition-colors p-1"
        aria-label="Notificaciones"
      >
        <Bell size={16} />
      </button>
    </header>
  );
}
