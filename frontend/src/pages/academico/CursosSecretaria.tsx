import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeading } from "../../components/PageHeading"
import {
  courseData,
  mockEmailNotifications,
  mockEnrollmentRequests,
  mockRegistrationRequests,
  mockUserNotifications,
} from "../../data/mockData"
import { EnrollmentStatus } from "../../types"

export function CursosSecretaria() {
  const [requests, setRequests] = useState(() => [...mockEnrollmentRequests])
  const [rejectedIds, setRejectedIds] = useState<number[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const update = (id: number, status: EnrollmentStatus, reason = "") => {
    const request = mockEnrollmentRequests.find((item) => item.id === id)
    if (request) {
      const capacity =
        courseData.find((course) => course.title === request.course)
          ?.vacancies ?? Number.POSITIVE_INFINITY
      const approvedCount = mockEnrollmentRequests.filter(
        (item) => item.course === request.course && item.status === "Aprovada",
      ).length
      if (status === "Aprovada" && approvedCount >= capacity) return
      request.status = status
      if (
        status === "Aprovada" &&
        !mockUserNotifications.some(
          (notification) => notification.requestId === id,
        )
      ) {
        mockUserNotifications.unshift({
          id: Date.now(),
          requestId: id,
          user: request.student,
          title: "Inscrição aprovada",
          message: `Sua inscrição em ${request.course} foi aprovada pela Secretaria.`,
        })
      }
      if (status === "Recusada") {
        const message = `Sua inscrição em ${request.course} foi recusada. Motivo: ${reason}`
        mockUserNotifications.unshift({
          id: Date.now(),
          requestId: id,
          user: request.student,
          title: "Inscrição recusada",
          message,
        })
        const registration = mockRegistrationRequests.find(
          (item) => item.name === request.student,
        )
        if (registration) {
          mockEmailNotifications.push({
            email: registration.email,
            subject: "Inscrição ESPFOR recusada",
            message,
          })
        }
      }
    }
    setRequests((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    )
    setSelectedIds((current) => {
      const next = new Set(current)
      next.delete(id)
      return next
    })
  }

  const pendingIds = requests
    .filter((item) => item.status === "Pendente")
    .map((item) => item.id)
  const requestCourses = [...new Set(requests.map((item) => item.course))]

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Secretaria acadêmica"
        title="Cursos e inscrições"
        description="Consulte os cursos criados pela Coordenação e analise as solicitações de inscrição dos alunos."
        action={
          <span className="badge badge-orange">
            {requests.filter((item) => item.status === "Pendente").length}{" "}
            solicitações pendentes
          </span>
        }
      />
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold">
              Solicitações de inscrição
            </h2>
            <p className="mt-1 text-xs text-muted">
              Selecione solicitações pendentes para realizar ações em lote.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-bold">
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
              />
              Selecionar todos
            </label>
            <button
              disabled={!selectedIds.size}
              onClick={() =>
                [...selectedIds].forEach((id) => update(id, "Aprovada"))
              }
              className="rounded-xl bg-brand-teal px-4 py-2.5 text-xs font-extrabold text-white disabled:opacity-40"
            >
              Aprovar selecionados
            </button>
            <button
              disabled={!selectedIds.size}
              onClick={() => setRejectedIds([...selectedIds])}
              className="rounded-xl bg-orange-soft px-4 py-2.5 text-xs font-extrabold text-brand-orange disabled:opacity-40"
            >
              Recusar selecionados
            </button>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {requestCourses.map((courseTitle) => {
            const courseRequests = requests.filter(
              (item) => item.course === courseTitle,
            )
            const coursePendingIds = courseRequests
              .filter((item) => item.status === "Pendente")
              .map((item) => item.id)
            const capacity =
              courseData.find((course) => course.title === courseTitle)
                ?.vacancies ?? 0
            const approved = courseRequests.filter(
              (item) => item.status === "Aprovada",
            ).length
            return (
              <section
                key={courseTitle}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <div className="flex flex-col justify-between gap-3 bg-blue-soft p-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-extrabold text-brand-blue">
                      {courseTitle}
                    </h3>
                    <div className="mt-1 text-xs font-bold text-ink">
                      {approved}/{capacity} aprovadas
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={
                        coursePendingIds.length > 0 &&
                        coursePendingIds.every((id) => selectedIds.has(id))
                      }
                      onChange={(event) =>
                        setSelectedIds((current) => {
                          const next = new Set(current)
                          coursePendingIds.forEach((id) =>
                            event.target.checked
                              ? next.add(id)
                              : next.delete(id),
                          )
                          return next
                        })
                      }
                    />
                    Selecionar pendentes deste curso
                  </label>
                </div>
                <div className="divide-y divide-slate-100">
                  {courseRequests.map((item) => {
                    const profession =
                      mockRegistrationRequests.find(
                        (registration) => registration.name === item.student,
                      )?.profession ?? "Profissional da saúde"
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
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
                              className="mt-1 size-4"
                            />
                          )}
                          <div>
                            <div className="text-xs font-extrabold">
                              {item.student}
                            </div>
                            <div className="mt-1 text-[0.65rem] text-muted">
                              Profissão: {profession} · {item.requested}
                            </div>
                          </div>
                        </div>
                        {item.status === "Pendente" ? (
                          <div className="flex gap-2">
                            <button
                              disabled={approved >= capacity}
                              onClick={() => update(item.id, "Aprovada")}
                              className="rounded-xl bg-brand-teal px-4 py-2.5 text-[0.65rem] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Aprovar inscrição
                            </button>
                            <button
                              onClick={() => setRejectedIds([item.id])}
                              className="rounded-xl bg-orange-soft px-4 py-2.5 text-[0.65rem] font-extrabold text-brand-orange"
                            >
                              Recusar
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`badge ${
                              item.status === "Aprovada"
                                ? "badge-teal"
                                : "badge-orange"
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </section>
      {rejectedIds.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const reason = String(
                new FormData(event.currentTarget).get("reason"),
              )
              rejectedIds.forEach((id) => update(id, "Recusada", reason))
              setRejectedIds([])
            }}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-orange">
                  Recusar inscrição
                </div>
                <h2 className="mt-2 text-xl font-extrabold">
                  {rejectedIds.length} solicitação(ões) selecionada(s)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setRejectedIds([])}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <label className="mt-6 block">
              <span className="field-label">Motivação da recusa</span>
              <textarea
                name="reason"
                required
                className="form-textarea"
                placeholder="Informe o motivo que será enviado aos alunos"
              />
            </label>
            <button className="primary-button mt-5">Enviar</button>
          </form>
        </div>
      )}
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-extrabold">Cursos cadastrados</h2>
        <p className="mt-1 text-xs text-muted">
          Visualização somente leitura. O cadastro é responsabilidade da
          Coordenação.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {courseData.map((course) => (
            <div
              key={course.title}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
            >
              <span className="card-icon bg-blue-soft text-brand-blue">
                <Icon name="book" />
              </span>
              <div>
                <div className="text-xs font-extrabold">{course.title}</div>
                <div className="mt-1 text-[0.65rem] text-muted">
                  {course.hours} · {course.classes} turmas · {course.students}{" "}
                  alunos
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
