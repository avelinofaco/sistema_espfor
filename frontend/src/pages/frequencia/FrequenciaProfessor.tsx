import { FormEvent, useState } from "react"
import { AttendanceQr } from "../../components/AttendanceQr"
import { Icon } from "../../components/Icon"
import { PageHeading } from "../../components/PageHeading"
import { classData, courseData, systemState } from "../../data/mockData"
import { AttendanceForm } from "../../types"

export function FrequenciaProfessor() {
  const [course, setCourse] = useState(courseData[0].title)
  const availableClasses = classData.filter((item) => item.course === course)
  const [className, setClassName] = useState(availableClasses[0]?.name ?? "")
  const [form, setForm] = useState<AttendanceForm | null>(
    () => systemState.activeAttendanceForm,
  )
  const [fullScreen, setFullScreen] = useState(false)
  const [copied, setCopied] = useState(false)

  function createForm(event: FormEvent) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    const next: AttendanceForm = {
      id: Date.now(),
      course,
      className,
      date: String(data.get("date")),
      content: String(data.get("content")),
      validity: Number(data.get("validity")),
      link: `https://presenca.espfor.fortaleza/registro/${Date.now().toString(36)}`,
      attendees: [],
    }
    systemState.activeAttendanceForm = next
    setForm(next)
  }

  function downloadQr() {
    const squares = Array.from({ length: 225 }, (_, index) => {
      const row = Math.floor(index / 15)
      const column = index % 15
      const filled =
        (row < 5 && column < 5) ||
        (row < 5 && column > 9) ||
        (row > 9 && column < 5) ||
        (row * 7 + column * 11 + row * column) % 5 < 2
      return filled
        ? `<rect x="${column * 10}" y="${row * 10}" width="9" height="9" fill="#172b3a"/>`
        : ""
    }).join("")
    const blob = new Blob(
      [
        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="-15 -15 180 180"><rect x="-15" y="-15" width="180" height="180" fill="white"/>${squares}</svg>`,
      ],
      { type: "image/svg+xml" },
    )
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "qr-code-presenca-espfor.svg"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Sala de aula"
        title="Frequência via Formulário e QR Code"
        description="Crie um formulário temporário para que cada aluno registre a presença uma única vez pelo CPF."
        action={<span className="badge badge-teal">Perfil Professor</span>}
      />
      <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form
          onSubmit={createForm}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <span className="card-icon bg-orange-soft text-brand-orange">
              <Icon name="calendar" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">Formulário da aula</h2>
              <p className="mt-1 text-xs text-muted">
                Configure a chamada digital.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <label>
              <span className="field-label">Curso</span>
              <select
                value={course}
                onChange={(event) => {
                  const next = event.target.value
                  setCourse(next)
                  setClassName(
                    classData.find((item) => item.course === next)?.name ?? "",
                  )
                }}
                className="standalone-input"
              >
                {courseData.map((item) => (
                  <option key={item.title}>{item.title}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="field-label">Turma</span>
              <select
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                className="standalone-input"
              >
                {classData
                  .filter((item) => item.course === course)
                  .map((item) => (
                    <option key={item.id}>{item.name}</option>
                  ))}
              </select>
            </label>
            <label>
              <span className="field-label">Data da aula</span>
              <input
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="standalone-input"
              />
            </label>
            <label>
              <span className="field-label">Conteúdo ministrado</span>
              <textarea
                name="content"
                required
                className="form-textarea"
                placeholder="Descreva o conteúdo desta aula"
              />
            </label>
            <label>
              <span className="field-label">Tempo de validade</span>
              <select name="validity" className="standalone-input">
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
              </select>
            </label>
            <button className="primary-button">
              Gerar QR Code <Icon name="arrow" className="size-5" />
            </button>
          </div>
        </form>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          {form ? (
            <>
              <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-6 text-center">
                <span className="badge badge-teal">
                  Formulário ativo · {form.validity} min
                </span>
                <div className="mt-5">
                  <AttendanceQr />
                </div>
                <h2 className="mt-5 text-lg font-extrabold">
                  {form.className}
                </h2>
                <p className="mt-1 text-xs text-muted">{form.content}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setFullScreen(true)}
                    className="rounded-xl bg-ink px-4 py-3 text-xs font-extrabold text-white"
                  >
                    Ampliar para projeção
                  </button>
                  <button
                    onClick={downloadQr}
                    className="rounded-xl bg-orange-soft px-4 py-3 text-xs font-extrabold text-brand-orange"
                  >
                    Baixar imagem
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard
                        ?.writeText(form.link)
                        .catch(() => undefined)
                      setCopied(true)
                    }}
                    className="rounded-xl bg-blue-soft px-4 py-3 text-xs font-extrabold text-brand-blue"
                  >
                    {copied ? "Link copiado" : "Copiar link"}
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold">
                    Presenças em tempo real
                  </h3>
                  <span className="badge badge-blue">
                    {form.attendees.length} registros
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {form.attendees.length ? (
                    form.attendees.map((attendee) => (
                      <div
                        key={attendee.cpf}
                        className="flex items-center gap-3 rounded-xl bg-teal-soft/50 p-3"
                      >
                        <Icon name="check" className="size-4 text-brand-teal" />
                        <div className="flex-1 text-xs">
                          <strong>{attendee.name}</strong>
                          <span className="ml-2 text-muted">
                            CPF •••{attendee.cpf.slice(-4)}
                          </span>
                        </div>
                        <span className="text-[0.62rem] font-bold text-teal-dark">
                          {attendee.registeredAt}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-slate-50 p-6 text-center text-xs text-muted">
                      Aguardando os primeiros registros pelo QR Code ou link.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-96 flex-col items-center justify-center text-center">
              <span className="card-icon bg-slate-100 text-muted">
                <Icon name="grid" />
              </span>
              <h2 className="mt-4 text-base font-extrabold">
                QR Code ainda não gerado
              </h2>
              <p className="mt-2 max-w-sm text-xs leading-5 text-muted">
                Preencha o formulário da aula para liberar o registro de
                presença.
              </p>
            </div>
          )}
        </section>
      </div>
      {fullScreen && form && (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-white p-5">
          <button
            onClick={() => setFullScreen(false)}
            className="absolute right-6 top-6 rounded-xl bg-slate-100 px-4 py-3 text-xs font-extrabold"
          >
            Fechar tela cheia
          </button>
          <AttendanceQr large />
          <h2 className="mt-6 text-2xl font-extrabold">{form.className}</h2>
          <p className="mt-2 text-sm text-muted">
            Aponte a câmera para registrar sua presença
          </p>
        </div>
      )}
    </div>
  )
}
