import { Brand } from "../../components/Brand"
import { Icon } from "../../components/Icon"
import { IconName } from "../../types"

export function SupportPage({ onBack }: { onBack: () => void }) {
  const contacts = [
    {
      label: "E-mail",
      value: "espfor@sms.fortaleza.ce.gov.br",
      description: "Atendimento para acesso, cursos e documentação",
      icon: "mail" as IconName,
      action: () => {
        window.location.href = "mailto:espfor@sms.fortaleza.ce.gov.br"
      },
    },
    {
      label: "Telefone",
      value: "0800.285.0880",
      description: "Ligação gratuita em horário comercial",
      icon: "help" as IconName,
      action: () => {
        window.location.href = "tel:08002850880"
      },
    },
    {
      label: "Atendimento presencial",
      value: "Rua Barão do Rio Branco, 910 - Centro",
      description: "Fortaleza - CE · CEP: 60.025-060",
      icon: "building" as IconName,
      action: () =>
        window.open(
          "https://www.google.com/maps/search/?api=1&query=Rua+Barão+do+Rio+Branco+910+Fortaleza+CE",
          "_blank",
          "noopener,noreferrer",
        ),
    },
  ]

  return (
    <main className="min-h-screen bg-canvas">
      <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10">
        <Brand />
        <button onClick={onBack} className="secondary-button h-11 text-xs">
          <Icon name="arrow" className="mr-2 inline size-4 rotate-180" /> Voltar
          ao login
        </button>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-teal">
            Central de atendimento
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl">
            Fale com o suporte
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted">
            Escolha o canal mais conveniente. A equipe da ESPFOR pode ajudar com
            acesso à plataforma, inscrições, cursos, documentos e certificados.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {contacts.map((contact) => (
            <button
              key={contact.label}
              onClick={contact.action}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-card transition hover:-translate-y-1 hover:border-brand-teal/30 hover:shadow-lg"
            >
              <span className="card-icon bg-teal-soft text-brand-teal">
                <Icon name={contact.icon} />
              </span>
              <span className="mt-6 block text-xs font-extrabold uppercase tracking-wider text-muted">
                {contact.label}
              </span>
              <span className="mt-2 block wrap-break-word text-sm font-extrabold text-ink group-hover:text-brand-teal">
                {contact.value}
              </span>
              <span className="mt-2 block text-xs leading-5 text-muted">
                {contact.description}
              </span>
              <span className="mt-5 flex items-center gap-2 text-xs font-extrabold text-brand-orange">
                Acessar contato <Icon name="arrow" className="size-4" />
              </span>
            </button>
          ))}
        </div>
        <div className="mt-8 rounded-3xl bg-ink p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-extrabold">
                Antes de entrar em contato
              </h2>
              <p className="mt-2 text-xs leading-5 text-white/55">
                Tenha em mãos seu nome completo, CPF e o e-mail usado no
                cadastro. Nunca informe sua senha.
              </p>
            </div>
            <span className="badge badge-orange shrink-0">
              Atendimento ESPFOR
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
