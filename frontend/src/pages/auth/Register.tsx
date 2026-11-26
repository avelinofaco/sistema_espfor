import { FormEvent, useState } from "react"
import { Brand } from "../../components/Brand"
import { Icon } from "../../components/Icon"
import { mockRegistrationRequests, profiles } from "../../data/mockData"
import { Profile } from "../../types"

export function Register({ onBack }: { onBack: () => void }) {
  const [profile, setProfile] = useState<Profile>("Aluno")
  const [showPassword, setShowPassword] = useState(false)
  const [completed, setCompleted] = useState(false)
  const isStudent = profile === "Aluno"

  function submit(event: FormEvent) {
    event.preventDefault()
    const form = new FormData(event.currentTarget as HTMLFormElement)
    mockRegistrationRequests.unshift({
      id: Date.now(),
      name: String(form.get("fullName")),
      email: String(form.get("email")),
      cpf: String(form.get("cpf")),
      profession: isStudent
        ? String(form.get("profession"))
        : String(form.get("role")),
      profile,
      unit: isStudent
        ? "Instituição de ensino informada"
        : String(form.get("unit")),
      role: isStudent ? "Aluno" : String(form.get("role")),
      status: "Pendente",
    })
    setCompleted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (completed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas px-6 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-card sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-teal-soft text-brand-teal">
            <Icon name="check" className="size-8" />
          </div>
          <div className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-teal">
            Solicitação recebida
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.02em]">
            Cadastro enviado!
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            {`Seu cadastro de ${profile.toLowerCase()} seguirá para validação da Coordenação. Você receberá um retorno no e-mail informado.`}
          </p>
          <button onClick={onBack} className="primary-button mt-8">
            Voltar para o login
            <Icon name="arrow" className="size-5" />
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[22rem_1fr]">
      <aside className="relative overflow-hidden bg-brand-orange p-7 text-white sm:p-10 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pattern-grid absolute inset-0 opacity-15" />
          <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-[#f3e5ce]/30" />
          <div className="absolute -bottom-8 -right-10 size-40 rounded-full bg-brand-teal/90" />
        </div>
        <div className="relative z-10 flex h-full flex-col">
          <div className="[&_*]:text-white">
            <Brand />
          </div>
          <div className="my-12 lg:my-auto">
            <div className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#f3e5ce]">
              Novo acesso
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.02em]">
              Faça parte da nossa comunidade de aprendizagem.
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Um único cadastro para acessar sua jornada na Escola de Saúde
              Pública de Fortaleza.
            </p>
            <div className="mt-8 hidden space-y-4 lg:block">
              {[
                "Escolha seu perfil",
                "Preencha seus dados",
                "Acesse o portal",
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-extrabold ${
                      index === 0
                        ? "bg-brand-teal text-white"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      index === 0 ? "text-white" : "text-white/45"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="relative z-10 flex items-center gap-2 self-start text-xs font-bold text-white/60 transition hover:text-white"
          >
            <Icon name="arrow" className="size-4 rotate-180" />
            Voltar para o login
          </button>
        </div>
      </aside>

      <section className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-teal">
              Crie sua conta
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
              Qual é o seu perfil?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Selecione a opção que melhor representa sua atuação. Os recursos
              do portal serão personalizados para o perfil escolhido.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8">
            <fieldset>
              <legend className="sr-only">
                Selecione seu perfil de acesso
              </legend>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {profiles
                  .filter((item) =>
                    ["Aluno", "Professor", "Facilitador"].includes(item.name),
                  )
                  .map((item) => {
                    const selected = profile === item.name
                    return (
                      <label
                        key={item.name}
                        className={`profile-option ${
                          selected ? "profile-option-active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="profile"
                          value={item.name}
                          checked={selected}
                          onChange={() => setProfile(item.name)}
                          className="sr-only"
                        />
                        <span
                          className={`flex size-10 items-center justify-center rounded-xl ${
                            selected
                              ? "bg-brand-teal text-white"
                              : "bg-slate-100 text-muted"
                          }`}
                        >
                          <Icon name={item.icon} className="size-5" />
                        </span>
                        <span className="mt-3 block text-sm font-extrabold">
                          {item.name}
                        </span>
                        <span className="mt-1 block text-[0.62rem] leading-4 text-muted">
                          {item.description}
                        </span>
                        {selected && (
                          <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-teal-soft text-brand-teal">
                            <Icon name="check" className="size-3" />
                          </span>
                        )}
                      </label>
                    )
                  })}
              </div>
            </fieldset>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-soft text-brand-orange">
                  <Icon name="user" className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold">Dados de acesso</h3>
                  <p className="mt-0.5 text-xs text-muted">
                    Informe seus dados pessoais e de contato.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="field-label">Nome completo</span>
                  <span className="input-shell">
                    <Icon name="user" className="size-5 text-muted" />
                    <input
                      name="fullName"
                      required
                      type="text"
                      placeholder="Digite seu nome completo"
                      className="form-input"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="field-label">CPF</span>
                  <span className="input-shell">
                    <Icon name="document" className="size-5 text-muted" />
                    <input
                      name="cpf"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{11}"
                      minLength={11}
                      maxLength={11}
                      placeholder="Somente os 11 dígitos"
                      className="form-input"
                    />
                  </span>
                  <span className="mt-2 block text-[0.65rem] text-muted">
                    Informe exatamente 11 números, sem pontos ou traço.
                  </span>
                </label>

                {isStudent && (
                  <label className="block">
                    <span className="field-label">Profissão</span>
                    <select
                      name="profession"
                      required
                      className="standalone-input"
                    >
                      <option value="">Selecione sua profissão</option>
                      <option>Médico</option>
                      <option>Enfermeiro</option>
                      <option>Odontólogo</option>
                      <option>ACE — Agente Comunitário de Endemias</option>
                      <option>ACS — Agente Comunitário de Saúde</option>
                      <option>Técnico de enfermagem</option>
                      <option>Outra profissão da saúde</option>
                    </select>
                  </label>
                )}

                <label className="block">
                  <span className="field-label">
                    {isStudent ? "E-mail institucional" : "E-mail profissional"}
                  </span>
                  <span className="input-shell">
                    <Icon name="mail" className="size-5 text-muted" />
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder={
                        isStudent
                          ? "nome@aluno.instituicao.edu.br"
                          : "nome@instituicao.gov.br"
                      }
                      className="form-input"
                    />
                  </span>
                  <span className="mt-2 block text-[0.65rem] leading-4 text-muted">
                    {isStudent
                      ? "Utilize o e-mail fornecido pela sua instituição de ensino."
                      : "Utilize o e-mail vinculado ao seu órgão ou instituição."}
                  </span>
                </label>

                <label className="block">
                  <span className="field-label">Senha</span>
                  <span className="input-shell">
                    <Icon name="lock" className="size-5 text-muted" />
                    <input
                      required
                      minLength={8}
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo de 8 caracteres"
                      className="form-input"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Ocultar senha" : "Exibir senha"
                      }
                      title={showPassword ? "Ocultar senha" : "Exibir senha"}
                      onClick={() => setShowPassword((current) => !current)}
                      className="rounded-lg p-1 text-muted transition hover:bg-slate-100 hover:text-ink"
                    >
                      <Icon name="eye" className="size-5" />
                    </button>
                  </span>
                  <span className="mt-2 block text-[0.65rem] leading-4 text-muted">
                    Use letras maiúsculas, números e símbolos.
                  </span>
                </label>
              </div>

              {!isStudent && (
                <div className="mt-8 animate-reveal border-t border-slate-100 pt-7">
                  <div className="mb-5 flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-brand-blue">
                      <Icon name="building" className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold">
                        Dados funcionais
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-muted">
                        Essas informações serão usadas pela gestão para validar
                        sua solicitação de acesso.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="field-label">Lotação</span>
                      <span className="input-shell">
                        <Icon name="building" className="size-5 text-muted" />
                        <input
                          name="unit"
                          required
                          type="text"
                          placeholder="Órgão, unidade ou instituição"
                          className="form-input"
                        />
                      </span>
                    </label>
                    <label className="block">
                      <span className="field-label">Cargo ou função</span>
                      <span className="input-shell">
                        <Icon name="user" className="size-5 text-muted" />
                        <input
                          name="role"
                          required
                          type="text"
                          placeholder="Informe seu cargo atual"
                          className="form-input"
                        />
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand-blue/15 bg-blue-soft p-4 sm:p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-blue">
                <Icon name="lock" className="size-4" />
              </span>
              <div>
                <div className="text-xs font-extrabold text-brand-blue">
                  Controle de acesso por perfil
                </div>
                <p className="mt-1 text-xs leading-5 text-ink/65">
                  As funcionalidades disponíveis dependem do perfil selecionado.
                  Alunos podem acompanhar cursos, frequência e documentos, mas
                  não têm permissão para cadastrar ou gerenciar cursos.
                </p>
              </div>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-5 text-muted">
              <input
                required
                type="checkbox"
                className="mt-0.5 size-4 shrink-0 rounded border-slate-300 accent-[var(--color-brand-teal)]"
              />
              Declaro que as informações fornecidas são verdadeiras e concordo
              com os termos de uso e a política de privacidade.
            </label>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onBack}
                className="h-14 rounded-2xl border border-slate-200 bg-white px-7 text-sm font-extrabold transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button type="submit" className="primary-button sm:w-auto">
                {isStudent ? "Criar minha conta" : "Solicitar cadastro"}
                <Icon name="arrow" className="size-5" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
