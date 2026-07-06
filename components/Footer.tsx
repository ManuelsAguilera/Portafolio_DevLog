import { Mail } from "lucide-react";
import { SiGithub, SiYoutube } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#D4D4CC]" style={{ background: "#45744D" }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <p
              className="text-[#34C94E] text-xs font-medium mb-1 tracking-widest uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Devlog
            </p>
            <p
              className="text-[#FAFAF7] text-base font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Manuel Aguilera
            </p>
            <p
              className="text-[#FAFAF7] text-xs opacity-70 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Mostrando las cosas que hago :v
            </p>
          </div>
          <div>
            <p
              className="text-[#34C94E] text-xs font-medium mb-1 tracking-widest uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Sobre este sitio
            </p>
            <p
              className="text-[#FAFAF7] text-xs opacity-70 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Un devlog donde documento mis proyectos, decisiones técnicas y lo
              que voy aprendiendo en el camino.
            </p>
          </div>
          <div>
            <p
              className="text-[#34C94E] text-xs font-medium mb-3 tracking-widest uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Redes
            </p>
            <div className="flex flex-col gap-2">
              {[
                { icon: <SiGithub size={14} />, label: "GitHub", href: "https://github.com/ManuelsAguilera" },
                { icon: <SiYoutube size={12} />, label: "YouTube", href: "https://youtube.com/@manudevlog" },
                { icon: <FaLinkedin size={12} />, label: "LinkedIn", href: "https://linkedin.com" },
                { icon: <Mail size={12} />, label: "Email", href: "mailto:hola@manuel-aguilera.dev" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#FAFAF7] opacity-70 hover:opacity-100 hover:text-[#34C94E] transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {s.icon}
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#3a6341] pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p
            className="text-[#FAFAF7] text-xs opacity-50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            © 2026 Manuel Aguilera · Código bajo licencia MIT
          </p>
          <a
            href="#top"
            className="text-xs text-[#34C94E] hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ↑ volver arriba
          </a>
        </div>
      </div>
    </footer>
  );
}
