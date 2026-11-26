import { FormEvent, useState } from "react"
import { Brand } from "../../components/Brand"
import { Icon } from "../../components/Icon"
import { mockRegistrationRequests } from "../../data/mockData"
import { Profile, SessionUser } from "../../types"
import { nameFromIdentifier } from "../../utils/helpers"

export function Login({
  onLogin,
  onRegister,
  onSupport,
}: {
  onLogin: (user: SessionUser) => void
  onRegister: () => void
  onSupport: () => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [loginFeedback, setLoginFeedback] = useState<{
    type: "info" | "error" | "success"
    message: string
  } | null>(null)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    const normalized = identifier.toLocaleLowerCase("pt-BR").trim()
    const request = mockRegistrationRequests.find(
      (item) =>
        item.email.toLocaleLowerCase("pt-BR") === normalized ||
        item.name.toLocaleLowerCase("pt-BR") === normalized,
    )
    if (request?.status === "Pendente") {
      setLoginFeedback({
        type: "info",
        message:
          "Seu cadastro ainda está em análise pela Coordenação. Você receberá um retorno após a decisão.",
      })
      return
    }
    if (request?.status === "Recusado") {
      setLoginFeedback({
        type: "error",
        message:
          "Seu cadastro não foi aprovado. Entre em contato com o suporte para consultar o motivo ou atualizar seus dados.",
      })
      return
    }
    const inferredProfile: Profile =
      request?.status === "Aprovado"
        ? request.profile as Profile
        : normalized.includes("coordenador") || normalized.includes("carla")
          ? "Coordenador"
          : normalized.includes("professor") || normalized.includes("ricardo")
            ? "Professor"
            : normalized.includes("secretaria")
              ? "Secretária"
              : normalized.includes("administrador") ||
                  normalized.includes("admin")
                ? "Administrador"
                : normalized.includes("facilitador")
                  ? "Facilitador"
                  : "Aluno"
    onLogin({
      name: request?.name ?? nameFromIdentifier(identifier),
      profile: inferredProfile,
    })
  }

  return (
    <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[minmax(30rem,0.88fr)_minmax(36rem,1.12fr)]">
      <section className="relative flex min-h-72 overflow-hidden bg-brand-orange p-7 text-white sm:p-10 lg:min-h-screen lg:p-14">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-28 bottom-12 size-80 rounded-full border-[3rem] border-white/5" />
          <div className="absolute -right-16 -top-10 size-72 rounded-full bg-[#f3e5ce]/25 blur-sm" />
          <div className="absolute bottom-0 right-0 h-2/5 w-3/5 rounded-tl-[8rem] bg-brand-teal/90" />
          <div className="absolute bottom-0 right-0 h-[30%] w-[44%] rounded-tl-[7rem] bg-[#f3e5ce]" />
          <div className="pattern-grid absolute inset-0 opacity-20" />
        </div>

        <div className="relative z-10 flex w-full flex-col">
          <div className="[&_*]:text-white">
            <Brand />
          </div>
          <div className="my-auto max-w-lg py-12 lg:py-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">
              <span className="size-2 rounded-full bg-brand-teal" />
              Educação que transforma a saúde pública
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-5xl xl:text-6xl">
              Conhecimento para cuidar de{" "}
              <span className="text-[#f3e5ce]">Fortaleza.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/70 sm:text-base">
              Acesse cursos, acompanhe sua jornada e encontre tudo o que precisa
              para continuar aprendendo.
            </p>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-white/55 lg:flex">
            <span className="size-1.5 rounded-full bg-[#f3e5ce]" />
            Prefeitura de Fortaleza · Secretaria Municipal da Saúde
          </div>
        </div>
      </section>

      <section className="flex min-h-[42rem] items-center justify-center bg-white px-6 py-14 sm:px-12 lg:min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-orange">
              Portal ESPFOR
            </div>
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-ink sm:text-4xl">
              Boas-vindas!
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Entre com seus dados para acessar o ambiente de aprendizagem.
            </p>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink">
                Nome, CPF ou e-mail
              </span>
              <span className="input-shell">
                <Icon name="user" className="size-5 text-muted" />
                <input
                  required
                  type="text"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="Ex.: Carla Souza ou carla@escola.gov.br"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink">
                Senha
              </span>
              <span className="input-shell">
                <Icon name="folder" className="size-5 text-muted" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                  title={showPassword ? "Ocultar senha" : "Exibir senha"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="rounded-lg p-1 text-muted transition hover:bg-slate-100 hover:text-ink"
                >
                  <Icon name="eye" className="size-5" />
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 accent-[var(--color-brand-teal)]"
                />
                Lembrar acesso
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordOpen(true)
                  setRecoverySent(false)
                }}
                className="text-sm font-bold text-brand-teal transition hover:text-teal-dark"
              >
                Esqueci minha senha
              </button>
            </div>

            <button type="submit" className="primary-button group">
              Entrar no portal
              <Icon
                name="arrow"
                className="size-5 transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {loginFeedback && (
            <div
              className={`mt-5 rounded-2xl border p-4 text-xs leading-5 ${
                loginFeedback.type === "error"
                  ? "border-brand-orange/20 bg-orange-soft text-brand-orange"
                  : "border-brand-blue/20 bg-blue-soft text-brand-blue"
              }`}
            >
              {loginFeedback.message}
            </div>
          )}

          <div className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-muted">
            Ainda não tem acesso?
            <button
              type="button"
              onClick={onRegister}
              className="font-extrabold text-brand-teal transition hover:text-teal-dark"
            >
              Crie sua conta
            </button>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-7 text-xs text-muted">
            <Icon name="help" className="size-4" />
            Precisa de ajuda?{" "}
            <button
              onClick={onSupport}
              className="font-bold text-ink hover:text-brand-teal"
            >
              Fale com o suporte
            </button>
          </div>
        </div>
      </section>

      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/65 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setRecoverySent(true)
            }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <span className="card-icon bg-teal-soft text-brand-teal">
                <Icon name="lock" />
              </span>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <h2 className="mt-5 text-2xl font-extrabold">Redefinir senha</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Informe o e-mail associado à sua conta. Enviaremos as instruções
              de redefinição.
            </p>
            <label className="mt-6 block">
              <span className="field-label">E-mail cadastrado</span>
              <input
                required
                type="email"
                className="standalone-input"
                placeholder="nome@instituicao.gov.br"
              />
            </label>
            {recoverySent ? (
              <div className="mt-5 rounded-2xl bg-teal-soft p-4 text-xs font-bold leading-5 text-teal-dark">
                Instruções enviadas. Verifique sua caixa de entrada e a pasta de
                spam.
              </div>
            ) : (
              <button className="primary-button mt-6">
                Enviar instruções <Icon name="arrow" className="size-5" />
              </button>
            )}
          </form>
        </div>
      )}
    </main>
  )
}
