import { FormEvent, useState } from "react"

import { PageHeading } from "../../components/PageHeading"
import {
  courseData,
  mockUserNotifications,
  mockClassRosters,
  classData,
  mockAssessmentTypes,
  mockGradesByStudent,
} from "../../data/mockData"
import {
  AssessmentType,
  Profile,
  SessionUser,
  CalendarEvent,
} from "../../types"

export function AttendancePage({
  user,
  profile,
  events,
  setEvents,
}: {
  user: SessionUser
  profile: Profile
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
}) {
  const canEdit = profile === "Secretária"
  const [teacherClass, setTeacherClass] = useState(classData[0].name)
  const [teacherCourse, setTeacherCourse] = useState(classData[0].course)
  const [studentCourse, setStudentCourse] = useState(courseData[0].title)
  const [studentView, setStudentView] = useState<"attendance" | "grades">(
    "attendance",
  )
  const [grades, setGrades] = useState<Record<string, {
    note1: string
    note2: string
    note3: string
  }>>(() => ({ ...mockGradesByStudent }))
  const [assessmentTypes, setAssessmentTypes] = useState(() => [
    ...mockAssessmentTypes,
  ])
  const teacherClassId = classData.find((item) => item.name === teacherClass)
    ?.id
  const teacherRoster = teacherClassId
    ? (mockClassRosters[teacherClassId] ?? [])
    : []
  const studentPublishedGrades = (["note1", "note2", "note3"] as const).flatMap(
    (field, index) =>
      mockAssessmentTypes[index] && mockGradesByStudent[user.name]?.[field]
        ? [Number(mockGradesByStudent[user.name][field])]
        : [],
  )
  const studentAverage = studentPublishedGrades.length
    ? studentPublishedGrades.reduce((sum, grade) => sum + grade, 0) /
      studentPublishedGrades.length
    : null
  const todayInput = new Date().toISOString().slice(0, 10)
  const maxReminderDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
  function addEvent(event: FormEvent) {
    event.preventDefault()
    const form = new FormData(event.currentTarget as HTMLFormElement)
    const audience = String(form.get("audience")) as Profile
    const reminder = {
      id: Date.now(),
      date: String(form.get("date")),
      title: String(form.get("title")),
      type: String(form.get("type")),
      audience,
    }
    setEvents([...events, reminder])
    mockUserNotifications.unshift({
      id: reminder.id,
      requestId: reminder.id,
      role: audience,
      title: reminder.title,
      message: `${reminder.type} agendado para ${reminder.date}.`,
    })
    ;(event.currentTarget as HTMLFormElement).reset()
  }
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow={
          canEdit
            ? "Secretaria acadêmica"
            : profile === "Coordenador"
              ? "Acompanhamento acadêmico"
              : "Participação nas atividades"
        }
        title={
          canEdit
            ? "Lembretes"
            : profile === "Coordenador"
              ? "Acompanhamento acadêmico"
              : profile === "Aluno"
                ? "Frequências/Notas"
                : "Notas"
        }
        description={
          canEdit
            ? "Publique avisos, prazos e atividades que serão exibidos na visão geral dos alunos."
            : profile === "Coordenador"
              ? "Acompanhe os registros lançados pelos professores sem alterar as chamadas."
              : profile === "Professor"
                ? "Consulte o histórico. O registro e a correção da chamada são feitos dentro de cada turma."
                : "Consulte cada aula e a presença registrada pelo professor."
        }
        action={<span className="badge badge-teal">{profile}</span>}
      />
      {canEdit ? (
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="space-y-5">
            <form
              onSubmit={addEvent}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
            >
              <h2 className="text-base font-extrabold">Novo lembrete</h2>
              <p className="mt-1 text-xs text-muted">
                Este conteúdo aparecerá na tela inicial dos alunos.
              </p>
              <div className="mt-4 space-y-3">
                <input
                  name="title"
                  required
                  className="standalone-input"
                  placeholder="Título do evento"
                />
                <select name="audience" className="standalone-input">
                  <option>Aluno</option>
                  <option>Professor</option>
                  <option>Facilitador</option>
                </select>
                <input
                  name="date"
                  required
                  min={todayInput}
                  max={maxReminderDate}
                  type="date"
                  className="standalone-input"
                />
                <select name="type" className="standalone-input">
                  <option>Aula</option>
                  <option>Avaliação</option>
                  <option>Evento institucional</option>
                  <option>Prazo</option>
                </select>
                <button className="primary-button">Publicar na agenda</button>
              </div>
            </form>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <h2 className="text-base font-extrabold">Lembretes publicados</h2>
              <div className="mt-5 space-y-4">
                {events.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-2 border-brand-teal pl-3"
                  >
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className="mt-1 text-[0.62rem] text-muted">
                      {item.date} · {item.type} · Para: {item.audience}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          {profile === "Aluno" && (
            <div className="mb-7 flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end">
              <div className="flex gap-2">
                <button
                  onClick={() => setStudentView("attendance")}
                  className={`rounded-xl px-5 py-3 text-xs font-extrabold ${
                    studentView === "attendance"
                      ? "bg-ink text-white"
                      : "bg-slate-100 text-muted"
                  }`}
                >
                  Frequência
                </button>
                <button
                  onClick={() => setStudentView("grades")}
                  className={`rounded-xl px-5 py-3 text-xs font-extrabold ${
                    studentView === "grades"
                      ? "bg-ink text-white"
                      : "bg-slate-100 text-muted"
                  }`}
                >
                  Notas
                </button>
              </div>
              <label className="block w-full max-w-sm">
                <span className="field-label">Selecionar curso</span>
                <select
                  value={studentCourse}
                  onChange={(event) => setStudentCourse(event.target.value)}
                  className="standalone-input"
                >
                  {courseData
                    .filter((course) => course.status === "Ativo")
                    .map((course) => (
                      <option key={course.title}>{course.title}</option>
                    ))}
                  <option>Planejamento e Gestão em Saúde</option>
                </select>
              </label>
            </div>
          )}
          {profile === "Professor" && (
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-end">
              <div className="grid w-full gap-3 sm:max-w-2xl sm:grid-cols-2">
                <label>
                  <span className="field-label">Curso</span>
                  <select
                    value={teacherCourse}
                    onChange={(event) => {
                      const course = event.target.value
                      setTeacherCourse(course)
                      setTeacherClass(
                        classData.find((item) => item.course === course)
                          ?.name ?? "",
                      )
                    }}
                    className="standalone-input"
                  >
                    {courseData.map((course) => (
                      <option key={course.title}>{course.title}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="field-label">Turma do curso</span>
                  <select
                    value={teacherClass}
                    onChange={(event) => setTeacherClass(event.target.value)}
                    className="standalone-input"
                  >
                    {classData
                      .filter((item) => item.course === teacherCourse)
                      .map((item) => (
                        <option key={item.id}>{item.name}</option>
                      ))}
                  </select>
                </label>
              </div>
              <button className="rounded-xl bg-brand-teal px-5 py-3 text-xs font-extrabold text-white">
                Salvar notas
              </button>
            </div>
          )}
          {profile === "Professor" && (
            <div className="mb-6 rounded-2xl bg-slate-50 p-5">
              <div className="text-sm font-extrabold">Tipos de avaliação</div>
              <p className="mt-1 text-xs text-muted">
                Cadastre até três avaliações. Deixe uma opção neutra para que
                ela não influencie na média.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {assessmentTypes.map((type, index) => (
                  <label key={index}>
                    <span className="field-label">Avaliação {index + 1}</span>
                    <select
                      value={type}
                      onChange={(event) => {
                        const value = event.target.value as AssessmentType
                        mockAssessmentTypes[index] = value
                        setAssessmentTypes((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? value : item,
                          ),
                        )
                      }}
                      className="standalone-input"
                    >
                      <option value="">Neutra / não utilizada</option>
                      <option>Prova</option>
                      <option>Trabalho</option>
                      <option>Estudo de caso</option>
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="mt-7 overflow-x-auto">
            {profile === "Professor" ? (
              <div className="min-w-[50rem]">
                <div className="grid grid-cols-[1.25fr_0.7fr_0.65fr_0.65fr_0.65fr_0.65fr_0.65fr] gap-3 border-b-2 border-ink/10 px-3 pb-3 text-[0.62rem] font-extrabold uppercase tracking-wider text-ink">
                  <span>Nome</span>
                  <span>Matrícula</span>
                  <span>Presenças</span>
                  {assessmentTypes.map((type, index) => (
                    <span key={index}>{type || `Avaliação ${index + 1}`}</span>
                  ))}
                  <span>Média</span>
                </div>
                {teacherRoster.map(([name, enrollment], index) => {
                  const studentGrades = grades[name] ?? {
                    note1: "",
                    note2: "",
                    note3: "",
                  }
                  const fields = ["note1", "note2", "note3"] as const
                  const validNotes = fields.flatMap((field, fieldIndex) =>
                    assessmentTypes[fieldIndex] && studentGrades[field] !== ""
                      ? [Number(studentGrades[field])]
                      : [],
                  )
                  const average = validNotes.length
                    ? validNotes.reduce((sum, note) => sum + note, 0) /
                      validNotes.length
                    : null
                  return (
                    <div
                      key={name}
                      className="grid grid-cols-[1.25fr_0.7fr_0.65fr_0.65fr_0.65fr_0.65fr_0.65fr] items-center gap-3 border-b border-slate-100 px-3 py-4"
                    >
                      <span className="text-xs font-extrabold">{name}</span>
                      <span className="text-[0.68rem] text-muted">
                        {enrollment}
                      </span>
                      <span
                        className={`text-xs font-extrabold ${
                          index === 3 ? "text-brand-orange" : "text-teal-dark"
                        }`}
                      >
                        {index === 3 ? "72%" : `${88 + index}%`}
                      </span>
                      {fields.map((field, fieldIndex) =>
                        assessmentTypes[fieldIndex] ? (
                          <input
                            key={field}
                            aria-label={`${assessmentTypes[fieldIndex]} de ${name}`}
                            value={studentGrades[field]}
                            onChange={(event) => {
                              const next = {
                                ...studentGrades,
                                [field]: event.target.value,
                              }
                              mockGradesByStudent[name] = next
                              setGrades((current) => ({
                                ...current,
                                [name]: next,
                              }))
                            }}
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            className="compact-input"
                          />
                        ) : (
                          <span
                            key={field}
                            className="flex h-9 items-center justify-center rounded-lg bg-slate-100 text-xs text-muted"
                          >
                            Neutra
                          </span>
                        ),
                      )}
                      <span
                        className={`text-sm font-extrabold ${
                          average !== null && average >= 7
                            ? "text-teal-dark"
                            : "text-brand-orange"
                        }`}
                      >
                        {average?.toFixed(1) ?? "—"}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : studentView === "attendance" ? (
              <div>
                <div className="mb-5 rounded-2xl bg-teal-soft p-5">
                  <div className="text-[0.62rem] font-extrabold uppercase tracking-wider text-teal-dark">
                    Curso
                  </div>
                  <h2 className="mt-2 text-lg font-extrabold">
                    {studentCourse}
                  </h2>
                  <div className="mt-2 text-xs text-muted">
                    Frequência acumulada:{" "}
                    <strong className="text-teal-dark">92%</strong>
                  </div>
                </div>
                <div className="min-w-[32rem]">
                  <div className="grid grid-cols-[0.8fr_1fr_0.7fr] gap-4 border-b-2 border-ink/10 px-3 pb-3 text-[0.62rem] font-extrabold uppercase tracking-wider text-ink">
                    <span>Data</span>
                    <span>Professor</span>
                    <span>Presença</span>
                  </div>
                  {[
                    ["02/11/2026", "Prof. Ricardo", "Presente"],
                    ["09/11/2026", "Prof. Ricardo", "Presente"],
                    ["16/11/2026", "Profa. Luana", "Ausente"],
                    ["23/11/2026", "Profa. Luana", "Presente"],
                  ].map(([date, teacher, status]) => (
                    <div
                      key={`${date}-${teacher}`}
                      className="grid grid-cols-[0.8fr_1fr_0.7fr] items-center gap-4 border-b border-slate-100 px-3 py-4 text-xs"
                    >
                      <span className="font-bold">{date}</span>
                      <span className="text-muted">{teacher}</span>
                      <span
                        className={`justify-self-start rounded-full px-3 py-1.5 text-[0.62rem] font-extrabold ${
                          status === "Presente"
                            ? "bg-teal-soft text-teal-dark"
                            : "bg-orange-soft text-brand-orange"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col justify-between gap-4 rounded-2xl bg-ink p-5 text-white sm:flex-row sm:items-center">
                  <div>
                    <div className="text-[0.62rem] font-extrabold uppercase tracking-wider text-brand-orange">
                      Boletim do aluno
                    </div>
                    <h2 className="mt-2 text-lg font-extrabold">{user.name}</h2>
                    <p className="mt-1 text-xs text-white/55">
                      {studentCourse}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/10 px-5 py-3 text-center">
                    <div className="text-2xl font-extrabold">
                      {studentAverage?.toFixed(1) ?? "—"}
                    </div>
                    <div className="text-[0.6rem] text-white/55">
                      Média atual
                    </div>
                  </div>
                </div>
                <div className="mt-5 min-w-[32rem]">
                  <div className="grid grid-cols-[1.4fr_0.7fr_0.8fr] gap-4 border-b-2 border-ink/10 px-3 pb-3 text-[0.62rem] font-extrabold uppercase tracking-wider text-ink">
                    <span>Tipo de avaliação</span>
                    <span>Nota</span>
                    <span>Situação</span>
                  </div>
                  {mockAssessmentTypes.flatMap((assessment, index) => {
                    const field =
                      `note${index + 1}` as "note1" | "note2" | "note3"
                    const grade = mockGradesByStudent[user.name]?.[field] ?? ""
                    if (!assessment) return []
                    const numericGrade = grade === "" ? null : Number(grade)
                    return [
                      <div
                        key={`${assessment}-${index}`}
                        className="grid grid-cols-[1.4fr_0.7fr_0.8fr] items-center gap-4 border-b border-slate-100 px-3 py-4 text-xs"
                      >
                        <span className="font-bold">{assessment}</span>
                        <span className="text-base font-extrabold text-brand-blue">
                          {numericGrade?.toFixed(1) ?? "Aguardando lançamento"}
                        </span>
                        <span
                          className={`justify-self-start rounded-full px-3 py-1.5 text-[0.62rem] font-extrabold ${
                            numericGrade === null
                              ? "bg-slate-100 text-muted"
                              : numericGrade >= 7
                                ? "bg-teal-soft text-teal-dark"
                                : "bg-orange-soft text-brand-orange"
                          }`}
                        >
                          {numericGrade === null
                            ? "Pendente"
                            : numericGrade >= 7
                              ? "Aprovado"
                              : "Em recuperação"}
                        </span>
                      </div>,
                    ]
                  })}
                </div>
                <div className="mt-5 rounded-2xl border border-brand-teal/20 bg-teal-soft p-4 text-xs leading-5 text-ink/70">
                  Situação acadêmica regular. Para certificação, mantenha média
                  igual ou superior a 7 e frequência mínima de 75%.
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
