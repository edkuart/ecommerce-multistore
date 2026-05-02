"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { Category } from "@/types/category";
import type { Product, ProductStockStatus } from "@/types/product";
import type { Store } from "@/types/store";
import { formatCurrency, resolveImageUrl } from "@/lib/api";
import { MovementModal } from "@/components/dashboard/MovementModal";

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0)
    return (
      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
        Agotado
      </span>
    );
  if (stock <= 5)
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
        {stock} uds.
      </span>
    );
  return (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      {stock} uds.
    </span>
  );
}

type MovementTarget = {
  id: string;
  name: string;
  storeId: string;
  stock: number;
};

type ProductForm = {
  storeId: string;
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  stockStatus: ProductStockStatus;
  categoryId: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
};

const emptyForm: ProductForm = {
  storeId: "",
  name: "",
  sku: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  stockStatus: "in_stock",
  categoryId: "",
  category: "",
  isActive: true,
  isFeatured: false,
};

function createEmptyForm(storeId = ""): ProductForm {
  return { ...emptyForm, storeId };
}

type ProductManagerProps = {
  initialProducts: Product[];
  categories: Category[];
  stores: Store[];
  selectedStoreId?: string;
};

function toForm(product: Product): ProductForm {
  return {
    name: product.name,
    storeId: product.storeId ?? "",
    sku: product.sku ?? "",
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
    stock: String(product.stock),
    stockStatus: product.stockStatus ?? "in_stock",
    categoryId: product.categoryId ?? "",
    category: product.category ?? product.categoryDetails?.name ?? "",
    isActive: product.isActive ?? true,
    isFeatured: product.isFeatured ?? false,
  };
}

export function ProductManager({
  initialProducts,
  categories,
  stores,
  selectedStoreId,
}: ProductManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(
    createEmptyForm(selectedStoreId),
  );
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [movementTarget, setMovementTarget] = useState<MovementTarget | null>(null);

  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingId) ?? null,
    [editingId, products],
  );

  useEffect(() => {
    setProducts(initialProducts);
    setEditingId(null);
    setForm(createEmptyForm(selectedStoreId));
    setImages([]);
    setError(null);
    setSuccess(null);
  }, [initialProducts, selectedStoreId]);

  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  function updateForm<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(createEmptyForm(selectedStoreId));
    setImages([]);
    setError(null);
    setSuccess(null);
  }

  function startEditing(product: Product) {
    setEditingId(product.id);
    setForm(toForm(product));
    setImages([]);
    setError(null);
    setSuccess(null);
  }

  function appendFormData(): FormData {
    const formData = new FormData();
    const category = categories.find((item) => item.id === form.categoryId);

    formData.append("name", form.name);
    formData.append("storeId", form.storeId);
    formData.append("sku", form.sku);
    formData.append("shortDescription", form.shortDescription);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("compareAtPrice", form.compareAtPrice);
    formData.append("stock", form.stock);
    formData.append("stockStatus", form.stockStatus);
    formData.append("categoryId", form.categoryId);
    formData.append("category", form.category || category?.name || "");
    formData.append("isActive", String(form.isActive));
    formData.append("isFeatured", String(form.isFeatured));
    images.forEach((image) => formData.append("images", image));

    return formData;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        editingId
          ? `/api/dashboard/products/${encodeURIComponent(editingId)}`
          : "/api/dashboard/products",
        {
          method: editingId ? "PUT" : "POST",
          body: appendFormData(),
        },
      );

      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      if (!response.ok) {
        throw new Error(payload?.message || "Could not save product");
      }

      const product = payload as Product;

      setProducts((current) =>
        editingId
          ? current.map((item) => (item.id === product.id ? product : item))
          : [product, ...current],
      );
      setSuccess(
        editingId
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente.",
      );
      setEditingId(null);
      setForm(createEmptyForm(selectedStoreId));
      setImages([]);
    } catch (caughtError) {
      setError(
        (caughtError as Error).message === "UNAUTHORIZED"
          ? "Inicia sesión en el dashboard antes de guardar productos."
          : `No se pudo guardar el producto: ${(caughtError as Error).message}`,
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(productId: string, current: boolean) {
    setError(null);
    try {
      const body = new FormData();
      body.append("isActive", String(!current));
      const response = await fetch(
        `/api/dashboard/products/${encodeURIComponent(productId)}`,
        { method: "PUT", body },
      );
      if (response.status === 401) throw new Error("UNAUTHORIZED");
      if (!response.ok) throw new Error("Could not update product");
      const updated = (await response.json()) as Product;
      setProducts((current) =>
        current.map((p) => (p.id === updated.id ? updated : p)),
      );
    } catch (caughtError) {
      setError(
        (caughtError as Error).message === "UNAUTHORIZED"
          ? "Inicia sesión en el dashboard."
          : "No se pudo actualizar el producto.",
      );
    }
  }

  async function deleteProduct(productId: string) {
    setDeletingId(productId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/dashboard/products/${encodeURIComponent(productId)}`,
        { method: "DELETE" },
      );

      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      if (!response.ok && response.status !== 204) {
        throw new Error("Could not delete product");
      }

      setProducts((current) => current.filter((product) => product.id !== productId));
      if (editingId === productId) resetForm();
      setSuccess("Producto eliminado correctamente.");
    } catch (caughtError) {
      setError(
        (caughtError as Error).message === "UNAUTHORIZED"
          ? "Inicia sesión en el dashboard antes de eliminar productos."
          : "No se pudo eliminar el producto.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleMovementSuccess(productId: string, newStock: number) {
    setProducts((current) =>
      current.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: newStock,
              trackInventory: true,
              stockStatus: newStock > 0 ? "in_stock" : "out_of_stock",
            }
          : p,
      ),
    );
    setMovementTarget(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold text-ink">Productos</h1>
            <p className="mt-1 text-sm text-ink/55">
              Administra catálogo, precios, inventario y visibilidad.
            </p>
          </div>
          <a
            href="#product-form"
            className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-moss px-3 text-sm font-semibold text-white transition hover:bg-ink xl:hidden"
          >
            Nuevo
          </a>
        </div>

        <div className="grid gap-3 p-3 md:hidden">
          {products.map((product) => {
            const categoryName =
              product.categoryDetails?.name ?? product.category ?? "Sin categoría";

            return (
              <article
                key={product.id}
                className="rounded-md border border-ink/10 bg-paper p-3 shadow-sm"
              >
                <div className="flex gap-3">
                  <img
                    src={resolveImageUrl(product.images?.[0])}
                    alt=""
                    className="h-24 w-20 shrink-0 rounded-md bg-linen object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-sm font-semibold text-ink">
                          {product.name}
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-moss">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                          product.isActive ?? true
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-ink/5 text-ink/50"
                        }`}
                      >
                        {product.isActive ?? true ? "Activo" : "Oculto"}
                      </span>
                    </div>
                    {product.store && (
                      <p className="mt-1 truncate text-xs font-medium text-clay">
                        {product.store.name}
                      </p>
                    )}
                    <p className="truncate text-xs text-ink/45">{categoryName}</p>
                    {product.sku && (
                      <p className="truncate font-mono text-[11px] text-ink/35">
                        SKU {product.sku}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StockBadge stock={product.stock} />
                  {product.isFeatured && (
                    <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-semibold text-clay">
                      Destacado
                    </span>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setMovementTarget({
                        id: product.id,
                        name: product.name,
                        storeId: product.storeId ?? selectedStoreId ?? "",
                        stock: product.stock,
                      })
                    }
                    className="flex min-h-11 items-center justify-center rounded-md border border-moss/20 text-sm font-semibold text-moss transition hover:border-moss hover:bg-moss/5"
                  >
                    Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleActive(product.id, product.isActive ?? true)}
                    className={`flex min-h-11 items-center justify-center rounded-md border text-sm font-semibold transition ${
                      product.isActive ?? true
                        ? "border-ink/10 text-ink/55 hover:border-red-200 hover:text-red-600"
                        : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {product.isActive ?? true ? "Ocultar" : "Activar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEditing(product)}
                    className="flex min-h-11 items-center justify-center gap-1 rounded-md border border-ink/10 text-sm font-semibold text-ink/65 transition hover:border-moss/40 hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === product.id}
                    onClick={() => void deleteProduct(product.id)}
                    className="flex min-h-11 items-center justify-center gap-1 rounded-md border border-red-200 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Borrar
                  </button>
                </div>
              </article>
            );
          })}
          {!products.length && (
            <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linen">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" aria-hidden>
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-ink/70">
                  {selectedStoreId
                    ? "Esta tienda no tiene productos aún."
                    : "No hay productos registrados."}
                </p>
                <p className="mt-1 text-sm text-ink/45">
                  Usá el formulario para agregar el primer producto.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-linen/70 text-xs uppercase tracking-[0.14em] text-ink/50">
              <tr>
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">Precio</th>
                <th className="px-5 py-3">Inventario</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {products.map((product) => {
                const categoryName =
                  product.categoryDetails?.name ?? product.category ?? "Sin categoría";

                return (
                  <tr key={product.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(product.images?.[0])}
                          alt=""
                          className="h-12 w-10 rounded-md bg-linen object-cover"
                        />
                        <div>
                          <p className="font-medium text-ink">{product.name}</p>
                          {product.store && (
                            <p className="text-xs font-medium text-clay">
                              {product.store.name}
                            </p>
                          )}
                          <p className="text-xs text-ink/45">{categoryName}</p>
                          {product.sku && (
                            <p className="text-xs text-ink/35">SKU {product.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink/70">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <StockBadge stock={product.stock} />
                        <button
                          type="button"
                          onClick={() =>
                            setMovementTarget({
                              id: product.id,
                              name: product.name,
                              storeId: product.storeId ?? selectedStoreId ?? "",
                              stock: product.stock,
                            })
                          }
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-ink/10 text-ink/40 transition hover:border-moss/40 hover:text-moss"
                          aria-label={`Registrar movimiento para ${product.name}`}
                          title="Registrar movimiento"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.isActive ?? true
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-ink/5 text-ink/50"
                          }`}
                        >
                          {product.isActive ?? true ? "Activo" : "Oculto"}
                        </span>
                        {product.isFeatured && (
                          <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-semibold text-clay">
                            Destacado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => void toggleActive(product.id, product.isActive ?? true)}
                          className={`inline-flex h-11 items-center justify-center rounded-md border px-3 text-xs font-semibold transition ${
                            product.isActive ?? true
                              ? "border-ink/10 text-ink/50 hover:border-red-200 hover:text-red-600"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                          aria-label={`${product.isActive ?? true ? "Ocultar" : "Activar"} ${product.name}`}
                        >
                          {product.isActive ?? true ? "Ocultar" : "Activar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditing(product)}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/10 text-ink/65 transition hover:border-moss/40 hover:text-ink"
                          aria-label={`Editar ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === product.id}
                          onClick={() => void deleteProduct(product.id)}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                          aria-label={`Eliminar ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!products.length && (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linen">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" aria-hidden>
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-ink/70">
                          {selectedStoreId
                            ? "Esta tienda no tiene productos aún."
                            : "No hay productos registrados."}
                        </p>
                        <p className="mt-1 text-sm text-ink/45">
                          Usá el formulario para agregar el primer producto.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="rounded-md border border-ink/10 bg-white p-5 shadow-sm xl:sticky xl:top-6 xl:self-start"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {editingProduct ? "Editar producto" : "Agregar producto"}
            </h2>
            {editingProduct && (
              <p className="mt-1 text-sm text-ink/55">{editingProduct.name}</p>
            )}
          </div>
          {editingProduct ? (
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

        <div className="mt-4 grid gap-5">
          <fieldset className="grid gap-3">
            <legend className="mb-2 text-sm font-semibold text-ink">
              Información
            </legend>
            <input
              required
              placeholder="Nombre del producto"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              className="h-11 rounded-md border border-ink/15 px-3"
            />
            <select
              value={form.storeId}
              onChange={(event) => updateForm("storeId", event.target.value)}
              className="h-11 rounded-md border border-ink/15 px-3"
            >
              <option value="">Tienda general</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            <input
              placeholder="SKU"
              value={form.sku}
              onChange={(event) => updateForm("sku", event.target.value)}
              className="h-11 rounded-md border border-ink/15 px-3"
            />
            <textarea
              placeholder="Descripción corta"
              value={form.shortDescription}
              onChange={(event) =>
                updateForm("shortDescription", event.target.value)
              }
              className="min-h-20 rounded-md border border-ink/15 px-3 py-2"
            />
            <textarea
              placeholder="Descripción completa"
              value={form.description}
              onChange={(event) => updateForm("description", event.target.value)}
              className="min-h-24 rounded-md border border-ink/15 px-3 py-2"
            />
            <select
              value={form.categoryId}
              onChange={(event) => {
                const category = categories.find(
                  (item) => item.id === event.target.value,
                );
                updateForm("categoryId", event.target.value);
                updateForm("category", category?.name ?? "");
              }}
              className="h-11 rounded-md border border-ink/15 px-3"
            >
              <option value="">Sin categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="mb-2 text-sm font-semibold text-ink">
              Imágenes
            </legend>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              multiple
              onChange={(event) =>
                setImages(Array.from(event.target.files ?? []).slice(0, 5))
              }
              className="block w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((preview) => (
                  <img
                    key={preview}
                    src={preview}
                    alt=""
                    className="aspect-[4/5] rounded-md bg-linen object-cover"
                  />
                ))}
              </div>
            )}
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="mb-2 text-sm font-semibold text-ink">
              Precio e inventario
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="Precio"
                value={form.price}
                onChange={(event) => updateForm("price", event.target.value)}
                className="h-11 rounded-md border border-ink/15 px-3"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Precio anterior"
                value={form.compareAtPrice}
                onChange={(event) =>
                  updateForm("compareAtPrice", event.target.value)
                }
                className="h-11 rounded-md border border-ink/15 px-3"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                type="number"
                min="0"
                placeholder="Cantidad"
                value={form.stock}
                onChange={(event) => updateForm("stock", event.target.value)}
                className="h-11 rounded-md border border-ink/15 px-3"
              />
              <select
                value={form.stockStatus}
                onChange={(event) =>
                  updateForm("stockStatus", event.target.value as ProductStockStatus)
                }
                className="h-11 rounded-md border border-ink/15 px-3"
              >
                <option value="in_stock">Disponible</option>
                <option value="out_of_stock">Agotado</option>
                <option value="preorder">Preorden</option>
              </select>
            </div>
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="mb-2 text-sm font-semibold text-ink">
              Visibilidad
            </legend>
            <label className="flex items-center justify-between gap-4 rounded-md border border-ink/10 px-3 py-2 text-sm font-medium text-ink">
              Producto activo
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => updateForm("isActive", event.target.checked)}
                className="h-4 w-4 accent-moss"
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-md border border-ink/10 px-3 py-2 text-sm font-medium text-ink">
              Destacado en catálogo
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) =>
                  updateForm("isFeatured", event.target.checked)
                }
                className="h-4 w-4 accent-moss"
              />
            </label>
          </fieldset>
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
            : editingProduct
              ? "Guardar cambios"
              : "Agregar producto"}
        </button>
      </form>

      {movementTarget && (
        <MovementModal
          productId={movementTarget.id}
          productName={movementTarget.name}
          storeId={movementTarget.storeId}
          currentStock={movementTarget.stock}
          onClose={() => setMovementTarget(null)}
          onSuccess={(newStock) =>
            handleMovementSuccess(movementTarget.id, newStock)
          }
        />
      )}
    </div>
  );
}
