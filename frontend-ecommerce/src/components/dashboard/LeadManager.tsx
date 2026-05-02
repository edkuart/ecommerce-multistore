"use client";

import { MessageCircle, Phone } from "lucide-react";
import type { Lead } from "@/types/lead";

const intentStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  created: { label: "Iniciado", className: "bg-sky-50 text-sky-700" },
  whatsapp_opened: { label: "WA abierto", className: "bg-emerald-50 text-emerald-700" },
  contacted: { label: "Contactado", className: "bg-violet-50 text-violet-700" },
  converted: { label: "Convertido", className: "bg-moss/10 text-moss" },
  lost: { label: "Perdido", className: "bg-stone-100 text-ink/50" },
};

function StatusBadge({ status }: { status?: string }) {
  const cfg = intentStatusConfig[status ?? "created"] ?? intentStatusConfig.created;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function formatDate(value?: string): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildLeadWhatsAppUrl(phone: string, productName?: string): string {
  const digits = phone.replace(/\D/g, "");
  const text = productName
    ? `Hola, te escribo por tu consulta sobre ${productName}.`
    : "Hola, te escribo por tu consulta.";

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function LeadManager({ leads }: { leads: Lead[] }) {
  return (
    <div className="rounded-md border border-ink/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">Leads de WhatsApp</h1>
          <p className="mt-1 text-sm text-ink/55">
            Contactos capturados antes de abrir el chat.
          </p>
        </div>
        <span className="rounded-full bg-moss/10 px-3 py-1 text-sm font-semibold text-moss">
          {leads.length}
        </span>
      </div>

      {!leads.length ? (
        <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linen">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" aria-hidden>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <div>
            <p className="font-medium text-ink/70">No hay leads aún.</p>
            <p className="mt-1 text-sm text-ink/45">
              Aparecerán aquí cuando clientes consulten por WhatsApp.
            </p>
          </div>
        </div>
      ) : (
        <>
        <div className="grid gap-3 p-3 md:hidden">
          {leads.map((lead) => {
            const intent = lead.purchaseIntents?.[0];
            const product = intent?.product;

            return (
              <article
                key={lead.id}
                className="rounded-md border border-ink/10 bg-paper p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-ink">
                      {lead.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-ink/50">{lead.phone}</p>
                    {lead.email && (
                      <p className="truncate text-xs text-ink/50">{lead.email}</p>
                    )}
                  </div>
                  <StatusBadge status={intent?.status} />
                </div>

                <div className="mt-3 rounded-md bg-white px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/35">
                    Producto
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-ink">
                    {product?.name ?? "Sin producto"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-ink/50">
                    <span>{lead.store?.name ?? "Sin tienda"}</span>
                    <span>·</span>
                    <span>{intent?.quantity ?? 1} uds.</span>
                    {intent?.variant && (
                      <>
                        <span>·</span>
                        <span>
                          {intent.variant.size} / {intent.variant.color}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {lead.message && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/60">
                    {lead.message}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-ink/45">{formatDate(lead.createdAt)}</p>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${lead.phone}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/10 text-ink/55"
                      aria-label={`Llamar a ${lead.name}`}
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                    </a>
                    <a
                      href={buildLeadWhatsAppUrl(lead.phone, product?.name)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 items-center gap-2 rounded-md bg-whats px-3 text-sm font-semibold text-white"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-linen/70 text-xs uppercase tracking-[0.14em] text-ink/50">
              <tr>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">Tienda</th>
                <th className="px-5 py-3">Cant.</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {leads.map((lead) => {
                const intent = lead.purchaseIntents?.[0];
                const product = intent?.product;

                return (
                  <tr key={lead.id} className="hover:bg-linen/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{lead.name}</p>
                      <p className="text-xs text-ink/50">{lead.phone}</p>
                      {lead.email && (
                        <p className="text-xs text-ink/50">{lead.email}</p>
                      )}
                      {lead.message && (
                        <p className="mt-1 max-w-xs text-xs text-ink/55">
                          {lead.message}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">
                        {product?.name ?? "—"}
                      </p>
                      {intent?.variant && (
                        <p className="text-xs text-ink/50">
                          {intent.variant.size} / {intent.variant.color}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">
                      {lead.store?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-ink/70">
                      {intent?.quantity ?? 1}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={intent?.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/55">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
