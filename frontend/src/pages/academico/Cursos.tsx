import { FormEvent, useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeading } from "../../components/PageHeading"
import {
  classData,
  courseData,
  mockClassRosters,
  mockEnrollmentPeriods,
  mockEnrollmentRequests,
} from "../../data/mockData"
import { Course, IconName } from "../../types"
import { projectStatus } from "../../utils/helpers"

export function Cursos() {
  const [showForm, setShowForm] = useState(false)
  const [association, setAssociation] = useState<"project" | "standalone">(
    "project",
  )
  const [courses, setCourses] = useState(() => [...courseData])
  const [courseTab, setCourseTab] = useState<"all" | "active">("all")
  const [selectedCourse, setSelectedCourse] =
    useState<typeof courseData[number] | null>(null)
  const [expandedClass, setExpandedClass] = useState<number | null>(null)
  const [showEnrollmentPeriodModal, setShowEnrollmentPeriodModal] =
    useState(false)
  const [editingCourse, setEditingCourse] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    const form = new FormData(event.currentTarget as HTMLFormElement)
    const course: Course = {
      title: String(form.get("title")),
      project:
        association === "project"
          ? String(form.get("project"))
          : "Curso avulso",
      hours: `${String(form.get("hours"))}h`,
      classes: 0,
      students: 0,
      vacancies: Number(form.get("vacancies")),
      type: association === "project" ? "Projeto" : "Avulso",
      status:
        projectStatus(
          String(form.get("courseStart")),
          String(form.get("courseEnd")),
        ) === "Em andamento"
          ? "Ativo"
          : projectStatus(
                String(form.get("courseStart")),
                String(form.get("courseEnd")),
              ) === "Concluído"
            ? "Concluído"
            : "Planejamento",
      schedule: `${form.getAll("courseDays").join(" e ")} · ${String(form.get("startTime"))}–${String(form.get("endTime"))}`,
      start: String(form.get("courseStart")),
      end: String(form.get("courseEnd")),
    }
    setCourses((current) =>
      current.some(
        (item) =>
          item.title.toLocaleLowerCase("pt-BR") ===
          course.title.toLocaleLowerCase("pt-BR"),
      )
        ? current
        : [course, ...current],
    )
    if (
      !courseData.some(
        (item) =>
          item.title.toLocaleLowerCase("pt-BR") ===
          course.title.toLocaleLowerCase("pt-BR"),
      )
    ) {
      courseData.unshift(course)
    }
    setSelectedCourse(course)
    setShowForm(false)
  }

  const visibleCourses =
    courseTab === "active"
      ? courses.filter((course) => course.status === "Ativo")
      : courses
  const courseSummary: [string, string, IconName, string][] = [
    ["12", "Cursos ativos", "book", "orange"],
    ["06", "Turmas abertas", "users", "teal"],
    ["284", "Alunos inscritos", "students", "blue"],
  ]

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Catálogo de capacitações"
        title="Cursos"
        description="Estruture as capacitações, organize turmas e disponibilize novas oportunidades para os alunos."
        action={
          <button
            onClick={() => {
              const next = !showForm
              setShowForm(next)
              if (next) {
                setTimeout(
                  () =>
                    document
                      .getElementById("formulario-novo-curso")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                  50,
                )
              }
            }}
            className="primary-button self-start sm:w-auto sm:self-auto"
          >
            <Icon name={showForm ? "chevron" : "plus"} className="size-5" />
            {showForm ? "Fechar formulário" : "Novo curso"}
          </button>
        }
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {courseSummary.map(([value, label, icon, color]) => (
          <div
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
              <Icon name={icon} />
            </span>
            <div>
              <div className="text-2xl font-extrabold">{value}</div>
              <div className="text-xs font-semibold text-muted">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form
          id="formulario-novo-curso"
          onSubmit={submit}
          className="scroll-mt-24 mt-6 animate-reveal rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-8"
        >
          <div className="flex items-start justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-extrabold">Cadastrar novo curso</h2>
              <p className="mt-1 text-xs text-muted">
                Defina as informações que aparecerão no catálogo dos alunos.
              </p>
            </div>
            <span className="card-icon bg-teal-soft text-brand-teal">
              <Icon name="book" />
            </span>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label>
              <span className="field-label">Nome do curso</span>
              <span className="input-shell">
                <Icon name="book" className="size-5 text-muted" />
                <input
                  name="title"
                  required
                  className="form-input"
                  placeholder="Nome da capacitação"
                />
              </span>
            </label>
            <label>
              <span className="field-label">Carga horária</span>
              <span className="input-shell">
                <Icon name="clock" className="size-5 text-muted" />
                <input
                  name="hours"
                  required
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Ex.: 20 horas"
                />
              </span>
            </label>
            <label>
              <span className="field-label">Quantidade de vagas</span>
              <input
                name="vacancies"
                required
                type="number"
                min="1"
                className="standalone-input"
                placeholder="Ex.: 40"
              />
            </label>
            <label className="md:col-span-2">
              <span className="field-label">Descrição para o catálogo</span>
              <textarea
                required
                className="form-textarea"
                placeholder="Apresente objetivos, conteúdo e público-alvo"
              />
            </label>
            <label>
              <span className="field-label">Data inicial do curso</span>
              <input
                name="courseStart"
                required
                type="date"
                className="standalone-input"
              />
            </label>
            <label>
              <span className="field-label">Data final do curso</span>
              <input
                name="courseEnd"
                required
                type="date"
                className="standalone-input"
              />
            </label>
          </div>

          <div className="mt-7">
            <div className="field-label">Como este curso será oferecido?</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setAssociation("project")}
                className={`association-option ${
                  association === "project" ? "association-option-active" : ""
                }`}
              >
                <span className="card-icon bg-orange-soft text-brand-orange">
                  <Icon name="folder" />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-extrabold">
                    Vinculado a um projeto
                  </span>
                  <span className="mt-1 block text-[0.68rem] text-muted">
                    Parte de uma iniciativa institucional
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setAssociation("standalone")}
                className={`association-option ${
                  association === "standalone"
                    ? "association-option-active"
                    : ""
                }`}
              >
                <span className="card-icon bg-blue-soft text-brand-blue">
                  <Icon name="certificate" />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-extrabold">
                    Curso ou oficina avulsa
                  </span>
                  <span className="mt-1 block text-[0.68rem] text-muted">
                    Capacitação independente e de curta duração
                  </span>
                </span>
              </button>
            </div>
            {association === "project" && (
              <label className="mt-4 block animate-reveal">
                <span className="field-label">Projeto associado</span>
                <select name="project" className="standalone-input">
                  <option>Fortaleza Mais Saúde</option>
                  <option>Cuidar de Quem Cuida</option>
                  <option>Residência Multiprofissional</option>
                </select>
              </label>
            )}
          </div>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-extrabold">
              Dias e horário do curso
            </div>
            <p className="mt-1 text-xs text-muted">
              Estas informações serão usadas ao vincular o curso a projetos.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_10rem_10rem]">
              <fieldset>
                <span className="field-label">Dias da semana</span>
                <div className="flex min-h-12 flex-wrap items-center gap-2">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <label key={day} className="cursor-pointer">
                      <input
                        name="courseDays"
                        type="checkbox"
                        value={day}
                        className="peer sr-only"
                      />
                      <span className="flex size-9 items-center justify-center rounded-lg bg-white text-[0.62rem] font-bold text-muted ring-1 ring-slate-200 peer-checked:bg-brand-teal peer-checked:text-white">
                        {day}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label>
                <span className="field-label">Início</span>
                <input
                  name="startTime"
                  required
                  type="time"
                  className="standalone-input h-12"
                />
              </label>
              <label>
                <span className="field-label">Fim</span>
                <input
                  name="endTime"
                  required
                  type="time"
                  className="standalone-input h-12"
                />
              </label>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-[0.68rem] text-muted">
              <Icon name="eye" className="size-4" />
              Após publicado, o curso ficará disponível no catálogo do aluno.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="secondary-button"
              >
                Salvar rascunho
              </button>
              <button type="submit" className="primary-button sm:w-auto">
                Publicar curso <Icon name="check" className="size-5" />
              </button>
            </div>
          </div>
        </form>
      )}

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold">Cursos cadastrados</h2>
            <p className="mt-1 text-xs text-muted">
              Gerencie catálogo, turmas e inscrições
            </p>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <button
              onClick={() => setCourseTab("all")}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
                courseTab === "all"
                  ? "bg-ink text-white"
                  : "border border-slate-200 bg-white text-muted"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setCourseTab("active")}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
                courseTab === "active"
                  ? "bg-ink text-white"
                  : "border border-slate-200 bg-white text-muted"
              }`}
            >
              Ativos
            </button>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <div className="min-w-[44rem]">
            <div className="grid grid-cols-[1.7fr_1fr_0.7fr_0.7fr_auto] gap-4 border-b border-slate-100 px-3 pb-3 text-[0.62rem] font-extrabold uppercase tracking-wider text-muted">
              <span>Curso</span>
              <span>Vínculo</span>
              <span>Carga horária</span>
              <span>Vagas</span>
              <span>Ação</span>
            </div>
            {visibleCourses.map((course) => (
              <div
                key={course.title}
                className="grid grid-cols-[1.7fr_1fr_0.7fr_0.7fr_auto] items-center gap-4 border-b border-slate-100 px-3 py-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-brand-teal">
                    <Icon name="book" className="size-5" />
                  </span>
                  <div>
                    <div className="text-xs font-extrabold">{course.title}</div>
                    <div className="mt-1 text-[0.62rem] text-muted">
                      {course.students} alunos inscritos
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-[0.6rem] font-extrabold ${
                      course.type === "Avulso"
                        ? "bg-blue-soft text-brand-blue"
                        : "bg-orange-soft text-brand-orange"
                    }`}
                  >
                    {course.type}
                  </span>
                  <div className="mt-1 truncate text-[0.62rem] text-muted">
                    {course.project}
                  </div>
                </div>
                <span className="text-xs font-bold">{course.hours}</span>
                <span className="text-xs font-bold">
                  {course.vacancies} vagas
                </span>
                <button
                  onClick={() => {
                    setSelectedCourse(course)
                    setTimeout(
                      () =>
                        document
                          .getElementById("curso-selecionado")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          }),
                      50,
                    )
                  }}
                  aria-label={`Gerenciar ${course.title}`}
                  title={`Gerenciar ${course.title}`}
                  className="rounded-xl bg-blue-soft px-4 py-2.5 text-[0.65rem] font-extrabold text-brand-blue hover:bg-brand-blue hover:text-white"
                >
                  Gerenciar curso
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedCourse && (
        <section
          id="curso-selecionado"
          className="scroll-mt-24 mt-6 animate-reveal rounded-3xl border border-brand-teal/20 bg-teal-soft/40 p-6 sm:p-8"
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row">
            <div>
              <span className="badge badge-teal">Curso publicado</span>
              <h2 className="mt-3 text-xl font-extrabold">
                {selectedCourse.title}
              </h2>
              <p className="mt-2 text-xs text-muted">
                {selectedCourse.project} · {selectedCourse.hours} de carga
                horária · {selectedCourse.start} até {selectedCourse.end}
              </p>
            </div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold"
            >
              Fechar
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <div className="text-2xl font-extrabold">
                {
                  classData.filter(
                    (item) => item.course === selectedCourse.title,
                  ).length
                }
              </div>
              <div className="mt-1 text-xs text-muted">Turmas organizadas</div>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="text-2xl font-extrabold">
                {
                  mockEnrollmentRequests.filter(
                    (item) =>
                      item.course === selectedCourse.title &&
                      item.status === "Aprovada",
                  ).length
                }
              </div>
              <div className="mt-1 text-xs text-muted">Alunos inscritos</div>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="text-2xl font-extrabold">
                {selectedCourse.hours}
              </div>
              <div className="mt-1 text-xs text-muted">Carga horária total</div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setEditingCourse(true)}
              className="rounded-xl bg-brand-teal px-5 py-3 text-xs font-extrabold text-white"
            >
              Editar curso
            </button>
            <button
              onClick={() => setShowEnrollmentPeriodModal(true)}
              className="rounded-xl bg-brand-blue px-5 py-3 text-xs font-extrabold text-white"
            >
              Período de inscrição
            </button>
          </div>
          <div className="mt-6 border-t border-brand-teal/15 pt-5">
            <h3 className="text-sm font-extrabold">Turmas e participantes</h3>
            <div className="mt-3 space-y-2">
              {classData
                .filter((item) => item.course === selectedCourse.title)
                .map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white">
                    <button
                      onClick={() =>
                        setExpandedClass(
                          expandedClass === item.id ? null : item.id,
                        )
                      }
                      className="flex w-full items-center gap-3 p-4 text-left"
                    >
                      <span className="card-icon size-9 bg-blue-soft text-brand-blue">
                        <Icon name="users" className="size-4" />
                      </span>
                      <span>
                        <span className="block text-xs font-extrabold">
                          {item.name}
                        </span>
                        <span className="mt-1 block text-[0.62rem] text-muted">
                          {item.students} inscritos · {item.schedule}
                        </span>
                      </span>
                      <Icon
                        name="chevron"
                        className={`ml-auto size-4 transition ${
                          expandedClass === item.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {expandedClass === item.id && (
                      <div className="animate-reveal border-t border-slate-100 px-4 py-3">
                        <div className="grid grid-cols-[1.2fr_0.7fr_1.2fr] gap-3 border-b border-slate-100 pb-2 text-[0.6rem] font-extrabold uppercase tracking-wider text-muted">
                          <span>Nome</span>
                          <span>Matrícula</span>
                          <span>E-mail</span>
                        </div>
                        {(mockClassRosters[item.id] ?? []).map(
                          ([name, enrollment, email]) => (
                            <div
                              key={name}
                              className="grid grid-cols-[1.2fr_0.7fr_1.2fr] gap-3 border-b border-slate-100 py-2 text-[0.68rem] last:border-0"
                            >
                              <span className="font-bold">{name}</span>
                              <span className="text-muted">{enrollment}</span>
                              <span className="truncate text-muted">
                                {email}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
      {editingCourse && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/65 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              const updated: Course = {
                ...selectedCourse,
                title: String(form.get("title")),
                hours: `${String(form.get("hours"))}h`,
                type: form.get("type") === "Avulso" ? "Avulso" : "Projeto",
                project: String(form.get("project")),
                schedule: String(form.get("schedule")),
                start: String(form.get("start")),
                end: String(form.get("end")),
                vacancies: Number(form.get("vacancies")),
                status:
                  projectStatus(
                    String(form.get("start")),
                    String(form.get("end")),
                  ) === "Em andamento"
                    ? "Ativo"
                    : projectStatus(
                          String(form.get("start")),
                          String(form.get("end")),
                        ) === "Concluído"
                      ? "Concluído"
                      : "Planejamento",
              }
              setCourses((current) =>
                current.map((course) =>
                  course === selectedCourse ? updated : course,
                ),
              )
              setSelectedCourse(updated)
              setEditingCourse(false)
            }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-teal">
                  Edição completa
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">Editar curso</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingCourse(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="field-label">Nome do curso</span>
                <input
                  name="title"
                  defaultValue={selectedCourse.title}
                  className="standalone-input"
                />
              </label>
              <label>
                <span className="field-label">Carga horária</span>
                <input
                  name="hours"
                  type="number"
                  defaultValue={selectedCourse.hours.replace("h", "")}
                  className="standalone-input"
                />
              </label>
              <label>
                <span className="field-label">Tipo de oferta</span>
                <select
                  name="type"
                  defaultValue={selectedCourse.type}
                  className="standalone-input"
                >
                  <option>Projeto</option>
                  <option>Avulso</option>
                </select>
              </label>
              <label>
                <span className="field-label">Quantidade de vagas</span>
                <input
                  name="vacancies"
                  type="number"
                  min="1"
                  defaultValue={selectedCourse.vacancies}
                  className="standalone-input"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">Projeto associado</span>
                <input
                  name="project"
                  defaultValue={selectedCourse.project}
                  className="standalone-input"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">Dias e horários</span>
                <input
                  name="schedule"
                  defaultValue={selectedCourse.schedule}
                  className="standalone-input"
                />
              </label>
              <label>
                <span className="field-label">Data inicial</span>
                <input
                  name="start"
                  type="date"
                  defaultValue={selectedCourse.start}
                  className="standalone-input"
                />
              </label>
              <label>
                <span className="field-label">Data final</span>
                <input
                  name="end"
                  type="date"
                  defaultValue={selectedCourse.end}
                  className="standalone-input"
                />
              </label>
            </div>
            <button className="primary-button mt-7">
              Salvar alterações <Icon name="check" className="size-5" />
            </button>
          </form>
        </div>
      )}
      {showEnrollmentPeriodModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              mockEnrollmentPeriods[selectedCourse.title] = {
                start: String(form.get("start")),
                end: String(form.get("end")),
              }
              setShowEnrollmentPeriodModal(false)
            }}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">
                  Inscrições
                </div>
                <h2 className="mt-2 text-xl font-extrabold">Definir período</h2>
                <p className="mt-2 text-xs text-muted">
                  {selectedCourse.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEnrollmentPeriodModal(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">Abertura</span>
                <input
                  name="start"
                  required
                  type="date"
                  defaultValue={
                    mockEnrollmentPeriods[selectedCourse.title]?.start
                  }
                  className="standalone-input"
                />
              </label>
              <label>
                <span className="field-label">Encerramento</span>
                <input
                  name="end"
                  required
                  type="date"
                  defaultValue={
                    mockEnrollmentPeriods[selectedCourse.title]?.end
                  }
                  className="standalone-input"
                />
              </label>
            </div>
            <button className="primary-button mt-6">
              Salvar período <Icon name="check" className="size-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
