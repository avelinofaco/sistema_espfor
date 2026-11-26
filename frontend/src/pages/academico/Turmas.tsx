import { FormEvent, useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeading } from "../../components/PageHeading"
import {
  classData,
  courseData,
  mockClassRosters,
  mockEnrollmentRequests,
  studentData,
} from "../../data/mockData"
import { Profile, StudentRecord } from "../../types"
import { studentRosterEntry } from "../../utils/helpers"

export function Turmas({ profile }: { profile: Profile }) {
  const [classes, setClasses] = useState(() => [...classData])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [attendanceMode, setAttendanceMode] = useState(false)
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(studentData.map(([name]) => [name, true])),
  )
  const [rosters, setRosters] = useState<Record<number, StudentRecord[]>>(
    () => ({
      ...mockClassRosters,
    }),
  )
  const [studentToAdd, setStudentToAdd] = useState("")
  const [manualStudentName, setManualStudentName] = useState("")
  const [newClassCourse, setNewClassCourse] = useState("")
  const [studentSearch, setStudentSearch] = useState("")
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [courseFilter, setCourseFilter] = useState("Todos os cursos")

  const selectedClass = classes.find((item) => item.id === selectedId) ?? null
  const selectedRoster = selectedId === null ? [] : (rosters[selectedId] ?? [])
  const displayedRoster =
    profile === "Professor" && studentSearch
      ? selectedRoster.filter(([name]) =>
          name
            .toLocaleLowerCase("pt-BR")
            .includes(studentSearch.toLocaleLowerCase("pt-BR")),
        )
      : selectedRoster
  const filteredClasses =
    courseFilter === "Todos os cursos"
      ? classes
      : classes.filter((item) => item.course === courseFilter)
  const canCreate = profile === "Coordenador"

  function submit(event: FormEvent) {
    event.preventDefault()
    const form = new FormData(event.currentTarget as HTMLFormElement)
    const course = String(form.get("course"))
    const limit = Number(form.get("limit"))
    const alreadyAssigned = new Set(
      classData
        .filter((item) => item.course === course)
        .flatMap((item) =>
          (mockClassRosters[item.id] ?? []).map(([name]) => name),
        ),
    )
    const approvedStudents = mockEnrollmentRequests
      .filter(
        (request) =>
          request.course === course &&
          request.status === "Aprovada" &&
          !alreadyAssigned.has(request.student),
      )
      .slice(0, limit)
      .map((request) => studentRosterEntry(request.student))
    const newClass = {
      id: Date.now(),
      name: String(form.get("name")),
      course,
      schedule: `${form.getAll("days").join(" e ")} · ${String(form.get("startTime"))}–${String(form.get("endTime"))}`,
      students: approvedStudents.length,
      room: String(form.get("room")),
      start: String(form.get("startDate")),
      end: String(form.get("endDate")),
    }
    setClasses((current) => [...current, newClass])
    classData.push(newClass)
    mockClassRosters[newClass.id] = approvedStudents
    setRosters((current) => ({ ...current, [newClass.id]: approvedStudents }))
    setSelectedId(null)
    setNewClassCourse("")
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow={
          canCreate
            ? "Gestão de turmas"
            : profile === "Professor"
              ? "Sala de aula"
              : "Consulta de turmas"
        }
        title="Turmas"
        description={
          canCreate
            ? "Associe turmas aos cursos, organize os alunos inscritos e acompanhe a operação acadêmica."
            : profile === "Professor"
              ? "Visualize suas turmas, acompanhe os participantes e registre ou corrija a frequência diária."
              : "Consulte a composição e as informações das turmas cadastradas."
        }
        action={
          canCreate ? (
            <button
              onClick={() => setShowForm((value) => !value)}
              className="primary-button self-start sm:w-auto"
            >
              <Icon name="plus" className="size-5" />
              Nova turma
            </button>
          ) : (
            <span className="badge badge-teal">
              {profile === "Professor"
                ? "Visão do professor"
                : "Somente consulta"}
            </span>
          )
        }
      />

      {showForm && (
        <form
          onSubmit={submit}
          className="mt-7 animate-reveal rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-8"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <span className="card-icon bg-teal-soft text-brand-teal">
              <Icon name="users" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">Criar nova turma</h2>
              <p className="mt-1 text-xs text-muted">
                Associe a turma a um curso já cadastrado.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <label>
              <span className="field-label">Nome da turma</span>
              <input
                name="name"
                required
                className="standalone-input"
                placeholder="Ex.: Turma C · Noite"
              />
            </label>
            <label>
              <span className="field-label">Curso associado</span>
              <select
                name="course"
                required
                value={newClassCourse}
                onChange={(event) => setNewClassCourse(event.target.value)}
                className="standalone-input"
              >
                <option value="">Selecione o curso</option>
                {courseData.map((course) => (
                  <option key={course.title}>{course.title}</option>
                ))}
              </select>
            </label>
            <fieldset>
              <span className="field-label">Dia da semana</span>
              <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                {["Seg", "Ter", "Qua", "Qui", "Sex"].map((day) => (
                  <label key={day} className="cursor-pointer">
                    <input
                      name="days"
                      type="checkbox"
                      value={day}
                      className="peer sr-only"
                    />
                    <span className="flex size-8 items-center justify-center rounded-lg bg-white text-[0.62rem] font-bold text-muted ring-1 ring-slate-200 peer-checked:bg-brand-teal peer-checked:text-white peer-checked:ring-brand-teal">
                      {day}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <span className="field-label">Horário da aula</span>
              <div className="flex items-center gap-2">
                <input
                  name="startTime"
                  required
                  type="time"
                  aria-label="Horário de início"
                  className="compact-input h-11"
                />
                <span className="text-xs text-muted">até</span>
                <input
                  name="endTime"
                  required
                  type="time"
                  aria-label="Horário de término"
                  className="compact-input h-11"
                />
              </div>
            </div>
            <label className="md:col-span-2">
              <span className="field-label">Sala ou ambiente</span>
              <input
                name="room"
                required
                className="standalone-input"
                placeholder="Ex.: Sala 05"
              />
            </label>
            <div className="md:col-span-2 xl:col-span-2">
              <span className="field-label">Período da turma</span>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  name="startDate"
                  required
                  type="date"
                  aria-label="Data de início"
                  className="compact-input h-11"
                />
                <span className="text-xs text-muted">até</span>
                <input
                  name="endDate"
                  required
                  type="date"
                  aria-label="Data de término"
                  className="compact-input h-11"
                />
              </div>
            </div>
            <label>
              <span className="field-label">Limite de vagas</span>
              <input
                name="limit"
                required
                type="number"
                min="1"
                className="standalone-input"
                placeholder="Ex.: 30"
              />
            </label>
          </div>
          {newClassCourse && (
            <div className="mt-5 rounded-2xl bg-blue-soft p-4 text-xs text-ink/70">
              <strong className="text-brand-blue">
                Alunos aprovados disponíveis em {newClassCourse}:
              </strong>{" "}
              {mockEnrollmentRequests
                .filter(
                  (request) =>
                    request.course === newClassCourse &&
                    request.status === "Aprovada" &&
                    !new Set(
                      classData
                        .filter((item) => item.course === newClassCourse)
                        .flatMap((item) =>
                          (mockClassRosters[item.id] ?? []).map(
                            ([name]) => name,
                          ),
                        ),
                    ).has(request.student),
                )
                .map((request) => request.student)
                .join(", ") || "Nenhum aluno aguardando alocação."}
              <p className="mt-2 text-[0.65rem] text-muted">
                Defina o limite de vagas. Se houver menos alunos, a turma
                começará com os disponíveis; os excedentes ficarão para a
                próxima turma.
              </p>
            </div>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="secondary-button"
            >
              Cancelar
            </button>
            <button type="submit" className="primary-button sm:w-auto">
              Criar turma <Icon name="check" className="size-5" />
            </button>
          </div>
        </form>
      )}

      <div className="mt-7 space-y-6">
        <aside
          id="turmas-ativas"
          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card"
        >
          <div className="flex flex-col justify-between gap-4 px-2 pb-4 pt-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-sm font-extrabold text-ink">Turmas ativas</h2>
              <p className="mt-1 text-xs text-muted">
                {filteredClasses.length} turmas encontradas
              </p>
            </div>
            <label className="block w-full max-w-xs">
              <span className="mb-1 block text-[0.62rem] font-bold text-muted">
                Filtrar por curso
              </span>
              <select
                value={courseFilter}
                onChange={(event) => setCourseFilter(event.target.value)}
                className="compact-input h-10"
              >
                <option>Todos os cursos</option>
                {courseData.map((course) => (
                  <option key={course.title}>{course.title}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredClasses.map((item) => (
              <button
                key={item.id}
                title={`Clique para exibir ${item.name}`}
                onClick={() => {
                  setSelectedId(item.id)
                  setAttendanceMode(false)
                  setTimeout(
                    () =>
                      document
                        .getElementById("turma-detalhes")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        }),
                    50,
                  )
                }}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedId === item.id
                    ? "border-brand-teal bg-teal-soft/50"
                    : "border-transparent bg-slate-50 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-ink">
                    {item.name}
                  </span>
                  <Icon name="chevron" className="size-4 text-muted" />
                </div>
                <div className="mt-2 line-clamp-2 text-[0.65rem] leading-4 text-muted">
                  {item.course}
                </div>
                <div className="mt-3 flex items-center gap-3 text-[0.62rem] font-bold text-ink/65">
                  <span className="flex items-center gap-1">
                    <Icon name="students" className="size-3.5" />
                    {item.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="clock" className="size-3.5" />
                    {item.schedule.split("·")[0]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {selectedClass && (
          <section
            id="turma-detalhes"
            className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card"
          >
            <div className="bg-ink p-5 text-white sm:p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="text-[0.62rem] font-extrabold uppercase tracking-wider text-brand-orange">
                    Turma selecionada
                  </div>
                  <h2 className="mt-2 text-xl font-extrabold">
                    {selectedClass.name}
                  </h2>
                  <p className="mt-1 text-xs text-white/55">
                    {selectedClass.course}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[0.65rem] font-bold">
                  <span className="rounded-lg bg-white/10 px-3 py-2">
                    {selectedClass.schedule}
                  </span>
                  <span className="rounded-lg bg-white/10 px-3 py-2">
                    {selectedClass.room}
                  </span>
                  <span className="rounded-lg bg-white/10 px-3 py-2">
                    {selectedClass.start} até {selectedClass.end}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedId(null)
                      document
                        .getElementById("turmas-ativas")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }}
                    className="rounded-lg border border-white/15 px-3 py-2 text-white/70"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-base font-extrabold text-ink">
                    Alunos inscritos
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    Composição e acompanhamento da turma
                  </p>
                </div>
                {profile === "Professor" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={studentSearch}
                      onChange={(event) => setStudentSearch(event.target.value)}
                      className="compact-input min-w-52"
                      placeholder="Buscar aluno por nome"
                    />
                    {!attendanceMode && (
                      <button
                        onClick={() => setAttendanceMode(true)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-teal px-4 text-xs font-extrabold text-white transition"
                      >
                        <Icon name="calendar" className="size-4" />
                        Registrar frequência
                      </button>
                    )}
                  </div>
                ) : profile === "Coordenador" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={studentToAdd}
                      onChange={(event) => setStudentToAdd(event.target.value)}
                      list="alunos-cadastrados"
                      className="compact-input min-w-56"
                      placeholder="Digite ou escolha o participante"
                    />
                    <datalist id="alunos-cadastrados">
                      {studentData
                        .filter(
                          ([name]) =>
                            !selectedRoster.some(
                              ([rosterName]) => rosterName === name,
                            ),
                        )
                        .map(([name]) => (
                          <option key={name} value={name} />
                        ))}
                    </datalist>
                    <button
                      onClick={() => {
                        const typedName = studentToAdd.trim()
                        if (
                          !typedName ||
                          selectedRoster.some(
                            ([name]) =>
                              name.toLocaleLowerCase("pt-BR") ===
                              typedName.toLocaleLowerCase("pt-BR"),
                          )
                        )
                          return
                        const existingStudent = studentData.find(
                          ([name]) => name === typedName,
                        )
                        const student: StudentRecord = existingStudent ?? [
                          typedName,
                          `NOVO.${Date.now().toString().slice(-4)}`,
                          `${typedName.toLocaleLowerCase("pt-BR").replace(/\s+/g, ".")}@aluno.edu.br`,
                        ]
                        setRosters((current) => ({
                          ...current,
                          [selectedClass.id]: [...selectedRoster, student],
                        }))
                        setClasses((current) =>
                          current.map((item) =>
                            item.id === selectedClass.id
                              ? { ...item, students: item.students + 1 }
                              : item,
                          ),
                        )
                        setStudentToAdd("")
                      }}
                      className="rounded-xl bg-brand-teal px-4 py-3 text-[0.65rem] font-extrabold text-white"
                    >
                      Adicionar participante
                    </button>
                  </div>
                ) : profile === "Secretária" ? (
                  <div className="grid w-full gap-2 lg:grid-cols-[1fr_auto_1fr_auto]">
                    <select
                      value={studentToAdd}
                      onChange={(event) => setStudentToAdd(event.target.value)}
                      className="compact-input min-w-56"
                    >
                      <option value="">Aluno com inscrição aprovada</option>
                      {mockEnrollmentRequests
                        .filter(
                          (request) =>
                            request.course === selectedClass.course &&
                            request.status === "Aprovada" &&
                            !classData
                              .filter(
                                (item) => item.course === selectedClass.course,
                              )
                              .some((item) =>
                                (mockClassRosters[item.id] ?? []).some(
                                  ([name]) => name === request.student,
                                ),
                              ),
                        )
                        .map((request) => (
                          <option key={request.id} value={request.student}>
                            {request.student}
                          </option>
                        ))}
                    </select>
                    <button
                      disabled={!studentToAdd}
                      onClick={() => {
                        const student = studentRosterEntry(studentToAdd)
                        const nextRoster = [...selectedRoster, student]
                        mockClassRosters[selectedClass.id] = nextRoster
                        setRosters((current) => ({
                          ...current,
                          [selectedClass.id]: nextRoster,
                        }))
                        setClasses((current) =>
                          current.map((item) =>
                            item.id === selectedClass.id
                              ? { ...item, students: nextRoster.length }
                              : item,
                          ),
                        )
                        const sharedClass = classData.find(
                          (item) => item.id === selectedClass.id,
                        )
                        if (sharedClass)
                          sharedClass.students = nextRoster.length
                        setStudentToAdd("")
                      }}
                      className="rounded-xl bg-brand-teal px-4 py-2 text-xs font-extrabold text-white disabled:opacity-40"
                    >
                      Adicionar inscrito
                    </button>
                    <input
                      value={manualStudentName}
                      onChange={(event) =>
                        setManualStudentName(event.target.value)
                      }
                      className="compact-input min-w-56"
                      placeholder="Nome do aluno sem inscrição"
                    />
                    <button
                      disabled={!manualStudentName.trim()}
                      onClick={() => {
                        const name = manualStudentName.trim()
                        if (
                          selectedRoster.some(
                            ([studentName]) =>
                              studentName.toLocaleLowerCase("pt-BR") ===
                              name.toLocaleLowerCase("pt-BR"),
                          )
                        )
                          return
                        const student = studentRosterEntry(name)
                        const nextRoster = [...selectedRoster, student]
                        mockClassRosters[selectedClass.id] = nextRoster
                        setRosters((current) => ({
                          ...current,
                          [selectedClass.id]: nextRoster,
                        }))
                        setClasses((current) =>
                          current.map((item) =>
                            item.id === selectedClass.id
                              ? { ...item, students: nextRoster.length }
                              : item,
                          ),
                        )
                        setManualStudentName("")
                      }}
                      className="rounded-xl bg-brand-orange px-4 py-2 text-xs font-extrabold text-white disabled:opacity-40"
                    >
                      Adicionar manualmente
                    </button>
                  </div>
                ) : (
                  <span className="badge badge-blue">
                    Visualização da composição
                  </span>
                )}
              </div>
              {attendanceMode && (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-brand-orange/20 bg-orange-soft p-4">
                  <div>
                    <label className="text-xs font-extrabold text-brand-orange">
                      Data da chamada
                      <input
                        type="date"
                        max={new Date().toISOString().slice(0, 10)}
                        value={attendanceDate}
                        onChange={(event) =>
                          setAttendanceDate(event.target.value)
                        }
                        className="ml-3 rounded-lg border border-brand-orange/20 bg-white px-3 py-2 text-xs text-ink"
                      />
                    </label>
                  </div>
                  <span className="text-xs font-bold text-ink">
                    {selectedRoster.filter(([name]) => attendance[name]).length}
                    /{selectedRoster.length} presentes
                  </span>
                </div>
              )}
              <div className="mt-5 overflow-x-auto">
                <div className="min-w-[36rem]">
                  <div className="grid grid-cols-[1.4fr_0.6fr_1fr_auto] gap-4 border-b-2 border-ink/10 px-3 pb-3 text-[0.62rem] font-extrabold uppercase tracking-wider text-ink">
                    <span>Aluno</span>
                    <span>Matrícula</span>
                    <span>E-mail</span>
                    <span>{attendanceMode ? "Presença" : "Frequência"}</span>
                  </div>
                  {displayedRoster.map(([name, enrollment, email], index) => (
                    <div
                      key={name}
                      className="grid grid-cols-[1.4fr_0.6fr_1fr_auto] items-center gap-4 border-b border-slate-100 px-3 py-4 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-blue-soft text-xs font-extrabold text-brand-blue">
                          {name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <span className="text-xs font-bold text-ink">
                          {name}
                        </span>
                      </div>
                      <span className="text-[0.68rem] font-semibold text-ink/70">
                        {enrollment}
                      </span>
                      <span className="truncate text-[0.68rem] text-muted">
                        {email}
                      </span>
                      {attendanceMode ? (
                        <button
                          onClick={() =>
                            setAttendance((current) => ({
                              ...current,
                              [name]: !current[name],
                            }))
                          }
                          className={`flex h-8 min-w-20 items-center justify-center rounded-lg text-[0.62rem] font-extrabold ${
                            attendance[name]
                              ? "bg-teal-soft text-teal-dark"
                              : "bg-orange-soft text-brand-orange"
                          }`}
                        >
                          {attendance[name] ? "Presente" : "Ausente"}
                        </button>
                      ) : (
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold ${
                            index === 3
                              ? "bg-orange-soft text-brand-orange"
                              : "bg-teal-soft text-teal-dark"
                          }`}
                        >
                          {index === 3 ? "Atenção" : "Regular"}
                        </span>
                      )}
                    </div>
                  ))}
                  {displayedRoster.length === 0 && (
                    <div className="col-span-full py-10 text-center text-xs text-muted">
                      {studentSearch
                        ? "Nenhum aluno corresponde à busca."
                        : "Esta turma ainda não possui participantes."}
                    </div>
                  )}
                </div>
              </div>
              {profile === "Professor" && attendanceMode && (
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setAttendanceMode(false)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 text-xs font-extrabold text-white"
                  >
                    <Icon name="check" className="size-4" />
                    Salvar frequência
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
