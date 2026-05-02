"use client";

import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/chrome|chromium|crios|fxios/i.test(ua);
  return isIos && isSafari;
}

export function PwaRegister() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // PWA support should never block the storefront.
      });
    });
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || isStandaloneMode()) {
      return;
    }

    const alreadyDismissed = localStorage.getItem("pwa-install-dismissed") === "true";
    if (alreadyDismissed) {
      setDismissed(true);
      return;
    }

    if (isIosSafari()) {
      setShowIosGuide(true);
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
    }
  }

  function dismiss() {
    localStorage.setItem("pwa-install-dismissed", "true");
    setDismissed(true);
    setInstallPrompt(null);
    setShowIosGuide(false);
  }

  if (dismissed) return null;

  // iOS Safari — show "Add to Home Screen" instructions
  if (showIosGuide) {
    return (
      <div className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-md rounded-md border border-ink/10 bg-white p-4 shadow-soft lg:bottom-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-moss text-white">
            <Share className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Instalar catálogo</p>
            <p className="mt-1 text-xs leading-5 text-ink/55">
              Tocá el botón{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-ink">
                Compartir <Share className="inline h-3 w-3" aria-hidden />
              </span>{" "}
              en Safari y luego{" "}
              <span className="font-semibold text-ink">
                «Agregar a pantalla de inicio»
              </span>{" "}
              para instalarla como app.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-ink/10 text-ink/45"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  // Android / Chrome — native install prompt
  if (!installPrompt) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-md rounded-md border border-ink/10 bg-white p-3 shadow-soft lg:bottom-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-moss text-white">
          <Download className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Instalar catálogo</p>
          <p className="truncate text-xs text-ink/50">
            Acceso rápido desde la pantalla principal.
          </p>
        </div>
        <button
          type="button"
          onClick={installApp}
          className="min-h-11 rounded-md bg-moss px-3 text-sm font-semibold text-white"
        >
          Instalar
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-ink/10 text-ink/45"
          aria-label="Cerrar instalación"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
