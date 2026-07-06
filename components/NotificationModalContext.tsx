"use client";

import { createContext, useContext, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "sonner";

type ContextValue = { open: () => void };
const Ctx = createContext<ContextValue>({ open: () => {} });

export function useNotificationModal() {
  return useContext(Ctx);
}

export function NotificationModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"choose" | "email">("choose");
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setIsOpen(false);
    setMode("choose");
    setEmail("");
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("¡Suscrito correctamente!", { description: `Te notificaremos a ${email}` });
    } else {
      toast.success("Preferencias guardadas.");
    }
    handleClose();
  };

  const handleWebNotif = async () => {
    if (!("Notification" in window)) {
      toast.error("Tu navegador no soporta notificaciones web.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("¡Notificaciones activadas!");
      handleClose();
    } else {
      toast.error("Permiso denegado. Puedes cambiarlo en la configuración del navegador.");
    }
  };

  return (
    <Ctx.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <Dialog.Root open={isOpen} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Content
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm border border-[#D4D4CC] bg-[#FAFAF7] p-6"
            style={{ borderRadius: "3px", boxShadow: "4px 5px 0px #45744D" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <Dialog.Title
                  className="text-base font-semibold text-[#3452C9]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Suscríbete al devlog
                </Dialog.Title>
                <Dialog.Description
                  className="text-xs text-[#45744D] mt-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Entérate cuando publique una entrada nueva.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="text-[#45744D] hover:text-[#3452C9] transition-colors mt-0.5">
                  <X size={15} />
                </button>
              </Dialog.Close>
            </div>

            {mode === "choose" && (
              <div className="flex flex-col gap-3">
                {/* Opcional: Oculto por ahora
                <button
                  onClick={() => setMode("email")}
                  className="w-full text-sm px-4 py-3 border border-[#D4D4CC] text-left text-[#3452C9] hover:border-[#34C94E] hover:bg-[#F5F5F0] transition-all"
                  style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
                >
                  <span className="block font-medium mb-0.5">Por email</span>
                  <span className="text-xs text-[#45744D]">Recibe un correo con cada entrada nueva</span>
                </button>
                */}
                <button
                  onClick={handleWebNotif}
                  className="w-full text-sm px-4 py-3 border border-[#D4D4CC] text-left text-[#3452C9] hover:border-[#34C94E] hover:bg-[#F5F5F0] transition-all"
                  style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
                >
                  <span className="block font-medium mb-0.5">Notificaciones web</span>
                  <span className="text-xs text-[#45744D]">Notificaciones del navegador, sin email</span>
                </button>
              </div>
            )}

            {mode === "email" && (
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setMode("choose")}
                  className="text-xs text-[#45744D] hover:text-[#3452C9] text-left transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ← volver
                </button>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com (opcional)"
                  className="w-full text-sm px-3 py-2 border border-[#D4D4CC] bg-white text-[#3452C9] placeholder:text-[#D4D4CC] focus:outline-none focus:border-[#34C94E] transition-colors"
                  style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
                />
                <button
                  type="submit"
                  className="text-sm px-4 py-2 bg-[#34C94E] text-white font-medium hover:bg-[#2ab342] transition-colors"
                  style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
                >
                  Suscribirse
                </button>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Ctx.Provider>
  );
}
