import { useState } from "react";
import { DashboardView, Profile } from "../types";
import { navigation } from "../data/mockData";
import { Brand } from "./Brand";
import { Icon } from "./Icon";

export function Sidebar({
  open,
  setOpen,
  active,
  setActive,
  profile,
  onLogout,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  active: DashboardView;
  setActive: (view: DashboardView) => void;
  profile: Profile;
  onLogout: () => void;
}) {
  const [supportOpen, setSupportOpen] = useState(false);

  const visibleNavigation = navigation
    .filter((item) => {
      if (profile === "Coordenador")
        return item.id !== "attendance" && item.id !== "materials" && item.id !== "system";
      if (profile === "Secretária") {
        return [
          "overview",
          "projects",
          "courses",
          "classes",
          "students",
          "attendance",
          "documents",
          "documentArchive",
          "lectures",
          "reports",
        ].includes(item.id);
      }
      if (profile === "Professor") {
        return ["overview", "classes", "attendance", "materials"].includes(item.id);
      }
      if (profile === "Aluno") {
        return ["overview", "courses", "attendance", "materials", "documents"].includes(item.id);
      }
      if (profile === "Administrador") {
        return ["overview", "students", "system", "auditLogs", "reports"].includes(item.id);
      }
      if (profile === "Facilitador")
        return ["overview", "lectures", "materials", "documents"].includes(item.id);
      return item.id === "overview";
    })
    .sort((a, b) => {
      if (profile !== "Secretária") return 0;
      const order: DashboardView[] = [
        "overview",
        "projects",
        "courses",
        "classes",
        "students",
        "lectures",
        "documents",
        "documentArchive",
        "reports",
        "attendance",
      ];
      return order.indexOf(a.id) - order.indexOf(b.id);
    });

  return (
    <>
      {open && (
        <button
          aria-label="Fechar menu"
          title="Fechar menu"
          className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto bg-ink px-5 py-7 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-2 [&_*]:text-white">
          <Brand />
        </div>
        <nav className="mt-12 flex-1 space-y-1">
          {visibleNavigation.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActive(item.id);
                setOpen(false);
              }}
              className={`sidebar-link ${active === item.id ? "sidebar-link-active" : ""}`}
            >
              <Icon name={item.icon} className="size-5" />
              <span>
                {item.id === "attendance" && (profile === "Aluno" || profile === "Professor")
                  ? profile === "Aluno"
                    ? "Frequências/Notas"
                    : "Notas"
                  : item.id === "attendance" && profile === "Secretária"
                    ? "Lembretes"
                    : item.id === "students" && (profile === "Coordenador" || profile === "Secretária")
                      ? "Usuários e acessos"
                      : item.id === "students" && profile === "Administrador"
                        ? "Gestão de Usuários"
                        : item.id === "materials" && profile === "Facilitador"
                          ? "Envio de materiais"
                          : item.id === "documents" && profile === "Facilitador"
                            ? "Certificados e Declarações"
                            : item.id === "lectures" && profile === "Facilitador"
                              ? "Minhas Palestras"
                              : item.id === "reports" && profile === "Administrador"
                                ? "Relatórios Gerenciais"
                                : item.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-brand-teal/20 text-brand-teal">
            <Icon name="help" className="size-5" />
          </div>
          <div className="text-sm font-bold">Central de ajuda</div>
          <p className="mt-1 text-xs leading-5 text-white/55">
            Dúvidas sobre a plataforma? Estamos aqui para ajudar.
          </p>
          <button onClick={() => setSupportOpen(true)} className="mt-3 text-xs font-bold text-brand-orange">
            Acessar suporte
          </button>
        </div>
        <button
          onClick={onLogout}
          className="mt-3 flex h-11 w-full items-center gap-3 rounded-xl px-4 text-xs font-bold text-white/55 transition hover:bg-brand-orange/15 hover:text-brand-orange"
        >
          <Icon name="arrow" className="size-4 rotate-180" />
          Sair do sistema
        </button>
      </aside>
      {supportOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSupportOpen(false);
            }}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <span className="card-icon bg-teal-soft text-brand-teal">
                <Icon name="help" />
              </span>
              <button
                type="button"
                onClick={() => setSupportOpen(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <h2 className="mt-5 text-2xl font-extrabold">Como podemos ajudar?</h2>
            <p className="mt-2 text-sm text-muted">Envie sua dúvida para a equipe de suporte da ESPFOR.</p>
            <div className="mt-6 space-y-4">
              <select className="standalone-input">
                <option>Acesso à plataforma</option>
                <option>Cursos e inscrições</option>
                <option>Documentos e certificados</option>
                <option>Outro assunto</option>
              </select>
              <textarea required className="form-textarea" placeholder="Descreva sua dúvida ou problema" />
              <button className="primary-button">
                Enviar solicitação <Icon name="arrow" className="size-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
