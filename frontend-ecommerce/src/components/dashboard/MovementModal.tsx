"use client";

import { useState } from "react";
import type { MovementType, CreateMovementInput } from "@/types/inventory";

type MovementConfig = {
  value: MovementType;
  label: string;
  direction: 1 | -1 | 0; // 0 = ADJUSTMENT (usuario elige)
};

const MOVEMENT_TYPES: MovementConfig[] = [
  { value: "RESTOCK",    label: "Entrada de mercadería", direction:  1 },
  { value: "ADJUSTMENT", label: "Ajuste de inventario",  direction:  0 },
  { value: "SALE",       label: "Venta manual",          direction: -1 },
  { value: "DAMAGE",     label: "Daño / pérdida",        direction: -1 },
];

type Props = {
  productId: string;
  productName: string;
  storeId: string;
  currentStock: number;
  onClose: () => void;
  onSuccess: (newStock: number) => void;
};

export function MovementModal({
  productId,
  productName,
  storeId,
  currentStock,
  onClose,
  onSuccess,
}: Props) {
  const [type, setType] = useState<MovementType>("RESTOCK");
  const [quantity, setQuantity] = useState("");
  const [adjustDir, setAdjustDir] = useState<"add" | "subtract">("add");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedConfig = MOVEMENT_TYPES.find((t) => t.value === type)!;
  const parsedQty = parseInt(quantity, 10);
  const validQty = !isNaN(parsedQty) && parsedQty > 0;

  function getSignedQuantity(): number {
    if (!validQty) return 0;
    if (selectedConfig.direction === 1) return parsedQty;
    if (selectedConfig.direction === -1) return -parsedQty;
    return adjustDir === "add" ? parsedQty : -parsedQty;
  }

  const signedQty = getSignedQuantity();
  const stockAfter = currentStock + signedQty;
  const willGoNegative = validQty && stockAfter < 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validQty || willGoNegative) return;

    setSubmitting(true);
    setError(null);

    try {
      const input: CreateMovementInput = {
        productId,
        storeId,
        type,
        quantity: signedQty,
        ...(note.trim() ? { note: note.trim() } : {}),
      };

      const response = await fetch("/api/dashboard/inventory/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "No se pudo registrar el movimiento");
      }

      onSuccess(payload?.stockAfter ?? stockAfter);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-ink/10 bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-xl sm:max-w-md sm:rounded-lg sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-clay">
              Inventario
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-ink">
              Registrar movimiento
            </h2>
            <p className="mt-0.5 truncate text-sm text-ink/50">{productName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-ink/10 text-ink/50 transition hover:text-ink"
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stock actual */}
        <div className="mt-4 rounded-md bg-linen px-4 py-3">
          <p className="text-xs text-ink/50">Unidades disponibles actualmente</p>
          <p className="font-mono text-2xl font-semibold text-ink">
            {currentStock}{" "}
            <span className="text-sm font-normal text-ink/40">uds.</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          {/* Tipo de movimiento */}
          <div className="grid gap-2">
            <p className="text-sm font-semibold text-ink">Tipo de movimiento</p>
            <div className="grid grid-cols-2 gap-2">
              {MOVEMENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`min-h-12 rounded-md border px-3 py-2.5 text-left text-sm transition ${
                    type === t.value
                      ? "border-moss bg-moss/5 font-semibold text-moss"
                      : "border-ink/10 text-ink/60 hover:border-ink/20 hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dirección (solo para ADJUSTMENT) */}
          {type === "ADJUSTMENT" && (
            <div className="grid gap-2">
              <p className="text-sm font-semibold text-ink">Dirección</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustDir("add")}
                  className={`min-h-11 rounded-md border px-3 py-2 text-sm transition ${
                    adjustDir === "add"
                      ? "border-moss bg-moss/5 font-semibold text-moss"
                      : "border-ink/10 text-ink/60 hover:border-ink/20"
                  }`}
                >
                  + Agregar unidades
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustDir("subtract")}
                  className={`min-h-11 rounded-md border px-3 py-2 text-sm transition ${
                    adjustDir === "subtract"
                      ? "border-red-300 bg-red-50 font-semibold text-red-600"
                      : "border-ink/10 text-ink/60 hover:border-ink/20"
                  }`}
                >
                  − Quitar unidades
                </button>
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div className="grid gap-1.5">
            <label htmlFor="movement-qty" className="text-sm font-semibold text-ink">
              Cantidad
            </label>
            <input
              id="movement-qty"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-11 rounded-md border border-ink/15 px-3 font-mono text-base"
              required
            />
          </div>

          {/* Nota */}
          <div className="grid gap-1.5">
            <label htmlFor="movement-note" className="text-sm font-semibold text-ink">
              Nota{" "}
              <span className="font-normal text-ink/40">(opcional)</span>
            </label>
            <textarea
              id="movement-note"
              placeholder="Ej: Llegó pedido de proveedor, conteo físico…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[68px] rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
          </div>

          {/* Vista previa */}
          {validQty && (
            <div
              className={`rounded-md px-4 py-3 text-sm ${
                willGoNegative
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {willGoNegative ? (
                <p className="font-medium">
                  El stock quedaría en {stockAfter} — revisá la cantidad.
                </p>
              ) : (
                <p>
                  Stock pasará de{" "}
                  <span className="font-mono font-semibold">{currentStock}</span>
                  {" → "}
                  <span className="font-mono font-semibold">{stockAfter}</span>{" "}
                  unidades
                </p>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm font-medium text-red-600">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-12 flex-1 items-center justify-center rounded-md border border-ink/15 text-sm font-medium text-ink/60 transition hover:text-ink"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !validQty || willGoNegative}
              className="flex min-h-12 flex-1 items-center justify-center rounded-md bg-moss text-sm font-semibold text-white transition hover:bg-ink disabled:bg-ink/30"
            >
              {submitting ? "Registrando…" : "Registrar movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
