"use client";

import { useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import type { Category } from "@/types/category";

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  sortOrder: "0",
  isActive: true,
};

function toForm(category: Category): CategoryForm {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    sortOrder: String(category.sortOrder ?? 0),
    isActive: category.isActive,
  };
}

export function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const editingCategory =
    categories.find((category) => category.id === editingId) ?? null;

  function updateForm<K extends keyof CategoryForm>(
    key: K,
    value: CategoryForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setSuccess(null);
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setForm(toForm(category));
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
          ? `/api/dashboard/categories/${encodeURIComponent(editingId)}`
          : "/api/dashboard/categories",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            slug: form.slug || null,
            description: form.description || null,
            sortOrder: Number(form.sortOrder) || 0,
            isActive: form.isActive,
          }),
        },
      );

      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      if (!response.ok) throw new Error("Could not save category");

      const category = (await response.json()) as Category;
      setCategories((current) =>
        editingId
          ? current.map((item) => (item.id === category.id ? category : item))
          : [...current, category].sort((a, b) => a.sortOrder - b.sortOrder),
      );
      setSuccess(
        editingId
          ? "Categoría actualizada correctamente."
          : "Categoría creada correctamente.",
      );
      setEditingId(null);
      setForm(emptyForm);
    } catch (caughtError) {
      setError(
        (caughtError as Error).message === "UNAUTHORIZED"
          ? "Inicia sesión en el dashboard antes de guardar categorías."
          : "No se pudo guardar la categoría. Revisa los datos e intenta de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold text-ink">Categorías</h1>
            <p className="mt-1 text-sm text-ink/55">
              Organiza el catálogo y controla qué categorías se muestran.
            </p>
          </div>
          <a
            href="#category-form"
            className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-moss px-3 text-sm font-semibold text-white transition hover:bg-ink xl:hidden"
          >
            Nueva
          </a>
        </div>

        <div className="grid gap-3 p-3 md:hidden">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-md border border-ink/10 bg-paper p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-ink">
                    {category.name}
                  </h2>
                  <p className="truncate text-xs text-ink/45">
                    /{category.slug}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    category.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-ink/5 text-ink/50"
                  }`}
                >
                  {category.isActive ? "Activa" : "Oculta"}
                </span>
              </div>
              {category.description && (
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/55">
                  {category.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="rounded-md bg-white px-3 py-2 font-mono text-xs text-ink/50">
                  Orden {category.sortOrder}
                </span>
                <button
                  type="button"
                  onClick={() => startEditing(category)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-ink/10 px-3 text-sm font-semibold text-ink/65 transition hover:border-moss/40 hover:text-ink"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                  Editar
                </button>
              </div>
            </article>
          ))}
          {!categories.length && (
            <p className="px-5 py-10 text-center text-ink/50">
              Aún no hay categorías registradas.
            </p>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-linen/70 text-xs uppercase tracking-[0.14em] text-ink/50">
              <tr>
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3">Orden</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{category.name}</p>
                    <p className="text-xs text-ink/45">/{category.slug}</p>
                    {category.description && (
                      <p className="mt-1 max-w-xl text-xs text-ink/50">
                        {category.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-ink/70">{category.sortOrder}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        category.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-ink/5 text-ink/50"
                      }`}
                    >
                      {category.isActive ? "Activa" : "Oculta"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => startEditing(category)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/10 text-ink/65 transition hover:border-moss/40 hover:text-ink"
                        aria-label={`Editar ${category.name}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!categories.length && (
                <tr>
                  <td className="px-5 py-10 text-center text-ink/50" colSpan={4}>
                    Aún no hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form
        id="category-form"
        onSubmit={handleSubmit}
        className="rounded-md border border-ink/10 bg-white p-5 shadow-sm xl:sticky xl:top-24 xl:self-start"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {editingCategory ? "Editar categoría" : "Agregar categoría"}
            </h2>
            {editingCategory && (
              <p className="mt-1 text-sm text-ink/55">{editingCategory.name}</p>
            )}
          </div>
          {editingCategory ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/10 text-ink/55 transition hover:text-ink"
              aria-label="Cancelar edición"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3">
          <input
            required
            placeholder="Nombre"
            value={form.name}
            onChange={(event) => updateForm("name", event.target.value)}
            className="h-11 rounded-md border border-ink/15 px-3"
          />
          <input
            placeholder="Slug opcional"
            value={form.slug}
            onChange={(event) => updateForm("slug", event.target.value)}
            className="h-11 rounded-md border border-ink/15 px-3"
          />
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(event) => updateForm("description", event.target.value)}
            className="min-h-24 rounded-md border border-ink/15 px-3 py-2"
          />
          <input
            type="number"
            placeholder="Orden"
            value={form.sortOrder}
            onChange={(event) => updateForm("sortOrder", event.target.value)}
            className="h-11 rounded-md border border-ink/15 px-3"
          />
          <label className="flex items-center justify-between gap-4 rounded-md border border-ink/10 px-3 py-2 text-sm font-medium text-ink">
            Categoría activa
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => updateForm("isActive", event.target.checked)}
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
          <Plus className="h-4 w-4" aria-hidden />
          {saving
            ? "Guardando..."
            : editingCategory
              ? "Guardar cambios"
              : "Agregar categoría"}
        </button>
      </form>
    </div>
  );
}
