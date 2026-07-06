import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PublicLayout } from "@/components/PublicLayout";
import { NotificationModalProvider } from "@/components/NotificationModalContext";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manuel Aguilera",
  description: "Revisa mis proyectos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "var(--font-body)" }}>
        <NotificationModalProvider>
          <Toaster position="bottom-right" />
          <PublicLayout>
            {children}
          </PublicLayout>
        </NotificationModalProvider>
      </body>
    </html>
  );
}
