"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Mail, ArrowRight } from "lucide-react";
import { SiGithub, SiYoutube } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

const PushSubscription = dynamic(
  () => import("@/components/PushSubscription"),
  { ssr: false }
);

export default function Inicio() {
  return (
    <div className="flex flex-col gap-16 py-6">
      {/* Hero card */}
      <section>
        <div
          className="border border-[#D4D4CC] bg-[#F5F5F0] p-8 shadow-[2px_3px_0px_#45744D]"
          style={{ borderRadius: "3px" }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div
              className="w-20 h-20 shrink-0 bg-[#EDEEE8] border border-[#D4D4CC] flex items-center justify-center"
              style={{ borderRadius: "3px", boxShadow: "2px 2px 0 #45744D" }}
            >
              <span
                className="text-2xl font-bold text-[#45744D]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                MA
              </span>
            </div>
            <div className="flex-1">
              <p
                className="text-xs font-medium tracking-widest text-[#45744D] mb-1 uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Devlog · Desarrollador
              </p>
              <h1
                className="text-3xl font-bold text-[#3452C9] mb-3 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Manuel Aguilera
              </h1>
              <p
                className="text-[#3452C9] text-sm leading-relaxed mb-5 opacity-90"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Bienvenido soy Manuel Aguilera, esta pagina esta destinada a documentar mis proyectos.
                Tambien esta hecha para acompañar un canal de youtube donde documento mas a fondo proyectos personales.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/proyectos"
                  className="text-xs px-4 py-2 bg-[#34C94E] text-white font-medium border border-[#34C94E] transition-all hover:bg-[#2ab342] active:translate-y-px"
                  style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
                >
                  Ver el devlog
                </Link>
                <Link
                  href="/recomendaciones"
                  className="text-xs px-4 py-2 bg-transparent text-[#C9A334] font-medium border border-[#C9A334] transition-all hover:bg-[#C9A334] hover:text-white active:translate-y-px"
                  style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
                >
                  Escribirme
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube */}
      <section>
        <p
          className="text-xs text-[#45744D] mb-4 tracking-wider"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // video recomendado
        </p>
        <div
          className="border border-[#D4D4CC] bg-[#F5F5F0] overflow-hidden shadow-[2px_3px_0px_#45744D]"
          style={{ borderRadius: "3px" }}
        >
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/8aGhZQkoFbQ"
              title="The Art of Code — Dylan Beattie"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-5 border-t border-[#D4D4CC]">
            <h3
              className="text-base font-semibold text-[#3452C9] mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Art of Code — Dylan Beattie
            </h3>
            <p
              className="text-xs text-[#45744D] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Una charla que me cambió la perspectiva sobre la programación como
              forma de expresión artística. Recomendada para cualquier
              desarrollador que quiera recordar por qué ama escribir código.
            </p>
          </div>
        </div>
      </section>

      {/* Social bubbles */}
      <section>
        <p
          className="text-xs text-[#45744D] mb-4 tracking-wider"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // encuéntrame en
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: <SiGithub size={14} />, label: "GitHub", href: "https://github.com/ManuelsAguilera", color: "#3452C9" },
            { icon: <SiYoutube size={12} />, label: "YouTube", href: "https://youtube.com/@manudevlog", color: "#C93453" },
            { icon: <FaLinkedin size={12} />, label: "LinkedIn", href: "https://www.linkedin.com/in/manuel-aguilera-3ba40122a/", color: "#3452C9" },
            { icon: <Mail size={12} />, label: "Email", href: "mailto:manuelaguilera.devs@gmail.com", color: "#C9A334" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-4 py-2 border transition-all duration-150 hover:bg-[#34C94E] hover:border-[#34C94E] hover:text-white"
              style={{
                fontFamily: "var(--font-body)",
                borderRadius: "20px",
                borderColor: s.color,
                color: s.color,
              }}
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section>
        <p
          className="text-xs text-[#45744D] mb-4 tracking-wider"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // mantenerte al día
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <PushSubscription />
        </div>
      </section>

      <div className="flex justify-end pt-4 border-t border-[#D4D4CC]">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 text-xs text-[#45744D] hover:text-[#34C94E] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Ver proyectos <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
