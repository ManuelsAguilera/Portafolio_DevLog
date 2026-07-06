"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { collection, addDoc } from "firebase/firestore";

export default function PushSubscription() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof Notification === "undefined") {
      setSupported(false);
      return;
    }
    if (Notification.permission === "granted") {
      setSubscribed(true);
    }
  }, []);

  const handleSubscribe = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        toast.error("Configuración pendiente", {
          description: "Las notificaciones push aún no están configuradas.",
        });
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Permiso denegado", {
          description: "Bloqueaste las notificaciones. Cámbialo en la configuración del navegador.",
        });
        return;
      }

      const { getMessaging, getToken } = await import("firebase/messaging");
      const messaging = getMessaging();
      const token = await getToken(messaging, { vapidKey });

      await addDoc(collection(db, "pushSubscriptions"), {
        token,
        createdAt: new Date().toISOString(),
      });

      setSubscribed(true);
      toast.success("¡Notificaciones activadas!", {
        description: "Te avisaré cuando publique contenido nuevo.",
      });
    } catch {
      toast.error("Error al activar notificaciones", {
        description: "Intenta de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!supported) return null;

  return (
    <div
      className="border border-[#D4D4CC] bg-[#F5F5F0] p-5 shadow-[2px_3px_0px_#45744D]"
      style={{ borderRadius: "3px" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 w-8 h-8 shrink-0 bg-[#EDEEE8] border border-[#D4D4CC] flex items-center justify-center"
          style={{ borderRadius: "3px" }}
        >
          {subscribed ? (
            <Bell size={14} className="text-[#34C94E]" />
          ) : (
            <BellOff size={14} className="text-[#45744D]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold text-[#3452C9] mb-1"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {subscribed ? "Notificaciones activadas" : "Notificaciones push"}
          </p>
          <p
            className="text-xs text-[#45744D] mb-3 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {subscribed
              ? "Recibirás un aviso cuando publique un nuevo proyecto o entrada."
              : "Actívalas para enterarte de contenido nuevo sin revisar el sitio."}
          </p>
          {!subscribed && (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="text-xs px-4 py-1.5 bg-[#34C94E] text-white font-medium border border-[#34C94E] hover:bg-[#2ab342] active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-body)", borderRadius: "3px" }}
            >
              {loading ? "Activando..." : "Activar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
