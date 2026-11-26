import { useState } from "react";
import { Icon } from "../../components/Icon";
import { PageHeading } from "../../components/PageHeading";
import {
  catalogCourses,
  courseData,
  mockEnrollmentRequests,
  systemState,
} from "../../data/mockData";
import { SessionUser } from "../../types";
import {
  enrollmentIsOpen,
  enrollmentPeriodLabel,
  mockCpfForUser,
} from "../../utils/helpers";

export function CursosAluno({ user }: { user: SessionUser }) {
  const studentCatalogCourses = courseData.map((course, index) => {
    const existing = catalogCourses.find((item) => item.title === course.title);
    return (
      existing ?? {
        id: 1000 + index,
        title: course.title,
        category: course.type === "Projeto" ? course.project : "Curso livre",
        hours: Number(course.hours.replace("h", "")),
        period: `${new Date(`${course.start}T12:00:00`).toLocaleDateString("pt-BR")} — ${new Date(`${course.end}T12:00:00`).toLocaleDateString("pt-BR")}`,
        places: course.vacancies,
        format: "Presencial",
        color: "teal",
      }
    );
  });
  const [query, setQuery] = useState("");
  const [enrollments, setEnrollments] = useState<Record<number, "pending" | "confirmed">>(() =>
    Object.fromEntries(
      studentCatalogCourses.flatMap((course) => {
        const request = mockEnrollmentRequests.find(
          (item) => item.student === user.name && item.course === course.title,
        );
        return request ? [[course.id, request.status === "Aprovada" ? "confirmed" : "pending"]] : [];
      }),
    ),
  );
  const [selectedCourse, setSelectedCourse] = useState<(typeof studentCatalogCourses)[number] | null>(
    null,
  );
  const [presenceFeedback, setPresenceFeedback] = useState("");
  const visibleCourses = studentCatalogCourses.filter((course) =>
    `${course.title} ${course.category}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")),
  );

  function enroll(courseId: number) {
    setEnrollments((current) => ({ ...current, [courseId]: "pending" }));
    const course = studentCatalogCourses.find((item) => item.id === courseId);
    if (
      course &&
      !mockEnrollmentRequests.some(
        (item) => item.student === user.name && item.course === course.title,
      )
    ) {
      mockEnrollmentRequests.unshift({
        id: Date.now(),
        student: user.name,
        course: course.title,
        requested: "Agora",
        status: "Pendente",
      });
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Catálogo de capacitações"
        title="Cursos disponíveis"
        description="Encontre novas oportunidades de aprendizagem e solicite sua inscrição. A Secretaria confirmará sua participação após a análise."
        action={
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none focus:border-brand-teal"
              placeholder="Buscar no catálogo..."
            />
          </div>
        }
      />
      <div className="mt-7 flex items-start gap-3 rounded-2xl border border-brand-blue/15 bg-blue-soft p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-blue">
          <Icon name="help" className="size-4" />
        </span>
        <div>
          <div className="text-xs font-extrabold text-brand-blue">Como funciona a inscrição?</div>
          <p className="mt-1 text-xs leading-5 text-ink/65">
            Ao solicitar uma vaga, sua inscrição ficará pendente. A Secretaria verificará os requisitos e enviará a confirmação pelo portal.
          </p>
        </div>
      </div>
      <section className="mt-7 grid gap-5 md:grid-cols-2">
        {visibleCourses.map((course) => {
          const status = enrollments[course.id];
          return (
            <article key={course.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
              <div
                className={`relative h-28 overflow-hidden ${
                  course.color === "orange"
                    ? "bg-brand-orange"
                    : course.color === "blue"
                      ? "bg-brand-blue"
                      : "bg-brand-teal"
                }`}
              >
                <div className="pattern-grid absolute inset-0 opacity-20" />
                <div className="absolute -right-8 -top-12 size-40 rounded-full bg-white/10" />
                <span className="absolute bottom-4 left-5 rounded-full bg-white/15 px-3 py-1.5 text-[0.62rem] font-extrabold text-white backdrop-blur">
                  {course.category}
                </span>
                <span className="absolute bottom-4 right-5 rounded-full bg-white px-3 py-1.5 text-[0.62rem] font-extrabold text-ink">
                  {course.format}
                </span>
              </div>
              <div className="p-5 sm:p-6">
                <h2 className="text-lg font-extrabold leading-snug">{course.title}</h2>
                <div className="mt-3 rounded-xl bg-blue-soft px-3 py-2 text-[0.65rem] font-bold text-brand-blue">
                  Inscrições: {enrollmentPeriodLabel(course.title)}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-100 py-4">
                  <div>
                    <div className="text-[0.6rem] text-muted">Carga horária</div>
                    <div className="mt-1 text-xs font-extrabold">{course.hours}h</div>
                  </div>
                  <div>
                    <div className="text-[0.6rem] text-muted">Período do curso</div>
                    <div className="mt-1 text-xs font-extrabold">{course.period}</div>
                  </div>
                  <div>
                    <div className="text-[0.6rem] text-muted">Vagas</div>
                    <div className="mt-1 text-xs font-extrabold">{course.places} restantes</div>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="secondary-button h-11 flex-1 px-4 text-xs"
                  >
                    Ver detalhes
                  </button>
                  {status === "pending" ? (
                    <span className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-soft px-3 text-center text-[0.65rem] font-extrabold text-brand-orange">
                      <Icon name="clock" className="size-4" /> Aguardando Secretaria
                    </span>
                  ) : status === "confirmed" ? (
                    <span className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-soft text-[0.68rem] font-extrabold text-teal-dark">
                      <Icon name="check" className="size-4" /> Inscrição confirmada
                    </span>
                  ) : enrollmentIsOpen(course.title) ? (
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 text-xs font-extrabold text-white"
                    >
                      Solicitar inscrição <Icon name="arrow" className="size-4" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex h-11 flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-slate-200 px-4 text-xs font-extrabold text-slate-500"
                    >
                      Período encerrado
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <section className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <span className="card-icon bg-teal-soft text-brand-teal">
                <Icon name="book" />
              </span>
              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-5 text-xs font-extrabold uppercase tracking-wider text-brand-teal">
              {selectedCourse.category}
            </div>
            <h2 className="mt-2 text-2xl font-extrabold">{selectedCourse.title}</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              Capacitação destinada ao desenvolvimento de competências práticas e atualização profissional na rede de saúde.
            </p>
            <div className="mt-4 rounded-xl bg-blue-soft p-4 text-xs font-bold text-brand-blue">
              Período de inscrição: {enrollmentPeriodLabel(selectedCourse.title)}
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-xs leading-6 text-ink/75">
              A solicitação não garante a vaga. A inscrição será efetivada somente após a confirmação da Secretaria.
            </div>
            {enrollments[selectedCourse.id] === "confirmed" &&
              systemState.activeAttendanceForm?.course === selectedCourse.title && (
                <div className="mt-4 rounded-2xl border border-brand-teal/20 bg-teal-soft p-4">
                  <div className="text-xs font-extrabold text-teal-dark">
                    Formulário de frequência ativo
                  </div>
                  <p className="mt-1 text-[0.65rem] text-muted">
                    {systemState.activeAttendanceForm.content} · válido por{" "}
                    {systemState.activeAttendanceForm.validity} minutos
                  </p>
                  <button
                    onClick={() => {
                      if (!systemState.activeAttendanceForm) return;
                      const cpf = mockCpfForUser(user);
                      if (
                        systemState.activeAttendanceForm.attendees.some(
                          (attendee) => attendee.cpf === cpf,
                        )
                      ) {
                        setPresenceFeedback("Presença já registrada para este CPF.");
                        return;
                      }
                      systemState.activeAttendanceForm.attendees.push({
                        name: user.name,
                        cpf,
                        registeredAt: new Intl.DateTimeFormat("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date()),
                      });
                      setPresenceFeedback("Presença registrada com sucesso.");
                    }}
                    className="mt-4 w-full rounded-xl bg-brand-teal px-4 py-3 text-xs font-extrabold text-white"
                  >
                    Registrar Presença (QR Code / Link)
                  </button>
                  {presenceFeedback && (
                    <div className="mt-3 text-xs font-bold text-teal-dark">{presenceFeedback}</div>
                  )}
                </div>
              )}
            {!enrollments[selectedCourse.id] && enrollmentIsOpen(selectedCourse.title) ? (
              <button
                onClick={() => {
                  enroll(selectedCourse.id);
                  setSelectedCourse(null);
                }}
                className="primary-button mt-6"
              >
                Confirmar solicitação de inscrição <Icon name="arrow" className="size-5" />
              </button>
            ) : (
              !enrollments[selectedCourse.id] && (
                <button
                  disabled
                  className="mt-6 h-12 w-full cursor-not-allowed rounded-xl bg-slate-200 text-xs font-extrabold text-slate-500"
                >
                  Período encerrado
                </button>
              )
            )}
          </section>
        </div>
      )}
    </div>
  );
}
