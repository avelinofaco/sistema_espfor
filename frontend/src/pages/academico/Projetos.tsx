import { FormEvent, useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeading } from "../../components/PageHeading"
import { courseData, courseSchedules, projectData } from "../../data/mockData"
import { Project } from "../../types"
import { projectStatus } from "../../utils/helpers"

export function Projetos({ readOnly = false }: { readOnly?: boolean }) {
  const [showForm, setShowForm] = useState(false)
  const [projects, setProjects] = useState(projectData)
  const [query, setQuery] = useState("")
  const [selectedProject, setSelectedProject] =
    useState<typeof projectData[number] | null>(null)
  const [managementMode, setManagementMode] =
    useState<"edit" | "courses" | null>(null)
  const [courseToLink, setCourseToLink] = useState(courseData[0].title)
  const [projectCourseToAdd, setProjectCourseToAdd] = useState(
    courseData[0].title,
  )
  const [linkedCourses, setLinkedCourses] = useState([
    "Vigilância em Saúde e Atenção Primária",
  ])

  function submit(event: FormEvent) {
    event.preventDefault()
    const form = new FormData(event.currentTarget as HTMLFormElement)
    const start = String(form.get("start"))
    const end = String(form.get("end"))
    const formatDate = (value: string) =>
      value
        ? new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(`${value}T12:00:00`))
        : "A definir"
    const project: Project = {
      name: String(form.get("name")),
      description: String(form.get("description")),
      period: `${formatDate(start)} — ${formatDate(end)}`,
      courses: linkedCourses.length,
      people: 0,
      status: projectStatus(start, end),
      color: "orange",
      responsible: String(form.get("responsible")),
      start,
      end,
    }
    setProjects((current) => [project, ...current])
    setShowForm(false)
    setSelectedProject(project)
  }

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.description} ${project.status}`
      .toLocaleLowerCase("pt-BR")
      .includes(query.toLocaleLowerCase("pt-BR")),
  )

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Gestão acadêmica"
        title="Projetos"
        description={
          readOnly
            ? "Consulte os projetos cadastrados pela Coordenação e seus cursos vinculados."
            : "Organize iniciativas institucionais, associe cursos e acompanhe cada etapa em um só lugar."
        }
        action={
          readOnly ? (
            <span className="badge badge-blue">Somente visualização</span>
          ) : (
            <button
              onClick={() => setShowForm((current) => !current)}
              className="primary-button self-start sm:w-auto sm:self-auto"
            >
              <Icon name={showForm ? "chevron" : "plus"} className="size-5" />
              {showForm ? "Fechar formulário" : "Novo projeto"}
            </button>
          )
        }
      />

      {showForm && (
        <form
          onSubmit={submit}
          className="mt-8 animate-reveal rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-8"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-extrabold">Cadastrar projeto</h2>
              <p className="mt-1 text-xs text-muted">
                Preencha os dados gerais e vincule as capacitações.
              </p>
            </div>
            <span className="card-icon bg-orange-soft text-brand-orange">
              <Icon name="folder" />
            </span>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label>
              <span className="field-label">Nome do projeto</span>
              <span className="input-shell">
                <Icon name="folder" className="size-5 text-muted" />
                <input
                  name="name"
                  required
                  className="form-input"
                  placeholder="Ex.: Saúde nos Territórios"
                />
              </span>
            </label>
            <label>
              <span className="field-label">Responsável</span>
              <span className="input-shell">
                <Icon name="user" className="size-5 text-muted" />
                <input
                  name="responsible"
                  required
                  className="form-input"
                  placeholder="Nome do coordenador responsável"
                />
              </span>
            </label>
            <label className="md:col-span-2">
              <span className="field-label">Descrição</span>
              <textarea
                required
                name="description"
                className="form-textarea"
                placeholder="Descreva os objetivos e o público do projeto"
              />
            </label>
            <div>
              <span className="field-label">Período</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="start"
                  required
                  type="date"
                  aria-label="Data inicial"
                  className="standalone-input"
                />
                <input
                  name="end"
                  required
                  type="date"
                  aria-label="Data final"
                  className="standalone-input"
                />
              </div>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="text-sm font-extrabold">Cursos vinculados</div>
                <p className="mt-1 text-xs text-muted">
                  Um curso pode ter diferentes dias e horários dentro deste
                  projeto.
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={projectCourseToAdd}
                  onChange={(event) =>
                    setProjectCourseToAdd(event.target.value)
                  }
                  className="compact-input min-w-56"
                >
                  {courseData.map((course) => (
                    <option key={course.title}>{course.title}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedCourses((current) =>
                      current.includes(projectCourseToAdd)
                        ? current
                        : [...current, projectCourseToAdd],
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-teal px-3 text-xs font-extrabold text-white"
                >
                  <Icon name="plus" className="size-4" /> Associar
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {linkedCourses.map((course, index) => (
                <div
                  key={`${course}-${index}`}
                  className="grid items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_14rem_auto]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-teal-soft text-brand-teal">
                      <Icon name="book" className="size-4" />
                    </span>
                    <span className="text-xs font-bold">{course}</span>
                  </div>
                  <span className="rounded-lg bg-slate-50 px-3 py-2 text-[0.65rem] font-semibold text-muted">
                    {courseData.find((item) => item.title === course)
                      ?.schedule ??
                      courseSchedules[course] ??
                      "Dias e horários definidos no curso"}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remover ${course}`}
                    onClick={() =>
                      setLinkedCourses((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="justify-self-end text-xs font-bold text-muted hover:text-brand-orange"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="secondary-button"
            >
              Cancelar
            </button>
            <button type="submit" className="primary-button sm:w-auto">
              Salvar projeto
              <Icon name="check" className="size-5" />
            </button>
          </div>
        </form>
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/65 p-5 backdrop-blur-sm">
          <section className="max-h-[90vh] w-full max-w-4xl animate-reveal overflow-y-auto rounded-3xl bg-brand-orange p-6 text-white shadow-2xl sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <div className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-brand-orange">
                  Gerenciamento do projeto
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {selectedProject.name}
                </h2>
                <p className="mt-2 max-w-2xl text-xs leading-5 text-white/60">
                  {selectedProject.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="self-start rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white/10"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/[0.07] p-4">
                <div className="text-[0.65rem] text-white/50">Período</div>
                <div className="mt-2 text-xs font-bold">
                  {selectedProject.period}
                </div>
              </div>
              <div className="rounded-2xl bg-white/[0.07] p-4">
                <div className="text-[0.65rem] text-white/50">
                  Cursos vinculados
                </div>
                <div className="mt-2 text-xs font-bold">
                  {selectedProject.courses} cursos
                </div>
              </div>
              <div className="rounded-2xl bg-white/[0.07] p-4">
                <div className="text-[0.65rem] text-white/50">
                  Participantes
                </div>
                <div className="mt-2 text-xs font-bold">
                  {selectedProject.people} alunos
                </div>
              </div>
            </div>
            {!readOnly && (
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setManagementMode("edit")}
                  className="rounded-xl bg-brand-teal px-4 py-3 text-xs font-extrabold"
                >
                  Editar informações
                </button>
                <button
                  onClick={() => setManagementMode("courses")}
                  className="rounded-xl bg-[#f3e5ce] px-4 py-3 text-xs font-extrabold text-ink"
                >
                  Gerenciar cursos vinculados
                </button>
              </div>
            )}
            {managementMode === "edit" && (
              <form
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault()
                  const form = new FormData(event.currentTarget)
                  const start = String(form.get("start"))
                  const end = String(form.get("end"))
                  const updated = {
                    ...selectedProject,
                    name: String(form.get("name")),
                    description: String(form.get("description")),
                    status: projectStatus(start, end),
                    responsible: String(form.get("responsible")),
                    start,
                    end,
                    period: `${new Intl.DateTimeFormat("pt-BR").format(new Date(`${start}T12:00:00`))} — ${new Intl.DateTimeFormat("pt-BR").format(new Date(`${end}T12:00:00`))}`,
                  }
                  setSelectedProject(updated)
                  setProjects((current) =>
                    current.map((item) =>
                      item === selectedProject ? updated : item,
                    ),
                  )
                  setManagementMode(null)
                }}
                className="mt-5 grid gap-3 rounded-2xl bg-white/[0.07] p-5 sm:grid-cols-2"
              >
                <label>
                  <span className="mb-2 block text-xs font-bold text-white/70">
                    Nome do projeto
                  </span>
                  <input
                    name="name"
                    defaultValue={selectedProject.name}
                    className="compact-input text-ink"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold text-white/70">
                    Responsável
                  </span>
                  <input
                    name="responsible"
                    defaultValue={selectedProject.responsible}
                    className="compact-input text-ink"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label>
                    <span className="mb-2 block text-xs font-bold text-white/70">
                      Data inicial
                    </span>
                    <input
                      name="start"
                      type="date"
                      defaultValue={selectedProject.start}
                      className="compact-input text-ink"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-xs font-bold text-white/70">
                      Data final
                    </span>
                    <input
                      name="end"
                      type="date"
                      defaultValue={selectedProject.end}
                      className="compact-input text-ink"
                    />
                  </label>
                </div>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-bold text-white/70">
                    Descrição
                  </span>
                  <textarea
                    name="description"
                    defaultValue={selectedProject.description}
                    className="form-textarea text-ink"
                  />
                </label>
                <button className="rounded-xl bg-brand-orange px-4 py-3 text-xs font-extrabold sm:col-start-2">
                  Salvar alterações
                </button>
              </form>
            )}
            {managementMode === "courses" && (
              <div className="mt-5 rounded-2xl bg-white/[0.07] p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="text-xs font-extrabold">
                    Cursos vinculados
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={courseToLink}
                      onChange={(event) => setCourseToLink(event.target.value)}
                      className="compact-input min-w-56 text-ink"
                    >
                      {courseData.map((course) => (
                        <option key={course.title}>{course.title}</option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        setLinkedCourses((current) =>
                          current.includes(courseToLink)
                            ? current
                            : [...current, courseToLink],
                        )
                      }
                      className="rounded-lg bg-brand-orange px-3 text-xs font-bold"
                    >
                      Vincular
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {linkedCourses.map((course, index) => (
                    <div
                      key={`${course}-${index}`}
                      className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-xs"
                    >
                      <span>{course}</span>
                      <button
                        onClick={() =>
                          setLinkedCourses((current) =>
                            current.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                        className="text-white/50 hover:text-brand-orange"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => {
                      const updated = {
                        ...selectedProject,
                        courses: linkedCourses.length,
                      }
                      setSelectedProject(updated)
                      setProjects((current) =>
                        current.map((project) =>
                          project.name === selectedProject.name
                            ? updated
                            : project,
                        ),
                      )
                      setManagementMode(null)
                    }}
                    className="rounded-xl bg-brand-teal px-5 py-3 text-xs font-extrabold text-white"
                  >
                    Salvar cursos vinculados
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      <section className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold">Projetos cadastrados</h2>
            <p className="mt-1 text-xs text-muted">
              {filteredProjects.length} projetos encontrados
            </p>
          </div>
          <div className="relative sm:ml-auto">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none focus:border-brand-teal"
              placeholder="Buscar projeto..."
            />
          </div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.name}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`card-icon ${
                    project.color === "orange"
                      ? "bg-orange-soft text-brand-orange"
                      : project.color === "teal"
                        ? "bg-teal-soft text-brand-teal"
                        : "bg-blue-soft text-brand-blue"
                  }`}
                >
                  <Icon name="folder" />
                </span>
                <button
                  onClick={() => {
                    setSelectedProject(project)
                    setManagementMode(null)
                  }}
                  aria-label={`Opções de ${project.name}`}
                  title={`Abrir opções de ${project.name}`}
                  className="rounded-lg p-2 text-muted hover:bg-slate-100"
                >
                  <Icon name="more" className="size-5" />
                </button>
              </div>
              <span
                className={`mt-5 inline-flex rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold ${
                  project.status === "Planejado"
                    ? "bg-blue-soft text-brand-blue"
                    : "bg-teal-soft text-teal-dark"
                }`}
              >
                {project.status}
              </span>
              <h3 className="mt-3 text-base font-extrabold">{project.name}</h3>
              <p className="mt-2 min-h-10 text-xs leading-5 text-muted">
                {project.description}
              </p>
              <div className="mt-5 flex items-center gap-2 border-y border-slate-100 py-4 text-[0.68rem] font-semibold text-muted">
                <Icon name="calendar" className="size-4" />
                {project.period}
              </div>
              <div className="mt-4 flex items-center gap-5 text-xs">
                <span className="flex items-center gap-2 font-bold">
                  <Icon name="book" className="size-4 text-brand-orange" />
                  {project.courses} cursos
                </span>
                <span className="flex items-center gap-2 font-bold">
                  <Icon name="students" className="size-4 text-brand-teal" />
                  {project.people} alunos
                </span>
              </div>
              <button
                onClick={() => setSelectedProject(project)}
                className="mt-5 flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-extrabold transition group-hover:bg-ink group-hover:text-white"
              >
                Gerenciar projeto
                <Icon name="arrow" className="size-4" />
              </button>
            </article>
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white py-14 text-center">
              <Icon name="search" className="mx-auto size-8 text-slate-300" />
              <div className="mt-3 text-sm font-extrabold">
                Nenhum projeto encontrado
              </div>
              <p className="mt-1 text-xs text-muted">
                Tente pesquisar por outro nome ou situação.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
