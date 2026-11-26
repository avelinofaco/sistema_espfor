import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeading } from "../../components/PageHeading"
import {
  mockRegistrationRequests,
  systemState,
  mockUserNotifications,
  mockLectures,
  mockLectureMaterials,
  mockDocumentArchive,
} from "../../data/mockData"
import {
  SessionUser,
  DashboardView,
  Lecture,
  LectureMaterial,
} from "../../types"
import {
  formatLectureDate,
  lectureCertificateContent,
} from "../../utils/helpers"

export function LecturesPage({
  user,
  onChange,
  onNavigate,
}: {
  user: SessionUser
  onChange: () => void
  onNavigate: (view: DashboardView) => void
}) {
  const isSecretary = user.profile === "Secretária"
  const [lectures, setLectures] = useState(() => [...mockLectures])
  const [showForm, setShowForm] = useState(false)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [activities, setActivities] = useState<{
    id: number
    title: string
    date: string
    format: string
  }[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const approvedSpeakers = mockRegistrationRequests.filter(
    (item) => item.profile === "Facilitador" && item.status === "Aprovado",
  )
  const speakerOptions = approvedSpeakers.length
    ? approvedSpeakers
    : [{ name: "Lívia Andrade" }]
  const visibleLectures =
    isSecretary || user.name === "Facilitador"
      ? lectures
      : lectures.filter((lecture) => lecture.speaker === user.name)
  const selectedLecture =
    lectures.find((lecture) => lecture.id === selectedId) ?? null

  function sync(next: Lecture[]) {
    mockLectures.splice(0, mockLectures.length, ...next)
    setLectures(next)
    onChange()
  }

  function notify(lecture: Lecture) {
    const requestId = Date.now()
    mockUserNotifications.unshift(
      {
        id: requestId,
        requestId,
        role: "Aluno",
        title: "Palestra com inscrições abertas",
        message: `${lecture.title} · ${formatLectureDate(lecture.date)}, ${lecture.time} · ${lecture.location}.`,
      },
      {
        id: requestId + 1,
        requestId,
        user: lecture.speaker,
        role: "Facilitador",
        title: "Lembrete de palestra",
        message: `Você está vinculado à palestra ${lecture.title}, em ${formatLectureDate(lecture.date)}, às ${lecture.time}.`,
      },
    )
    setFeedback("Divulgação e lembrete enviados aos alunos e ao facilitador.")
  }

  function issueCertificates(lecture: Lecture) {
    lecture.participants
      .filter((participant) => participant.present)
      .forEach((participant) => {
        if (!participant.certificateRegistration)
          participant.certificateRegistration =
            ++systemState.lastCertificateRegistration
        if (
          !mockDocumentArchive.some(
            (document) =>
              document.registrationNumber ===
              participant.certificateRegistration,
          )
        )
          mockDocumentArchive.unshift({
            id: Date.now() + participant.certificateRegistration,
            student: participant.name,
            cpf: participant.cpf,
            type: "Certificado de Palestra",
            course: lecture.title,
            issuance: "1ª Via",
            year: Number(lecture.date.slice(0, 4)),
            registrationNumber: participant.certificateRegistration,
            issuedAt: new Intl.DateTimeFormat("pt-BR").format(new Date()),
            source: "Sistema",
          })
      })
    const next = lectures.map((item) =>
      item.id === lecture.id ? { ...item, certificatesIssued: true } : item,
    )
    lecture.participants
      .filter((participant) => participant.present)
      .forEach((participant, index) => {
        mockUserNotifications.unshift({
          id: Date.now() + index,
          requestId: lecture.id,
          user: participant.name,
          role: participant.role,
          title: "Certificado de palestra disponível",
          message: `Seu certificado de participação em ${lecture.title} foi emitido pela Secretaria.`,
          downloadTitle: `Certificado - ${lecture.title}`,
          downloadContent: lectureCertificateContent(lecture, participant),
        })
      })
    sync(next)
    setFeedback(
      "Certificados emitidos e enviados somente aos participantes presentes.",
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow={isSecretary ? "Secretaria acadêmica" : "Agenda do facilitador"}
        title={isSecretary ? "Palestras" : "Minhas palestras"}
        description={
          isSecretary
            ? "Crie, divulgue e acompanhe inscrições, presença segura e certificação."
            : "Consulte os encontros vinculados a você e acompanhe seus participantes."
        }
        action={
          isSecretary ? (
            <button
              onClick={() => setShowForm(true)}
              className="primary-button self-start sm:w-auto"
            >
              <Icon name="plus" className="size-5" /> Nova Palestra
            </button>
          ) : (
            <button
              onClick={() => setShowActivityForm(true)}
              className="primary-button self-start sm:w-auto"
            >
              <Icon name="plus" className="size-5" /> Criar Atividade
            </button>
          )
        }
      />
      {feedback && (
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-teal-soft p-4 text-xs font-bold text-teal-dark">
          <span>{feedback}</span>
          <button onClick={() => setFeedback("")}>Fechar</button>
        </div>
      )}
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {visibleLectures.map((lecture) => (
          <article
            key={lecture.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="card-icon bg-orange-soft text-brand-orange">
                <Icon name="calendar" />
              </span>
              <span
                className={`badge ${
                  lecture.attendanceOpen ? "badge-teal" : "badge-blue"
                }`}
              >
                {lecture.attendanceOpen
                  ? "Presença liberada"
                  : "Inscrições abertas"}
              </span>
            </div>
            <h2 className="mt-5 text-lg font-extrabold">{lecture.title}</h2>
            <div className="mt-3 space-y-1 text-xs text-muted">
              <p>
                {formatLectureDate(lecture.date)} · {lecture.time}
              </p>
              <p>{lecture.location}</p>
              <p>
                Facilitador:{" "}
                <strong className="text-ink">{lecture.speaker}</strong>
              </p>
              <p>
                {
                  lecture.participants.filter(
                    (participant) => participant.role === "Aluno",
                  ).length
                }
                /{lecture.capacity} inscritos
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedId(lecture.id)}
                className="rounded-xl bg-ink px-4 py-3 text-xs font-extrabold text-white"
              >
                {isSecretary ? "Detalhes / Inscritos" : "Ver participantes"}
              </button>
              {isSecretary && (
                <button
                  onClick={() => notify(lecture)}
                  className="rounded-xl bg-orange-soft px-4 py-3 text-xs font-extrabold text-brand-orange"
                >
                  Divulgar / Enviar lembrete
                </button>
              )}
              {!isSecretary && (
                <button
                  onClick={() => onNavigate("materials")}
                  className="rounded-xl bg-teal-soft px-4 py-3 text-xs font-extrabold text-teal-dark"
                >
                  Anexar material / slides
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
      {!isSecretary && activities.length > 0 && (
        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-extrabold">Minhas Atividades</h2>
          <p className="mt-1 text-xs text-muted">
            Ações próprias, separadas das palestras institucionais vinculadas
            pela Secretaria.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {activities.map((activity) => (
              <div key={activity.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-extrabold">{activity.title}</div>
                <div className="mt-1 text-[0.62rem] text-muted">
                  {formatLectureDate(activity.date)} · {activity.format}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {showActivityForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              setActivities((current) => [
                {
                  id: Date.now(),
                  title: String(data.get("title")),
                  date: String(data.get("date")),
                  format: String(data.get("format")),
                },
                ...current,
              ])
              setShowActivityForm(false)
            }}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-teal">
                  Ação do Facilitador
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  Criar Atividade
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Esta atividade não será cadastrada como palestra
                  institucional.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowActivityForm(false)}
                className="self-start rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <label>
                <span className="field-label">Título da atividade</span>
                <input name="title" required className="standalone-input" />
              </label>
              <label>
                <span className="field-label">Data</span>
                <input
                  name="date"
                  type="date"
                  required
                  className="standalone-input"
                />
              </label>
              <label>
                <span className="field-label">Formato</span>
                <select name="format" className="standalone-input">
                  <option>Encontro online</option>
                  <option>Material orientado</option>
                  <option>Roda de conversa</option>
                </select>
              </label>
              <button className="primary-button">Criar Atividade</button>
            </div>
          </form>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              const lecture: Lecture = {
                id: Date.now(),
                title: String(form.get("title")),
                date: String(form.get("date")),
                time: String(form.get("time")),
                location: String(form.get("location")),
                capacity: Number(form.get("capacity")),
                speaker: String(form.get("speaker")),
                pin: String(Math.floor(1000 + Math.random() * 9000)),
                attendanceOpen: false,
                certificatesIssued: false,
                participants: [
                  {
                    name: String(form.get("speaker")),
                    cpf:
                      approvedSpeakers.find(
                        (item) => item.name === String(form.get("speaker")),
                      )?.cpf ?? "34567890123",
                    unit:
                      approvedSpeakers.find(
                        (item) => item.name === String(form.get("speaker")),
                      )?.unit ?? "Instituição convidada",
                    role: "Facilitador",
                    present: false,
                  },
                ],
              }
              sync([lecture, ...lectures])
              setShowForm(false)
              setSelectedId(lecture.id)
            }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-orange">
                  Nova programação
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">Criar palestra</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="field-label">Título</span>
                <input
                  name="title"
                  required
                  className="standalone-input"
                  placeholder="Tema da palestra"
                />
              </label>
              <label>
                <span className="field-label">Data</span>
                <input
                  name="date"
                  type="date"
                  required
                  className="standalone-input"
                />
              </label>
              <label>
                <span className="field-label">Horário</span>
                <input
                  name="time"
                  type="time"
                  required
                  className="standalone-input"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">Local / Link</span>
                <input
                  name="location"
                  required
                  className="standalone-input"
                  placeholder="Auditório ou link da sala"
                />
              </label>
              <label>
                <span className="field-label">Limite de vagas</span>
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  required
                  className="standalone-input"
                />
              </label>
              <label>
                <span className="field-label">Facilitador aprovado</span>
                <select name="speaker" className="standalone-input">
                  {speakerOptions.map((speaker) => (
                    <option key={speaker.name}>{speaker.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <button className="primary-button mt-6">
              Criar palestra <Icon name="check" className="size-5" />
            </button>
          </form>
        </div>
      )}
      {selectedLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-teal">
                  Detalhes e inscritos
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {selectedLecture.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            {isSecretary && (
              <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl bg-ink p-5 text-white sm:flex-row sm:items-center">
                <div>
                  <div className="text-[0.62rem] font-extrabold uppercase tracking-wider text-white/50">
                    Código de presença (PIN)
                  </div>
                  <div className="mt-2 text-3xl font-extrabold tracking-[0.22em]">
                    {selectedLecture.pin}
                  </div>
                </div>
                <button
                  onClick={() =>
                    sync(
                      lectures.map((item) =>
                        item.id === selectedLecture.id
                          ? { ...item, attendanceOpen: true }
                          : item,
                      ),
                    )
                  }
                  disabled={selectedLecture.attendanceOpen}
                  className="rounded-xl bg-brand-orange px-5 py-3 text-xs font-extrabold disabled:bg-brand-teal"
                >
                  {selectedLecture.attendanceOpen
                    ? "Registro liberado"
                    : "Liberar Registro de Presença"}
                </button>
              </div>
            )}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[1.2fr_0.7fr_auto] gap-3 bg-slate-50 px-4 py-3 text-[0.62rem] font-extrabold uppercase">
                <span>Participante</span>
                <span>Perfil</span>
                <span>Status</span>
              </div>
              {selectedLecture.participants.map((participant) => (
                <div
                  key={`${participant.cpf}-${participant.role}`}
                  className="grid grid-cols-[1.2fr_0.7fr_auto] items-center gap-3 border-t border-slate-100 px-4 py-4 text-xs"
                >
                  <div>
                    <strong>{participant.name}</strong>
                    <div className="mt-1 text-[0.62rem] text-muted">
                      {participant.unit}
                    </div>
                  </div>
                  <span>{participant.role}</span>
                  {isSecretary ? (
                    <button
                      onClick={() =>
                        sync(
                          lectures.map((lecture) =>
                            lecture.id === selectedLecture.id
                              ? {
                                  ...lecture,
                                  participants: lecture.participants.map(
                                    (item) =>
                                      item.cpf === participant.cpf
                                        ? { ...item, present: !item.present }
                                        : item,
                                  ),
                                }
                              : lecture,
                          ),
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-[0.62rem] font-extrabold ${
                        participant.present
                          ? "bg-teal-soft text-teal-dark"
                          : "bg-slate-100 text-muted"
                      }`}
                    >
                      {participant.present ? "Presente" : "Marcar presença"}
                    </button>
                  ) : (
                    <span
                      className={`badge ${
                        participant.present ? "badge-teal" : "badge-orange"
                      }`}
                    >
                      {participant.present ? "Presente" : "Pendente"}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {isSecretary && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => issueCertificates(selectedLecture)}
                  disabled={
                    selectedLecture.certificatesIssued ||
                    !selectedLecture.participants.some(
                      (participant) => participant.present,
                    )
                  }
                  className="primary-button sm:w-auto disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {selectedLecture.certificatesIssued
                    ? "Certificados enviados"
                    : "Emitir e Enviar Certificados"}{" "}
                  <Icon name="certificate" className="size-5" />
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export function SpeakerMaterialsPage({
  user,
  onChange,
}: {
  user: SessionUser
  onChange: () => void
}) {
  const [, setVersion] = useState(0)
  const [selectedMaterial, setSelectedMaterial] =
    useState<LectureMaterial | null>(null)
  const speakerLectures =
    user.name === "Facilitador"
      ? mockLectures
      : mockLectures.filter((lecture) => lecture.speaker === user.name)
  const materials =
    user.name === "Facilitador"
      ? mockLectureMaterials
      : mockLectureMaterials.filter(
          (material) => material.speaker === user.name,
        )
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Apoio à palestra"
        title="Envio de materiais"
        description="Faça o upload dos slides e das referências bibliográficas de cada encontro."
        action={
          <span className="badge badge-teal">
            {materials.length} materiais didáticos
          </span>
        }
      />
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-extrabold">Adicionar material</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {speakerLectures.map((lecture) => (
            <article
              key={lecture.id}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <h3 className="text-sm font-extrabold">{lecture.title}</h3>
              <p className="mt-1 text-xs text-muted">
                {formatLectureDate(lecture.date)} · {lecture.time}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(["Slides", "Referências bibliográficas"] as const).map(
                  (type) => (
                    <label
                      key={type}
                      className="cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-brand-teal"
                    >
                      <input
                        type="file"
                        accept={
                          type === "Slides"
                            ? ".pdf,.ppt,.pptx"
                            : ".pdf,.doc,.docx"
                        }
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (!file) return
                          mockLectureMaterials.unshift({
                            id: Date.now(),
                            lectureId: lecture.id,
                            speaker: lecture.speaker,
                            type,
                            fileName: file.name,
                            fileUrl: URL.createObjectURL(file),
                          })
                          setVersion((value) => value + 1)
                          onChange()
                          event.target.value = ""
                        }}
                      />
                      <Icon name="plus" className="size-5 text-brand-teal" />
                      <span className="mt-3 block text-xs font-extrabold">
                        {type}
                      </span>
                      <span className="mt-1 block text-[0.62rem] text-muted">
                        Selecionar arquivo
                      </span>
                    </label>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div>
          <h2 className="text-lg font-extrabold">Materiais enviados</h2>
          <p className="mt-1 text-xs text-muted">
            {materials.length} arquivos publicados para os participantes
          </p>
        </div>
        <div className="mt-5 space-y-3">
          {materials.length ? (
            materials.map((material) => (
              <div
                key={material.id}
                className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center"
              >
                <span className="card-icon bg-teal-soft text-brand-teal">
                  <Icon name="document" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold">{material.type}</div>
                  <div className="mt-1 truncate text-[0.62rem] text-muted">
                    {material.fileName} ·{" "}
                    {
                      mockLectures.find(
                        (lecture) => lecture.id === material.lectureId,
                      )?.title
                    }
                  </div>
                </div>
                <span className="badge badge-teal self-start sm:self-auto">
                  Enviado
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMaterial(material)}
                    className="rounded-xl bg-blue-soft px-4 py-2.5 text-xs font-extrabold text-brand-blue"
                  >
                    Visualizar
                  </button>
                  <button
                    onClick={() => {
                      if (material.fileUrl)
                        URL.revokeObjectURL(material.fileUrl)
                      const index = mockLectureMaterials.findIndex(
                        (item) => item.id === material.id,
                      )
                      if (index >= 0) mockLectureMaterials.splice(index, 1)
                      if (selectedMaterial?.id === material.id)
                        setSelectedMaterial(null)
                      setVersion((value) => value + 1)
                      onChange()
                    }}
                    className="rounded-xl bg-orange-soft px-4 py-2.5 text-xs font-extrabold text-brand-orange"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-slate-50 p-8 text-center text-xs text-muted">
              Nenhum material enviado.
            </div>
          )}
        </div>
      </section>
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm">
          <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-teal">
                  Pré-visualização do material
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {selectedMaterial.type}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {
                    mockLectures.find(
                      (lecture) => lecture.id === selectedMaterial.lectureId,
                    )?.title
                  }{" "}
                  · {selectedMaterial.fileName}
                </p>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 flex min-h-80 items-center justify-center rounded-2xl bg-slate-100 p-6">
              {selectedMaterial.fileUrl &&
              selectedMaterial.fileName.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  title={`Pré-visualização de ${selectedMaterial.fileName}`}
                  src={selectedMaterial.fileUrl}
                  className="h-[28rem] w-full rounded-xl bg-white"
                />
              ) : (
                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                  <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-teal-soft text-brand-teal">
                    <Icon name="document" className="size-8" />
                  </span>
                  <div className="mt-5 text-sm font-extrabold">
                    {selectedMaterial.fileName}
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    {selectedMaterial.type} pronto para os participantes
                  </div>
                  <div className="mx-auto mt-8 h-2 w-4/5 rounded bg-slate-100" />
                  <div className="mx-auto mt-3 h-2 w-3/5 rounded bg-slate-100" />
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
