"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, MessageSquare } from "lucide-react";

const links = [
  { label: "Devlogs", to: "/admin/devlogs", icon: FileText },
  { label: "Sugerencias", to: "/admin/suggestions", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-10 bottom-0 w-48 border-r border-[#D4D4CC] bg-[#F5F5F0] py-4 px-3 flex flex-col gap-1"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <p className="text-[10px] text-[#45744D] uppercase tracking-wider mb-2 px-2 opacity-50">
        Navegación
      </p>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.to === "/admin/devlogs"
            ? pathname.startsWith("/admin/devlogs")
            : pathname.startsWith(link.to);
        return (
          <Link
            key={link.to}
            href={link.to}
            className={`flex items-center gap-2 text-xs px-3 py-2 transition-colors ${
              isActive
                ? "bg-[#34C94E] text-white"
                : "text-[#45744D] hover:bg-[#EDEEE8]"
            }`}
            style={{ borderRadius: "2px" }}
          >
            <Icon size={13} />
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
}
