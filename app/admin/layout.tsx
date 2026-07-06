"use client";

import { AuthGuard } from "@/components/admin/AuthGuard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <AdminHeader />
      <div className="flex pt-10 min-h-screen bg-[#FAFAF7]">
        <AdminSidebar />
        <main className="flex-1 ml-48 px-8 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
