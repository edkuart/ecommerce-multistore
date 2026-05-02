"use client";

import { useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import type { Store, StoreType } from "@/types/store";

const storeTypeLabels: Record<StoreType, string> = {
  girls_clothing: "Ropa niñas",
  general_clothing: "Ropa general",
  wholesale: "Mayoreo",
  shoes: "Calzado",
  other: "Otra",
};

type StoreForm = {
  name: string;
  type: StoreType;
  description: string;
  whatsappPhone: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyForm: StoreForm = {
  name: "",
  type: "other",
  description: "",
  whatsappPhone: "",
  sortOrder: "0",
  isActive: true,
};

function toForm(store: Store): StoreForm {
  return {
    name: store.name,
    type: store.type,
    description: store.description ?? "",
    whatsappPhone: store.whatsappPhone ?? "",
    sortOrder: String(store.sortOrder ?? 0),
    isActive: store.isActive,
  };
}

export function StoreManager({ initialStores }: { initialStores: Store[] }) {
  const [stores, setStores] = useState(initialStores);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StoreForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setSuccess(null);
  }

  function startEditing(store: Store) {
    setEditingId(store.id);
    setForm(toForm(store));
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        editingId
          ? `/api/dashboard/stores/${encodeURIComponent(editingId)}`
          : "/api/dashboard/stores",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            description: form.description || null,
            whatsappPhone: form.whatsappPhone || null,
            sortOrder: Number(form.sortOrder) || 0,
            isActive: form.isActive,
          }),
        },
      );

      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        throw new Error("Inicia sesión antes de guardar tiendas.");
      }

      if (!response.ok) {
        throw new Error(payload?.message || "No se pudo guardar la tienda.");
      }

      const store = payload as Store;
      setStores((current) =>
        (editingId
          ? current.map((item) => (item.id === store.id ? store : item))
          : [...current, store]
        ).sort((a, b) => a.sortOrder - b.sortOrder),
      );
      setEditingId(null);
      setForm(emptyForm);
      setSuccess(
        editingId
          ? "Tienda actualizada correctamente."
          : "Tienda creada correctamente.",
      );
    } catch (caughtError) {
      setError((caughtError as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold text-ink">Tiendas internas</h1>
            <p className="mt-1 text-sm text-ink/55">
              Mini-tiendas que administran productos dentro del catálogo unificado.
            </p>
          </div>
          <a
            href="#store-form"
            className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-moss px-3 text-sm font-semibold text-white transition hover:bg-ink xl:hidden"
          >
            Nueva
          </a>
        </div>

        <div className="grid gap-3 p-3 md:hidden">
          {stores.map((store) => (
            <article
              key={store.id}
              className="rounded-md border border-ink/10 bg-paper p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-ink">
                    {store.name}
                  </h2>
                  <p className="truncate text-xs text-ink/45">/{store.slug}</p>
                </div>
                <span
                  className={
                    store.isActive
                      ? "shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                      : "shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-ink/55"
                  }
                >
                  {store.isActive ? "Activa" : "Oculta"}
                </span>
              </div>

              {store.description && (
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/55">
                  {store.description}
                </p>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-white px-3 py-2">
                  <p className="text-ink/40">Tipo</p>
                  <p className="mt-0.5 font-semibold text-ink">
                    {storeTypeLabels[store.type]}
                  </p>
                </div>
                <div className="rounded-md bg-white px-3 py-2">
                  <p className="text-ink/40">WhatsApp</p>
                  <p className="mt-0.5 truncate font-semibold text-ink">
                    {store.whatsappPhone || "General"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startEditing(store)}
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-ink/10 text-sm font-semibold text-ink/65 transition hover:border-moss hover:text-moss"
              >
                <Pencil className="h-4 w-4" aria-hidden />
                Editar tienda
              </button>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-linen/70 text-xs uppercase tracking-[0.14em] text-ink/50">
              <tr>
                <th className="px-5 py-3">Tienda</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">WhatsApp</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{store.name}</p>
                    <p className="text-xs text-ink/45">/{store.slug}</p>
                    {store.description && (
                      <p className="mt-1 max-w-md text-xs text-ink/50">
                        {store.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-ink/70">
                    {storeTypeLabels[store.type]}
                  </td>
                  <td className="px-5 py-4 text-ink/70">
                    {store.whatsappPhone || "General"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        store.isActive
                          ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                          : "rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-ink/55"
                      }
                    >
                      {store.isActive ? "Activa" : "Oculta"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => startEditing(store)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/10 text-ink/65 transition hover:border-moss hover:text-moss"
                      title="Editar tienda"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form
        id="store-form"
        onSubmit={handleSubmit}
        className="rounded-md border border-ink/10 bg-white p-5 shadow-sm xl:sticky xl:top-24 xl:self-start"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">
            {editingId ? "Editar tienda" : "Agregar tienda"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/10 text-ink/60 transition hover:border-moss hover:text-moss"
              title="Cancelar edición"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
        <div className="mt-4 grid gap-3">
          <input
            required
            placeholder="Nombre de la tienda"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="h-11 rounded-md border border-ink/15 px-3"
          />
          <select
            value={form.type}
            onChange={(event) =>
              setForm({ ...form, type: event.target.value as StoreType })
            }
            className="h-11 rounded-md border border-ink/15 px-3"
          >
            {Object.entries(storeTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            inputMode="tel"
            placeholder="WhatsApp opcional"
            value={form.whatsappPhone}
            onChange={(event) =>
              setForm({ ...form, whatsappPhone: event.target.value })
            }
            className="h-11 rounded-md border border-ink/15 px-3"
          />
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            className="min-h-24 rounded-md border border-ink/15 px-3 py-2"
          />
          <input
            type="number"
            placeholder="Orden"
            value={form.sortOrder}
            onChange={(event) =>
              setForm({ ...form, sortOrder: event.target.value })
            }
            className="h-11 rounded-md border border-ink/15 px-3"
          />
          <label className="flex items-center justify-between rounded-md border border-ink/10 px-3 py-2 text-sm font-medium text-ink">
            Tienda visible
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
              className="h-4 w-4 accent-moss"
            />
          </label>
        </div>

        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        {success && (
          <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-moss px-4 text-sm font-semibold text-white transition hover:bg-ink disabled:bg-ink/30"
        >
          {editingId ? (
            <Pencil className="h-4 w-4" aria-hidden />
          ) : (
            <Plus className="h-4 w-4" aria-hidden />
          )}
          {saving
            ? "Guardando..."
            : editingId
              ? "Guardar cambios"
              : "Agregar tienda"}
        </button>
      </form>
    </div>
  );
}
