export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-brand">
        <div className="absolute -right-1 -top-1 size-4 rounded-full border-2 border-white bg-brand-teal" />
        <span className="text-lg font-extrabold tracking-tight">EF</span>
      </div>
      {!compact && (
        <div>
          <div className="text-sm font-extrabold leading-tight tracking-tight text-ink">
            ESPFOR
          </div>
          <div className="mt-0.5 text-[0.65rem] font-bold uppercase leading-tight tracking-[0.08em] text-muted">
            Escola de Saúde Pública
            <br />
            de Fortaleza
          </div>
        </div>
      )}
    </div>
  );
}
