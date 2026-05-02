"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useRef } from "react";

export function SearchBar({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    // Reset category when searching
    params.delete("category");

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          name="search"
          defaultValue={initialValue}
          placeholder="Buscar productos…"
          autoComplete="off"
          className="h-11 w-full rounded-md border border-ink/15 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-moss focus:ring-1 focus:ring-moss/20"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="h-11 shrink-0 rounded-md bg-moss px-4 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-50"
      >
        {isPending ? "…" : "Buscar"}
      </button>
      {initialValue && (
        <button
          type="button"
          onClick={handleClear}
          className="h-11 shrink-0 rounded-md border border-ink/10 px-3 text-sm font-medium text-ink/55 transition hover:border-ink/25 hover:text-ink"
        >
          Limpiar
        </button>
      )}
    </form>
  );
}
