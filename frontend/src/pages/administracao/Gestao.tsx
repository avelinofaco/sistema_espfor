import { FormEvent, useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeading } from "../../components/PageHeading"
import {
  mockRegistrationRequests,
  projectData,
  courseData,
  mockEnrollmentRequests,
  mockUserNotifications,
  mockEmailNotifications,
  mockLectures,
  mockLectureMaterials,
  mockMaterials,
  studentData,
  classData,
  mockAuditLogs,
} from "../../data/mockData"
import {
  IconName,
  LectureMaterial,
  Profile,
  RegistrationStatus,
  SessionUser,
} from "../../types"
import {
  mockCpfForUser,
  downloadDocument,
  downloadExport,
  formatLectureDate,
} from "../../utils/helpers"

export function MaterialsPage({
  readOnly = false,
  user,
}: {
  readOnly?: boolean
  user?: SessionUser
}) {
  const [materials, setMaterials] = useState(() => [...mockMaterials])
  const [selectedMaterial, setSelectedMaterial] =
    useState<typeof mockMaterials[number] | null>(null)
  const [selectedLectureMaterial, setSelectedLectureMaterial] =
    useState<LectureMaterial | null>(null)
  const [publishingCourse, setPublishingCourse] = useState(courseData[0].title)
  const [materialCourseFilter, setMaterialCourseFilter] = useState(
    courseData[0].title,
  )
  const [materialType, setMaterialType] = useState("Slides")
  const visibleMaterials = readOnly
    ? materials.filter((item) => item.course === materialCourseFilter)
    : materials
  const studentCpf = user ? mockCpfForUser(user) : ""
  const enrolledLectures =
    readOnly && user
      ? mockLectures.filter((lecture) =>
          lecture.participants.some(
            (participant) =>
              participant.role === "Aluno" &&
              (participant.cpf === studentCpf ||
                participant.name === user.name),
          ),
        )
      : []
  const lectureMaterials = mockLectureMaterials.filter((material) =>
    enrolledLectures.some((lecture) => lecture.id === material.lectureId),
  )
  function submit(event: FormEvent) {
    event.preventDefault()
    const form = new FormData(event.currentTarget as HTMLFormElement)
    const file = form.get("file") as File
    const material = {
      id: Date.now(),
      title: String(form.get("title")),
      type: String(form.get("type")),
      course: String(form.get("course")),
      className: String(form.get("className")),
      file:
        materialType === "Prova"
          ? "Sem arquivo"
          : file?.name || "arquivo-material.pdf",
      date: new Intl.DateTimeFormat("pt-BR").format(new Date()),
      evaluationDate: String(form.get("evaluationDate") ?? ""),
    }
    mockMaterials.unshift(material)
    if (["Prova", "Trabalho", "Estudo de caso"].includes(material.type))
      mockUserNotifications.unshift({
        id: material.id,
        requestId: material.id,
        role: "Aluno",
        title: `${material.type}: ${material.title}`,
        message: `${material.course} · ${material.className} · ${
          material.type === "Prova" ? "Realização" : "Entrega"
        } em ${new Date(`${material.evaluationDate}T12:00:00`).toLocaleDateString("pt-BR")}.`,
      })
    setMaterials((current) => [material, ...current])
    ;(event.currentTarget as HTMLFormElement).reset()
  }
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Apoio pedagógico"
        title="Materiais acadêmicos"
        description={
          readOnly
            ? "Consulte os slides, trabalhos, provas e conteúdos publicados pelos professores."
            : "Publique slides, trabalhos, provas e materiais complementares para suas turmas."
        }
        action={
          <span className="badge badge-teal">
            {readOnly ? "Perfil Aluno" : "Perfil Professor"}
          </span>
        }
      />
      <div className="mt-8 grid gap-6">
        {readOnly && (
          <section className="rounded-3xl border border-brand-orange/20 bg-white p-6 shadow-card">
            <div className="flex items-center gap-4">
              <span className="card-icon bg-orange-soft text-brand-orange">
                <Icon name="calendar" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold">
                  Materiais das palestras
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Slides e referências enviados pelos facilitadores dos eventos
                  em que você está inscrito.
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-5">
              {enrolledLectures.length ? (
                enrolledLectures.map((lecture) => {
                  const published = lectureMaterials.filter(
                    (material) => material.lectureId === lecture.id,
                  )
                  return (
                    <article
                      key={lecture.id}
                      className="overflow-hidden rounded-2xl border border-slate-200"
                    >
                      <div className="flex flex-col justify-between gap-2 bg-orange-soft/60 p-4 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="text-sm font-extrabold">
                            {lecture.title}
                          </h3>
                          <p className="mt-1 text-[0.62rem] text-muted">
                            {formatLectureDate(lecture.date)} · Facilitador:{" "}
                            {lecture.speaker}
                          </p>
                        </div>
                        <span className="badge badge-orange">
                          {published.length} materiais
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {published.length ? (
                          published.map((material) => (
                            <div
                              key={material.id}
                              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                            >
                              <span className="card-icon bg-teal-soft text-brand-teal">
                                <Icon name="document" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-extrabold">
                                  {material.type}
                                </div>
                                <div className="mt-1 truncate text-[0.62rem] text-muted">
                                  {material.fileName}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  setSelectedLectureMaterial(material)
                                }
                                className="rounded-xl bg-blue-soft px-4 py-2.5 text-xs font-extrabold text-brand-blue"
                              >
                                Visualizar
                              </button>
                              <button
                                onClick={() =>
                                  downloadDocument(
                                    material.fileName,
                                    `${material.type.toUpperCase()}\n\nPalestra: ${lecture.title}\nFacilitador: ${lecture.speaker}\nArquivo: ${material.fileName}`,
                                  )
                                }
                                className="rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-extrabold text-white"
                              >
                                Baixar
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-xs text-muted">
                            O facilitador ainda não publicou materiais para este
                            encontro.
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })
              ) : (
                <div className="rounded-2xl bg-slate-50 p-8 text-center">
                  <Icon
                    name="folder"
                    className="mx-auto size-8 text-slate-300"
                  />
                  <div className="mt-3 text-xs font-extrabold">
                    Nenhuma palestra inscrita
                  </div>
                  <p className="mt-1 text-[0.65rem] text-muted">
                    Após se inscrever em uma palestra, os materiais publicados
                    aparecerão aqui.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
        {!readOnly && (
          <form
            onSubmit={submit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
          >
            <div className="flex items-center gap-4">
              <span className="card-icon bg-orange-soft text-brand-orange">
                <Icon name="plus" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold">Adicionar material</h2>
                <p className="mt-1 text-xs text-muted">
                  O conteúdo ficará disponível para os alunos da turma
                  selecionada.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label>
                <span className="field-label">Título do material</span>
                <input
                  name="title"
                  required
                  className="standalone-input"
                  placeholder="Ex.: Slides da aula 01"
                />
              </label>
              <label>
                <span className="field-label">Curso</span>
                <select
                  name="course"
                  value={publishingCourse}
                  onChange={(event) => setPublishingCourse(event.target.value)}
                  className="standalone-input"
                >
                  {courseData.map((course) => (
                    <option key={course.title}>{course.title}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="field-label">Turma</span>
                <select name="className" className="standalone-input">
                  {classData
                    .filter((item) => item.course === publishingCourse)
                    .map((item) => (
                      <option key={item.id}>{item.name}</option>
                    ))}
                </select>
              </label>
              <label>
                <span className="field-label">Tipo</span>
                <select
                  name="type"
                  value={materialType}
                  onChange={(event) => setMaterialType(event.target.value)}
                  className="standalone-input"
                >
                  <option>Slides</option>
                  <option>Trabalho</option>
                  <option>Estudo de caso</option>
                  <option>Prova</option>
                  <option>Vídeo</option>
                  <option>Material complementar</option>
                </select>
              </label>
              {["Prova", "Trabalho", "Estudo de caso"].includes(
                materialType,
              ) && (
                <label>
                  <span className="field-label">
                    {materialType === "Prova"
                      ? "Data de realização"
                      : "Data limite para entrega"}
                  </span>
                  <input
                    name="evaluationDate"
                    required
                    type="date"
                    className="standalone-input"
                  />
                </label>
              )}
              {materialType !== "Prova" && (
                <label className="block cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 xl:col-span-2">
                  <span className="field-label">
                    {materialType === "Vídeo" ? "Arquivo de vídeo" : "Arquivo"}
                  </span>
                  <input
                    name="file"
                    required
                    type="file"
                    accept={
                      materialType === "Vídeo"
                        ? "video/mp4,video/webm,video/quicktime"
                        : ".pdf,.ppt,.pptx,.doc,.docx"
                    }
                    className="block w-full text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-teal-soft file:px-3 file:py-2 file:text-xs file:font-bold file:text-teal-dark"
                  />
                  <span className="mt-2 block text-[0.62rem] text-muted">
                    {materialType === "Vídeo"
                      ? "Formatos aceitos: MP4, WebM ou MOV."
                      : "Formatos aceitos: PDF, PowerPoint ou Word."}
                  </span>
                </label>
              )}
              <button className="primary-button self-end xl:w-auto">
                Publicar material <Icon name="arrow" className="size-5" />
              </button>
            </div>
          </form>
        )}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-lg font-extrabold">Materiais publicados</h2>
              <p className="mt-1 text-xs text-muted">
                {visibleMaterials.length} itens disponíveis
              </p>
            </div>
            {readOnly && (
              <label className="block w-full max-w-xs">
                <span className="field-label">Selecionar curso</span>
                <select
                  value={materialCourseFilter}
                  onChange={(event) =>
                    setMaterialCourseFilter(event.target.value)
                  }
                  className="compact-input h-10"
                >
                  {courseData.map((course) => (
                    <option key={course.title}>{course.title}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="mt-5 space-y-3">
            {visibleMaterials.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center"
              >
                <span
                  className={`card-icon ${
                    item.type === "Prova"
                      ? "bg-orange-soft text-brand-orange"
                      : item.type === "Trabalho"
                        ? "bg-blue-soft text-brand-blue"
                        : "bg-teal-soft text-brand-teal"
                  }`}
                >
                  <Icon name="document" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold">{item.title}</div>
                  <div className="mt-1 truncate text-[0.62rem] text-muted">
                    {item.course} · {item.className} · {item.file} · {item.date}
                    {item.evaluationDate
                      ? ` · ${
                          item.type === "Prova" ? "Realização" : "Entrega"
                        }: ${new Date(`${item.evaluationDate}T12:00:00`).toLocaleDateString("pt-BR")}`
                      : ""}
                  </div>
                </div>
                <span className="badge badge-blue">{item.type}</span>
                <button
                  onClick={() => setSelectedMaterial(item)}
                  aria-label={`Visualizar ${item.title}`}
                  title={`Visualizar ${item.title}`}
                  className="rounded-lg p-2 text-muted hover:bg-slate-100"
                >
                  <Icon name={readOnly ? "eye" : "more"} className="size-4" />
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm">
          <section className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="badge badge-blue">
                  {selectedMaterial.type}
                </span>
                <h2 className="mt-3 text-2xl font-extrabold">
                  {selectedMaterial.title}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {selectedMaterial.className} · {selectedMaterial.file}
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
              {selectedMaterial.type === "Prova" ? (
                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                  <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-soft text-brand-orange">
                    <Icon name="calendar" className="size-8" />
                  </span>
                  <div className="mt-5 text-lg font-extrabold">
                    Prova agendada
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    Realização em{" "}
                    {new Date(
                      `${selectedMaterial.evaluationDate}T12:00:00`,
                    ).toLocaleDateString("pt-BR")}
                  </div>
                  <p className="mt-5 text-xs leading-5 text-muted">
                    Esta publicação é somente um aviso de data e não possui
                    arquivo anexado.
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                  <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-teal-soft text-brand-teal">
                    <Icon name="document" className="size-8" />
                  </span>
                  <div className="mt-5 text-sm font-extrabold">
                    {selectedMaterial.file}
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    Pré-visualização do material publicado
                  </div>
                  <div className="mx-auto mt-8 h-2 w-4/5 rounded bg-slate-100" />
                  <div className="mx-auto mt-3 h-2 w-3/5 rounded bg-slate-100" />
                  <div className="mx-auto mt-3 h-2 w-4/5 rounded bg-slate-100" />
                </div>
              )}
            </div>
            {selectedMaterial.type !== "Prova" && (
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() =>
                    downloadDocument(
                      selectedMaterial.title,
                      `MATERIAL ACADÊMICO\n\n${selectedMaterial.title}\nTurma: ${selectedMaterial.className}\nArquivo: ${selectedMaterial.file}`,
                    )
                  }
                  className="rounded-xl bg-brand-orange px-5 py-3 text-xs font-extrabold text-white"
                >
                  Baixar material
                </button>
              </div>
            )}
          </section>
        </div>
      )}
      {selectedLectureMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm">
          <section className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="badge badge-orange">Material de palestra</span>
                <h2 className="mt-3 text-2xl font-extrabold">
                  {selectedLectureMaterial.type}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {
                    mockLectures.find(
                      (lecture) =>
                        lecture.id === selectedLectureMaterial.lectureId,
                    )?.title
                  }{" "}
                  · {selectedLectureMaterial.fileName}
                </p>
              </div>
              <button
                onClick={() => setSelectedLectureMaterial(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 flex min-h-72 items-center justify-center rounded-2xl bg-slate-100 p-6">
              {selectedLectureMaterial.fileUrl &&
              selectedLectureMaterial.fileName
                .toLowerCase()
                .endsWith(".pdf") ? (
                <iframe
                  title={`Pré-visualização de ${selectedLectureMaterial.fileName}`}
                  src={selectedLectureMaterial.fileUrl}
                  className="h-96 w-full rounded-xl bg-white"
                />
              ) : (
                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                  <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-teal-soft text-brand-teal">
                    <Icon name="document" className="size-8" />
                  </span>
                  <div className="mt-5 text-sm font-extrabold">
                    {selectedLectureMaterial.fileName}
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    Material publicado pelo facilitador
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

export function ReportData({ type }: { type: string }) {
  const rows: Record<string, string[][]> = {
    "Projetos e cursos": projectData.map((project) => [
      project.name,
      project.status,
      project.period,
      `${project.courses} cursos`,
    ]),
    "Alunos cadastrados": mockRegistrationRequests
      .filter((item) => item.profile === "Aluno")
      .map((item) => [item.name, item.email, item.cpf, item.profession]),
    "Inscrições por curso": mockEnrollmentRequests.map((item) => [
      item.student,
      item.course,
      item.requested,
      item.status,
    ]),
    "Frequência consolidada": studentData.map(([name, enrollment], index) => [
      name,
      enrollment,
      classData[index % classData.length].name,
      index === 3 ? "72%" : `${88 + index}%`,
    ]),
    "Certificações emitidas": [
      ["Marina Alves", "Vigilância em Saúde", "92%", "Emitido"],
      ["João Pedro Lima", "Gestão em Saúde", "78%", "Aprovado"],
    ],
  }
  const headers: Record<string, string[]> = {
    "Projetos e cursos": ["Projeto", "Situação", "Período", "Cursos"],
    "Alunos cadastrados": ["Nome do aluno", "E-mail", "CPF", "Profissão"],
    "Inscrições por curso": ["Aluno", "Curso", "Solicitação", "Situação"],
    "Frequência consolidada": ["Aluno", "Matrícula", "Turma", "Frequência"],
    "Certificações emitidas": ["Aluno", "Curso", "Frequência", "Situação"],
  }
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[42rem]">
        <div className="grid grid-cols-4 gap-4 border-b-2 border-ink/10 px-3 pb-3 text-[0.62rem] font-extrabold uppercase tracking-wider text-ink">
          {(headers[type] ?? headers["Projetos e cursos"]).map((header) => (
            <span key={header}>{header}</span>
          ))}
        </div>
        {(rows[type] ?? rows["Projetos e cursos"]).map((row, index) => (
          <div
            key={`${row[0]}-${index}`}
            className="grid grid-cols-4 items-center gap-4 border-b border-slate-100 px-3 py-4 text-xs"
          >
            {row.map((cell, cellIndex) => (
              <span
                key={`${cell}-${cellIndex}`}
                className={cellIndex === 0 ? "font-extrabold" : "text-muted"}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminReportPreview({
  type,
  profession,
  status,
}: {
  type: string
  profession: string
  status: string
}) {
  const headers =
    type === "Projetos"
      ? ["Projeto", "Período", "Responsável", "Status"]
      : type === "Cursos"
        ? ["Curso", "Carga horária", "Vagas", "Status"]
        : type === "Alunos"
          ? ["Aluno", "CPF", "Profissão", "Status"]
          : type === "Desempenho e Certificação em Cursos"
            ? ["Turma", "Inscritos", "Concluintes", "Média da turma"]
            : ["Responsável", "Ação", "Data/Hora", "Status", "Justificativa"]
  const rows =
    type === "Projetos"
      ? projectData.map((item) => [
          item.name,
          item.period,
          item.responsible,
          item.status,
        ])
      : type === "Cursos"
        ? courseData.map((item) => [
            item.title,
            item.hours,
            `${item.vacancies}`,
            item.status,
          ])
        : type === "Alunos"
          ? studentData.map(([name], index) => [
              name,
              `1234567890${index}`.slice(0, 11),
              [
                "Enfermeiro",
                "Médico",
                "ACS",
                "Odontólogo",
                "Técnico de enfermagem",
              ][index],
              "Ativo",
            ])
          : type === "Desempenho e Certificação em Cursos"
            ? [
                ["Turma A", "42", "36", "8,4"],
                ["Turma B", "30", "24", "7,9"],
              ]
            : [
                [
                  "Renata Lima",
                  "Documento aprovado",
                  "12/11/2026 09:42",
                  "Homologado",
                  "Critérios atendidos",
                ],
                [
                  "Carla Souza",
                  "Certificado indeferido",
                  "13/11/2026 14:10",
                  "Indeferido",
                  "Frequência insuficiente",
                ],
              ]
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="badge badge-blue">Profissão: {profession}</span>
        <span className="badge badge-orange">Status: {status}</span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[48rem]">
          {[headers, ...rows].map((row, index) => (
            <div
              key={index}
              className={`grid gap-4 px-4 py-3 text-xs ${
                index === 0
                  ? "rounded-t-xl bg-slate-50 font-extrabold uppercase"
                  : "border-b border-slate-100"
              }`}
              style={{
                gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
              }}
            >
              {row.map((cell) => (
                <span key={cell}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReportsPage({ profile }: { profile: Profile }) {
  const [reports, setReports] = useState([
    { id: 1, name: "Inscrições por curso", date: "27 ago 2024", format: "PDF" },
    {
      id: 2,
      name: "Frequência consolidada",
      date: "20 ago 2024",
      format: "PDF",
    },
  ])
  const [type, setType] = useState(
    profile === "Administrador" ? "Projetos" : "Projetos e cursos",
  )
  const [periodMode, setPeriodMode] = useState("Competência")
  const [profession, setProfession] = useState("Todos")
  const [reportStatus, setReportStatus] = useState("Todos")
  const [selectedReport, setSelectedReport] =
    useState<typeof reports[number] | null>(null)

  function generate(event: FormEvent) {
    event.preventDefault()
    setReports((current) => [
      {
        id: Date.now(),
        name: type,
        date: new Intl.DateTimeFormat("pt-BR").format(new Date()),
        format: "PDF",
      },
      ...current,
    ])
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Dados institucionais"
        title="Relatórios"
        description="Gere informações consolidadas sobre projetos, cursos, alunos, inscrições, frequência e certificações."
        action={
          <span className="badge badge-blue">
            {profile === "Administrador"
              ? "Administrador"
              : "Coordenação e Secretaria"}
          </span>
        }
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form
          onSubmit={generate}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
        >
          <span className="card-icon bg-blue-soft text-brand-blue">
            <Icon name="grid" />
          </span>
          <h2 className="mt-5 text-lg font-extrabold">Gerar novo relatório</h2>
          <p className="mt-1 text-xs text-muted">
            Selecione os dados e o período desejado.
          </p>
          <label className="mt-6 block">
            <span className="field-label">Tipo de relatório</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="standalone-input"
            >
              {profile === "Administrador" ? (
                <>
                  <option>Projetos</option>
                  <option>Cursos</option>
                  <option>Alunos</option>
                  <option>Desempenho e Certificação em Cursos</option>
                  <option>Log de Auditoria e Homologação</option>
                </>
              ) : (
                <>
                  <option>Projetos e cursos</option>
                  <option>Alunos cadastrados</option>
                  <option>Inscrições por curso</option>
                  <option>Frequência consolidada</option>
                  <option>Certificações emitidas</option>
                </>
              )}
            </select>
          </label>
          {profile === "Administrador" && (
            <label className="mt-4 block">
              <span className="field-label">Recorte temporal</span>
              <select
                value={periodMode}
                onChange={(event) => setPeriodMode(event.target.value)}
                className="standalone-input"
              >
                <option>Competência</option>
                <option>Intervalo personalizado</option>
              </select>
            </label>
          )}
          {periodMode === "Competência" && profile === "Administrador" ? (
            <label className="mt-4 block">
              <span className="field-label">Mês/Ano</span>
              <input required type="month" className="standalone-input" />
            </label>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label>
                <span className="field-label">De</span>
                <input required type="date" className="standalone-input" />
              </label>
              <label>
                <span className="field-label">Até</span>
                <input required type="date" className="standalone-input" />
              </label>
            </div>
          )}
          {profile === "Administrador" && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label>
                <span className="field-label">
                  Perfil profissional e vínculo
                </span>
                <select
                  value={profession}
                  onChange={(event) => setProfession(event.target.value)}
                  className="standalone-input"
                >
                  <option>Todos</option>
                  {[
                    "Médico",
                    "Enfermeiro",
                    "Técnico",
                    "ACS",
                    "Odontólogo",
                    "ACE",
                    "Técnico de enfermagem",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="field-label">Status</span>
                <select
                  value={reportStatus}
                  onChange={(event) => setReportStatus(event.target.value)}
                  className="standalone-input"
                >
                  <option>Todos</option>
                  <option>Homologado</option>
                  <option>Pendente</option>
                  <option>Indeferido</option>
                  <option>Concluído</option>
                  <option>Em andamento</option>
                </select>
              </label>
            </div>
          )}
          <button type="submit" className="primary-button mt-6">
            Gerar relatório <Icon name="arrow" className="size-5" />
          </button>
        </form>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-extrabold">Relatórios recentes</h2>
          <div className="mt-5 space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
              >
                <span className="card-icon bg-orange-soft text-brand-orange">
                  <Icon name="document" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-extrabold">
                    {report.name}
                  </div>
                  <div className="mt-1 text-[0.65rem] text-muted">
                    Gerado em {report.date} · {report.format}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(report)}
                  className="rounded-xl bg-blue-soft px-4 py-2.5 text-xs font-bold text-brand-blue"
                >
                  Visualizar
                </button>
                <button
                  onClick={() =>
                    setReports((current) =>
                      current.filter((item) => item.id !== report.id),
                    )
                  }
                  className="rounded-xl bg-orange-soft px-4 py-2.5 text-xs font-bold text-brand-orange"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div>
          <h2 className="text-lg font-extrabold">Prévia — {type}</h2>
          <p className="mt-1 text-xs text-muted">
            Informações encontradas para o tipo de relatório selecionado.
          </p>
        </div>
        <div className="mt-5">
          {profile === "Administrador" ? (
            <AdminReportPreview
              type={type}
              profession={profession}
              status={reportStatus}
            />
          ) : (
            <ReportData type={type} />
          )}
        </div>
        {profile === "Administrador" && (
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <button
              onClick={() =>
                downloadExport(
                  type,
                  `servidor,perfil,status\nAna Beatriz,${profession},${reportStatus}`,
                  "csv",
                )
              }
              className="rounded-xl bg-teal-soft px-4 py-3 text-xs font-extrabold text-teal-dark"
            >
              Exportar CSV
            </button>
            <button
              onClick={() =>
                downloadExport(
                  type,
                  `PLANILHA ESPFOR\n${type}\nProfissão: ${profession}\nStatus: ${reportStatus}`,
                  "xlsx",
                )
              }
              className="rounded-xl bg-blue-soft px-4 py-3 text-xs font-extrabold text-brand-blue"
            >
              Exportar Excel (.xlsx)
            </button>
            <button
              onClick={() =>
                downloadExport(
                  type,
                  `PREFEITURA DE FORTALEZA / SMS / ESPFOR\n\n${type}\nEmitido em ${new Intl.DateTimeFormat("pt-BR").format(new Date())}\nAdministrador responsável\n\nProfissão: ${profession}\nStatus: ${reportStatus}`,
                  "pdf",
                )
              }
              className="rounded-xl bg-brand-orange px-4 py-3 text-xs font-extrabold text-white"
            >
              PDF Institucional
            </button>
          </div>
        )}
      </section>
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm">
          <section className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">
                  Relatório gerado
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {selectedReport.name}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Gerado em {selectedReport.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="self-start rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6">
              {profile === "Administrador" ? (
                <AdminReportPreview
                  type={selectedReport.name}
                  profession={profession}
                  status={reportStatus}
                />
              ) : (
                <ReportData type={selectedReport.name} />
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  downloadDocument(
                    selectedReport.name,
                    `RELATÓRIO: ${selectedReport.name}\nGerado em ${selectedReport.date}\n\nDados consolidados do Sistema de Gestão Educacional ESPFOR.`,
                  )
                }
                className="rounded-xl bg-brand-orange px-5 py-3 text-xs font-extrabold text-white"
              >
                Baixar em PDF
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export function StudentsPage() {
  const [registrations, setRegistrations] = useState(() => [
    ...mockRegistrationRequests,
  ])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const pendingIds = registrations
    .filter((item) => item.status === "Pendente")
    .map((item) => item.id)
  const updateStatus = (ids: number[], status: RegistrationStatus) => {
    mockRegistrationRequests.forEach((request) => {
      if (ids.includes(request.id)) {
        request.status = status
        if (status === "Aprovado")
          mockEmailNotifications.push({
            email: request.email,
            subject: "Cadastro ESPFOR aprovado",
            message: "Cadastro no sistema ESPFOR aprovado, realize o login.",
          })
      }
    })
    setRegistrations((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, status } : item,
      ),
    )
    setSelectedIds(new Set())
  }
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Gestão de identidades"
        title="Usuários e acessos"
        description="Analise as solicitações de cadastro antes de liberar o acesso ao sistema."
        action={<span className="badge badge-blue">Visão do coordenador</span>}
      />
      <section className="mt-8 rounded-3xl border border-brand-orange/15 bg-orange-soft/50 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-extrabold">
              Cadastros aguardando validação
            </h2>
            <p className="mt-1 text-xs text-muted">
              Confirme a identidade e o perfil solicitado antes de liberar o
              acesso ao sistema.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold">
              <input
                type="checkbox"
                checked={
                  pendingIds.length > 0 &&
                  pendingIds.every((id) => selectedIds.has(id))
                }
                onChange={(event) =>
                  setSelectedIds(
                    event.target.checked ? new Set(pendingIds) : new Set(),
                  )
                }
                className="size-4 accent-[var(--color-brand-teal)]"
              />
              Marcar todos pendentes
            </label>
            <button
              disabled={!selectedIds.size}
              onClick={() => updateStatus([...selectedIds], "Aprovado")}
              className="rounded-xl bg-brand-teal px-4 py-2.5 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Aprovar selecionados
            </button>
            <button
              disabled={!selectedIds.size}
              onClick={() => updateStatus([...selectedIds], "Recusado")}
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-brand-orange disabled:cursor-not-allowed disabled:opacity-40"
            >
              Recusar selecionados
            </button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {registrations.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl bg-white p-4 ring-2 transition ${
                selectedIds.has(item.id)
                  ? "ring-brand-teal"
                  : "ring-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                {item.status === "Pendente" && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={(event) =>
                      setSelectedIds((current) => {
                        const next = new Set(current)
                        event.target.checked
                          ? next.add(item.id)
                          : next.delete(item.id)
                        return next
                      })
                    }
                    className="mt-0.5 size-4 accent-[var(--color-brand-teal)]"
                  />
                )}
                <div className="text-[0.68rem] leading-5 text-muted">
                  <div>
                    <strong className="text-ink">Nome:</strong> {item.name}
                  </div>
                  <div>
                    <strong className="text-ink">Email:</strong> {item.email}
                  </div>
                  <div>
                    <strong className="text-ink">CPF:</strong> {item.cpf}
                  </div>
                  <div>
                    <strong className="text-ink">Perfil:</strong> {item.profile}
                  </div>
                  <div>
                    <strong className="text-ink">Profissão:</strong>{" "}
                    {item.profession}
                  </div>
                </div>
              </div>
              {item.status === "Pendente" ? (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => updateStatus([item.id], "Aprovado")}
                    className="rounded-lg bg-brand-teal px-3 py-2 text-[0.62rem] font-bold text-white"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => updateStatus([item.id], "Recusado")}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-[0.62rem] font-bold text-muted"
                  >
                    Recusar
                  </button>
                </div>
              ) : (
                <span
                  className={`badge mt-4 inline-flex ${
                    item.status === "Aprovado" ? "badge-teal" : "badge-orange"
                  }`}
                >
                  {item.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function SettingsPage({
  user,
  onUpdate,
}: {
  user: SessionUser
  onUpdate: (user: SessionUser) => void
}) {
  const [name, setName] = useState(user.name)
  const [saved, setSaved] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(
    document.documentElement.dataset.theme === "dark",
  )
  function submit(event: FormEvent) {
    event.preventDefault()
    onUpdate({ ...user, name })
    setSaved(true)
  }
  return (
    <div className="mx-auto max-w-4xl">
      <style>{`html[data-theme="dark"] body{background:#10222f;color:#f8fafc}html[data-theme="dark"] .bg-white{background-color:#1b3040!important}html[data-theme="dark"] .bg-canvas,html[data-theme="dark"] .bg-slate-50,html[data-theme="dark"] .bg-slate-100{background-color:#142936!important}html[data-theme="dark"] .text-ink{color:#f8fafc!important}html[data-theme="dark"] .text-muted{color:#a9bac5!important}html[data-theme="dark"] .border-slate-200,html[data-theme="dark"] .border-slate-100{border-color:#304958!important}`}</style>
      <PageHeading
        eyebrow="Minha conta"
        title="Configurações do perfil"
        description="Atualize seus dados pessoais, preferências e informações de acesso."
        action={<span className="badge badge-teal">{user.profile}</span>}
      />
      <form
        onSubmit={submit}
        className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
      >
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <span className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-teal-soft text-xl font-extrabold text-brand-teal">
            {photo ? (
              <img
                src={photo}
                alt={`Foto de ${user.name}`}
                className="size-full object-cover"
              />
            ) : (
              user.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
            )}
          </span>
          <div>
            <h2 className="text-lg font-extrabold">{user.name}</h2>
            <p className="mt-1 text-xs text-muted">
              {user.profile} · Conta ativa
            </p>
          </div>
          <label className="ml-auto cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-ink">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) setPhoto(URL.createObjectURL(file))
              }}
            />
            Atualizar foto
          </label>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label>
            <span className="field-label">Nome completo</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="standalone-input"
            />
          </label>
          <label>
            <span className="field-label">E-mail</span>
            <input
              type="email"
              defaultValue={`${user.name.toLowerCase().replace(/\s+/g, ".")}@esfor.edu.br`}
              className="standalone-input"
            />
          </label>
          <label>
            <span className="field-label">Telefone</span>
            <input placeholder="(85) 99999-9999" className="standalone-input" />
          </label>
          <label>
            <span className="field-label">Perfil de acesso</span>
            <input
              disabled
              value={user.profile}
              className="standalone-input opacity-60"
            />
          </label>
        </div>
        <div className="mt-7 flex items-center justify-end gap-4">
          {saved && (
            <span className="text-xs font-bold text-teal-dark">
              Alterações salvas
            </span>
          )}
          <button className="primary-button sm:w-auto">
            Salvar alterações <Icon name="check" className="size-5" />
          </button>
        </div>
      </form>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h2 className="text-base font-extrabold">Aparência</h2>
            <p className="mt-1 text-xs text-muted">
              Escolha entre o modo claro e o modo escuro.
            </p>
          </div>
          <button
            onClick={() => {
              const next = !darkMode
              setDarkMode(next)
              document.documentElement.dataset.theme = next ? "dark" : "light"
            }}
            className={`flex h-11 items-center gap-3 rounded-full px-4 text-xs font-extrabold ${
              darkMode ? "bg-ink text-white" : "bg-slate-100 text-ink"
            }`}
          >
            <span
              className={`size-5 rounded-full ${
                darkMode ? "bg-brand-orange" : "bg-brand-teal"
              }`}
            />
            {darkMode ? "Modo escuro" : "Modo claro"}
          </button>
        </div>
      </section>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-base font-extrabold">Segurança</h2>
        <div className="mt-4 flex flex-col justify-between gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-xs font-bold">Senha de acesso</div>
            <div className="mt-1 text-[0.65rem] text-muted">
              Última alteração há 45 dias
            </div>
          </div>
          <button className="secondary-button h-10 text-xs">
            Alterar senha
          </button>
        </div>
      </section>
    </div>
  )
}

export function AdminUserManagementPage() {
  const [managers, setManagers] = useState([
    {
      id: 1,
      name: "Carla Souza",
      email: "carla@espfor.fortaleza.ce.gov.br",
      profile: "Coordenador",
      temporaryPassword: "Alterada",
      status: "Ativa",
    },
    {
      id: 2,
      name: "Renata Lima",
      email: "renata@espfor.fortaleza.ce.gov.br",
      profile: "Secretária",
      temporaryPassword: "Alterada",
      status: "Ativa",
    },
  ])
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Administração de acessos"
        title="Gestão de Usuários"
        description="Crie e gerencie contas institucionais, perfis de acesso e credenciais de Coordenadores, Secretárias e Administradores."
        action={<span className="badge badge-orange">Administrador</span>}
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            setManagers((current) => [
              ...current,
              {
                id: Date.now(),
                name: String(form.get("name")),
                email: String(form.get("email")),
                profile: String(form.get("profile")),
                temporaryPassword: String(form.get("temporaryPassword")),
                status: "Ativa",
              },
            ])
            ;(event.currentTarget as HTMLFormElement).reset()
          }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
        >
          <h2 className="text-lg font-extrabold">Criar conta institucional</h2>
          <div className="mt-5 space-y-3">
            <input
              name="name"
              required
              className="standalone-input"
              placeholder="Nome completo"
            />
            <input
              name="email"
              required
              type="email"
              className="standalone-input"
              placeholder="E-mail institucional"
            />
            <select name="profile" className="standalone-input">
              <option>Coordenador</option>
              <option>Secretária</option>
              <option>Administrador</option>
            </select>
            <input
              name="temporaryPassword"
              required
              minLength={8}
              className="standalone-input"
              placeholder="Senha provisória"
            />
            <button className="primary-button">Criar conta</button>
          </div>
        </form>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-extrabold">
            Usuários e perfis de acesso
          </h2>
          <div className="mt-5 space-y-3">
            {managers.map((manager) => (
              <div
                key={manager.id}
                className="rounded-2xl border border-slate-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="card-icon bg-blue-soft text-brand-blue">
                    <Icon name="user" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold">{manager.name}</div>
                    <div className="mt-1 truncate text-[0.62rem] text-muted">
                      {manager.email} · {manager.profile} · Senha:{" "}
                      {manager.temporaryPassword}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      manager.status === "Ativa" ? "badge-teal" : "badge-orange"
                    }`}
                  >
                    {manager.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setManagers((current) =>
                        current.map((item) =>
                          item.id === manager.id
                            ? {
                                ...item,
                                status:
                                  item.status === "Ativa"
                                    ? "Suspensa"
                                    : "Ativa",
                              }
                            : item,
                        ),
                      )
                    }
                    className="rounded-lg bg-slate-100 px-3 py-2 text-[0.62rem] font-bold"
                  >
                    {manager.status === "Ativa" ? "Suspender" : "Ativar"}
                  </button>
                  <button
                    onClick={() =>
                      setManagers((current) =>
                        current.map((item) =>
                          item.id === manager.id
                            ? {
                                ...item,
                                temporaryPassword: `Temp${Date.now().toString().slice(-5)}`,
                              }
                            : item,
                        ),
                      )
                    }
                    className="rounded-lg bg-blue-soft px-3 py-2 text-[0.62rem] font-bold text-brand-blue"
                  >
                    Redefinir credenciais
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-extrabold">Suporte técnico de acesso</h2>
        <p className="mt-2 text-xs leading-5 text-muted">
          Atenda solicitações de recuperação de senha, problemas de login e
          atualização de dados cadastrais.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge badge-orange">3 recuperações pendentes</span>
          <span className="badge badge-blue">1 atualização cadastral</span>
        </div>
      </section>
    </div>
  )
}

export function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState("Todas as ações")
  const [userQuery, setUserQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const visibleLogs = mockAuditLogs.filter(
    (log) =>
      (actionFilter === "Todas as ações" || log.action === actionFilter) &&
      (!userQuery ||
        `${log.user} ${log.profile}`
          .toLocaleLowerCase("pt-BR")
          .includes(userQuery.toLocaleLowerCase("pt-BR"))) &&
      (!dateFilter || log.date === dateFilter),
  )
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Governança e segurança"
        title="Logs de Auditoria"
        description="Consulte o histórico das ações críticas realizadas pelos perfis responsáveis na plataforma."
        action={
          <span className="badge badge-orange">
            {visibleLogs.length} registros encontrados
          </span>
        }
      />
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-center gap-3">
          <span className="card-icon bg-blue-soft text-brand-blue">
            <Icon name="search" />
          </span>
          <div>
            <h2 className="text-base font-extrabold">Filtros de auditoria</h2>
            <p className="mt-1 text-xs text-muted">
              Refine os registros por ação, responsável ou data.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label>
            <span className="field-label">Tipo de ação</span>
            <select
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
              className="standalone-input"
            >
              <option>Todas as ações</option>
              <option>Aprovação de Cadastro</option>
              <option>Validação de Documento</option>
              <option>Emissão de Certificado</option>
            </select>
          </label>
          <label>
            <span className="field-label">Buscar por usuário</span>
            <span className="input-shell">
              <Icon name="search" className="size-4 text-muted" />
              <input
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value)}
                className="form-input"
                placeholder="Nome ou perfil responsável"
              />
            </span>
          </label>
          <label>
            <span className="field-label">Data</span>
            <input
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              type="date"
              className="standalone-input"
            />
          </label>
        </div>
      </section>
      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold">Histórico de atividades</h2>
            <p className="mt-1 text-xs text-muted">
              Trilha de auditoria administrativa e acadêmica.
            </p>
          </div>
          {(actionFilter !== "Todas as ações" || userQuery || dateFilter) && (
            <button
              onClick={() => {
                setActionFilter("Todas as ações")
                setUserQuery("")
                setDateFilter("")
              }}
              className="self-start rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold"
            >
              Limpar filtros
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[64rem]">
            <div className="grid grid-cols-[0.8fr_1fr_1fr_1.7fr_0.6fr] gap-4 bg-slate-50 px-6 py-4 text-[0.6rem] font-extrabold uppercase tracking-wider text-muted">
              <span>Data/Hora</span>
              <span>Usuário Responsável</span>
              <span>Ação Realizada</span>
              <span>Alvo / Detalhes</span>
              <span>Status</span>
            </div>
            {visibleLogs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-[0.8fr_1fr_1fr_1.7fr_0.6fr] items-center gap-4 border-t border-slate-100 px-6 py-4 text-xs"
              >
                <div>
                  <strong>
                    {new Date(`${log.date}T12:00:00`).toLocaleDateString(
                      "pt-BR",
                    )}
                  </strong>
                  <div className="mt-1 text-[0.62rem] text-muted">
                    {log.time}
                  </div>
                </div>
                <div>
                  <strong>{log.user}</strong>
                  <div className="mt-1 text-[0.62rem] text-muted">
                    {log.profile}
                  </div>
                </div>
                <span className="font-semibold">{log.action}</span>
                <span className="leading-5 text-muted">{log.details}</span>
                <span
                  className={`badge justify-self-start ${
                    ["Concluído", "Validado", "Emitido"].includes(log.status)
                      ? "badge-teal"
                      : "badge-orange"
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
            {!visibleLogs.length && (
              <div className="p-12 text-center text-xs text-muted">
                Nenhum registro corresponde aos filtros selecionados.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export function ManagementReportsPage() {
  const [startInput, setStartInput] = useState("2024-01-01")
  const [endInput, setEndInput] = useState("2026-12-31")
  const [period, setPeriod] = useState({
    start: "2024-01-01",
    end: "2026-12-31",
  })
  const [exportOpen, setExportOpen] = useState(false)
  const activities = [
    ...courseData.map((course) => ({
      name: course.title,
      type: "Curso",
      start: course.start,
      end: course.end,
      participants: course.students,
      status: course.status,
    })),
    ...mockLectures.map((lecture) => ({
      name: lecture.title,
      type: "Palestra",
      start: lecture.date,
      end: lecture.date,
      participants: lecture.participants.filter(
        (participant) => participant.role === "Aluno",
      ).length,
      status: lecture.certificatesIssued ? "Concluída" : "Programada",
    })),
  ].filter(
    (activity) => activity.end >= period.start && activity.start <= period.end,
  )
  const activeCourses = courseData.filter(
    (course) =>
      course.status === "Ativo" &&
      course.end >= period.start &&
      course.start <= period.end,
  ).length
  const lecturesInPeriod = mockLectures.filter(
    (lecture) => lecture.date >= period.start && lecture.date <= period.end,
  ).length
  const enrolledStudents = new Set([
    ...studentData.map(([name]) => name),
    ...mockEnrollmentRequests
      .filter((request) => request.status === "Aprovada")
      .map((request) => request.student),
  ]).size
  const issuedCertificates =
    415 +
    mockLectures
      .filter((lecture) => lecture.certificatesIssued)
      .reduce(
        (total, lecture) =>
          total +
          lecture.participants.filter((participant) => participant.present)
            .length,
        0,
      )
  const reportContent = activities
    .map(
      (activity) =>
        `${activity.name},${activity.type},${activity.start},${activity.end},${activity.participants},${activity.status}`,
    )
    .join("\n")
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Inteligência institucional"
        title="Relatórios Gerenciais"
        description="Acompanhe indicadores consolidados de cursos, palestras, matrículas e certificações."
        action={
          <span className="badge badge-blue">Visão do Administrador</span>
        }
      />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setPeriod({ start: startInput, end: endInput })
        }}
        className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-base font-extrabold">Período do relatório</h2>
            <p className="mt-1 text-xs text-muted">
              Defina o intervalo para consolidar os indicadores.
            </p>
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_1fr_auto] lg:max-w-2xl">
            <label>
              <span className="field-label">Data Inicial</span>
              <input
                value={startInput}
                onChange={(event) => setStartInput(event.target.value)}
                required
                type="date"
                className="standalone-input"
              />
            </label>
            <label>
              <span className="field-label">Data Final</span>
              <input
                value={endInput}
                onChange={(event) => setEndInput(event.target.value)}
                min={startInput}
                required
                type="date"
                className="standalone-input"
              />
            </label>
            <button className="primary-button self-end sm:w-auto">
              <Icon name="search" className="size-4" /> Filtrar
            </button>
          </div>
        </div>
      </form>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [
            String(activeCourses).padStart(2, "0"),
            "Total de Cursos Ativos",
            "book",
            "orange",
          ],
          [
            String(lecturesInPeriod).padStart(2, "0"),
            "Total de Palestras Realizadas",
            "calendar",
            "teal",
          ],
          [
            String(enrolledStudents).padStart(2, "0"),
            "Total de Alunos Matriculados",
            "students",
            "blue",
          ],
          [
            String(issuedCertificates),
            "Total de Certificados Emitidos",
            "certificate",
            "orange",
          ],
        ].map(([value, label, icon, color]) => (
          <article
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
          >
            <span
              className={`card-icon ${
                color === "orange"
                  ? "bg-orange-soft text-brand-orange"
                  : color === "teal"
                    ? "bg-teal-soft text-brand-teal"
                    : "bg-blue-soft text-brand-blue"
              }`}
            >
              <Icon name={icon as IconName} />
            </span>
            <div>
              <div className="text-2xl font-extrabold">{value}</div>
              <div className="mt-1 text-xs font-semibold leading-5 text-muted">
                {label}
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold">
              Resumo por curso e atividade
            </h2>
            <p className="mt-1 text-xs text-muted">
              {activities.length} atividades no período de{" "}
              {new Date(`${period.start}T12:00:00`).toLocaleDateString("pt-BR")}{" "}
              a {new Date(`${period.end}T12:00:00`).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setExportOpen((open) => !open)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-orange px-5 text-xs font-extrabold text-white"
            >
              Exportar Relatório (PDF/CSV){" "}
              <Icon
                name="chevron"
                className={`size-4 transition ${
                  exportOpen ? "-rotate-90" : "rotate-90"
                }`}
              />
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-14 z-10 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <button
                  onClick={() => {
                    downloadExport(
                      "relatorio-gerencial",
                      `PREFEITURA DE FORTALEZA / SMS / ESPFOR\nRELATÓRIO GERENCIAL\nPeríodo: ${period.start} a ${period.end}\n\n${reportContent}`,
                      "pdf",
                    )
                    setExportOpen(false)
                  }}
                  className="w-full rounded-xl px-3 py-3 text-left text-xs font-bold hover:bg-orange-soft"
                >
                  Exportar em PDF
                </button>
                <button
                  onClick={() => {
                    downloadExport(
                      "relatorio-gerencial",
                      `Atividade,Tipo,Data inicial,Data final,Participantes,Status\n${reportContent}`,
                      "csv",
                    )
                    setExportOpen(false)
                  }}
                  className="w-full rounded-xl px-3 py-3 text-left text-xs font-bold hover:bg-teal-soft"
                >
                  Exportar em CSV
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[50rem]">
            <div className="grid grid-cols-[1.5fr_0.7fr_1fr_0.7fr_0.7fr] gap-4 bg-slate-50 px-6 py-4 text-[0.6rem] font-extrabold uppercase tracking-wider text-muted">
              <span>Curso / Atividade</span>
              <span>Tipo</span>
              <span>Período</span>
              <span>Participantes</span>
              <span>Status</span>
            </div>
            {activities.map((activity) => (
              <div
                key={`${activity.type}-${activity.name}`}
                className="grid grid-cols-[1.5fr_0.7fr_1fr_0.7fr_0.7fr] items-center gap-4 border-t border-slate-100 px-6 py-4 text-xs"
              >
                <strong>{activity.name}</strong>
                <span>{activity.type}</span>
                <span className="text-muted">
                  {new Date(`${activity.start}T12:00:00`).toLocaleDateString(
                    "pt-BR",
                  )}
                  {activity.end !== activity.start
                    ? ` — ${new Date(`${activity.end}T12:00:00`).toLocaleDateString("pt-BR")}`
                    : ""}
                </span>
                <span>{activity.participants}</span>
                <span
                  className={`badge justify-self-start ${
                    ["Ativo", "Concluído", "Concluída"].includes(
                      activity.status,
                    )
                      ? "badge-teal"
                      : "badge-blue"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
            {!activities.length && (
              <div className="p-12 text-center text-xs text-muted">
                Nenhuma atividade encontrada no período selecionado.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export function SystemSettingsPage() {
  const [saved, setSaved] = useState(false)
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Governança da plataforma"
        title="Configuração geral"
        description="Controle parâmetros institucionais, contas administrativas, segurança e regras acadêmicas."
        action={<span className="badge badge-orange">Administrador</span>}
      />
      <div className="mt-8">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSaved(true)
          }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
        >
          <h2 className="text-lg font-extrabold">Parâmetros institucionais</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="field-label">Nome da instituição</span>
              <input
                defaultValue="Escola de Saúde Pública de Fortaleza"
                className="standalone-input"
              />
            </label>
            <label>
              <span className="field-label">E-mail de suporte</span>
              <input
                defaultValue="espfor@sms.fortaleza.ce.gov.br"
                className="standalone-input"
              />
            </label>
            <label>
              <span className="field-label">Telefone</span>
              <input
                defaultValue="0800.285.0880"
                className="standalone-input"
              />
            </label>
            <label>
              <span className="field-label">Frequência mínima</span>
              <input
                type="number"
                defaultValue="75"
                className="standalone-input"
              />
            </label>
            <label>
              <span className="field-label">Média mínima</span>
              <input
                type="number"
                step="0.1"
                defaultValue="7.0"
                className="standalone-input"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Tempo de expiração da sessão</span>
              <select className="standalone-input">
                <option>30 minutos</option>
                <option>1 hora</option>
                <option>4 horas</option>
              </select>
            </label>
          </div>
          <div className="mt-6 flex items-center justify-end gap-4">
            {saved && (
              <span className="text-xs font-bold text-teal-dark">
                Configurações salvas
              </span>
            )}
            <button className="primary-button sm:w-auto">
              Salvar parâmetros
            </button>
          </div>
        </form>
      </div>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          [
            "Segurança e auditoria",
            "Logs de acesso, tentativas inválidas e alterações críticas.",
            "lock",
          ],
          [
            "Integrações",
            "E-mail, armazenamento de arquivos e serviços institucionais.",
            "grid",
          ],
          [
            "Políticas acadêmicas",
            "Critérios padrão de frequência, nota e certificação.",
            "certificate",
          ],
        ].map(([title, description, icon]) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
          >
            <span className="card-icon bg-teal-soft text-brand-teal">
              <Icon name={icon as IconName} />
            </span>
            <h3 className="mt-4 text-sm font-extrabold">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted">{description}</p>
          </article>
        ))}
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        {[
          [
            "Monitoramento",
            "Acompanhe disponibilidade, integrações, capacidade de suporte e indicadores operacionais em tempo real.",
            "100% dos serviços operacionais",
          ],
          [
            "Relatórios",
            "Configure parâmetros institucionais para extrações de adesão, evasão, desempenho e conclusão.",
            "Indicadores ESPFOR e CORES",
          ],
          [
            "Segurança",
            "Aplique retenção, privacidade LGPD, integridade dos dados e trilhas de auditoria administrativa.",
            "LGPD monitorada · Auditoria ativa",
          ],
        ].map(([title, description, indicator]) => (
          <article
            key={title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
          >
            <h2 className="text-lg font-extrabold">{title}</h2>
            <p className="mt-3 text-xs leading-5 text-muted">{description}</p>
            <div className="mt-5 rounded-xl bg-teal-soft p-3 text-xs font-extrabold text-teal-dark">
              {indicator}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
