const points = [
  {
    label: "01 · WhatsApp 1-a-1",
    text: "Te responde una persona del negocio. Resolvemos tallas, colores y tiempos en el mismo chat.",
  },
  {
    label: "02 · Stock confirmado",
    text: "Antes de cobrar revisamos disponibilidad real para no quedarte mal.",
  },
  {
    label: "03 · Mensaje prellenado",
    text: "Cada producto abre WhatsApp con el detalle completo. Tú solo confirmas.",
  },
];

export function TrustStrip() {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Decorative circle */}
      <div
        className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full"
        style={{ background: "rgba(251,250,247,0.04)" }}
        aria-hidden
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-14 md:px-8 md:py-20 lg:grid-cols-[1.6fr_1fr] lg:gap-16 lg:px-12">
        {/* Left — big claim */}
        <div>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-widest-label text-clay-soft">
            — Cómo funciona
          </p>
          <h2 className="font-serif text-[clamp(32px,4.5vw,56px)] font-normal leading-[1.05] tracking-[-0.015em] text-paper">
            Aquí cada pedido se cierra{" "}
            <em className="italic text-clay-soft">conversando</em>,
            no llenando formularios.
          </h2>
        </div>

        {/* Right — numbered points */}
        <div className="grid gap-5">
          {points.map((point) => (
            <div
              key={point.label}
              className="border-t border-paper/[0.16] pt-4"
            >
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/55">
                {point.label}
              </p>
              <p className="text-[15px] leading-[1.5] text-paper">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
