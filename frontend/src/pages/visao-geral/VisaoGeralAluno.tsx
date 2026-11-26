import { FormEvent, useState } from "react";
import { Icon } from "../../components/Icon";
import { PageHeading } from "../../components/PageHeading";
import {
  mockEnrollmentRequests,
  mockLectures,
  mockRegistrationRequests,
  mockUserNotifications,
} from "../../data/mockData";
import {
  CalendarEvent,
  DashboardView,
  IconName,
  Lecture,
  SessionUser,
} from "../../types";
import {
  currentDate,
  formatLectureDate,
  mockCpfForUser,
} from "../../utils/helpers";

export function VisaoGeralAluno({
  user,
  reminders,
  onNavigate,
  onLectureChange,
}: {
  user: SessionUser;
  reminders: CalendarEvent[];
  onNavigate: (view: DashboardView) => void;
  onLectureChange: () => void;
}) {
  const [, setLectureVersion] = useState(0);
  const [enrollmentLecture, setEnrollmentLecture] = useState<Lecture | null>(null);
  const [attendanceLecture, setAttendanceLecture] = useState<Lecture | null>(null);
  const [pinError, setPinError] = useState("");

  const studentReminders = reminders.filter((reminder) => reminder.audience === "Aluno");
  const enrolledCourses = mockEnrollmentRequests.filter(
    (request) => request.student === user.name && request.status === "Aprovada",
  );
  const registration = mockRegistrationRequests.find((item) => item.name === user.name);
  const studentCpf = mockCpfForUser(user);

  function refreshLectures() {
    setLectureVersion((value) => value + 1);
    onLectureChange();
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow={currentDate()}
        title={`Olá, ${user.name}!`}
        description="Continue sua jornada de aprendizagem e acompanhe suas atividades."
        action={<span className="badge badge-orange">{studentReminders.length} lembretes ativos</span>}
      />

      <section className="mt-6 rounded-2xl border border-brand-orange/20 bg-orange-soft/70 p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-orange">
            <Icon name="calendar" className="size-4" />
          </span>
          <div>
            <h2 className="text-xs font-extrabold text-brand-orange">
              Palestras com Inscrições Abertas
            </h2>
            <p className="mt-0.5 text-[0.65rem] text-muted">
              Vagas para eventos e encontros da ESPFOR
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {mockLectures.map((lecture) => {
            const participant = lecture.participants.find(
              (item) => item.cpf === studentCpf && item.role === "Aluno",
            );
            return (
              <div
                key={lecture.id}
                className="flex flex-col justify-between gap-3 rounded-xl bg-white p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="text-xs font-extrabold">{lecture.title}</div>
                  <div className="mt-1 text-[0.62rem] text-muted">
                    {formatLectureDate(lecture.date)} · {lecture.time} · {lecture.location}
                  </div>
                </div>
                {participant ? (
                  lecture.attendanceOpen && !participant.present ? (
                    <button
                      onClick={() => {
                        setPinError("");
                        setAttendanceLecture(lecture);
                      }}
                      className="shrink-0 rounded-lg bg-brand-teal px-3 py-2 text-[0.62rem] font-extrabold text-white"
                    >
                      Registrar Minha Presença
                    </button>
                  ) : (
                    <span
                      className={`badge shrink-0 ${
                        participant.present ? "badge-teal" : "badge-blue"
                      }`}
                    >
                      {participant.present ? "Presente" : "Inscrito"}
                    </span>
                  )
                ) : (
                  <button
                    onClick={() => setEnrollmentLecture(lecture)}
                    disabled={
                      lecture.participants.filter((item) => item.role === "Aluno").length >=
                      lecture.capacity
                    }
                    className="shrink-0 rounded-lg bg-brand-orange px-3 py-2 text-[0.62rem] font-extrabold text-white disabled:bg-slate-300"
                  >
                    Inscrever-se
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          [String(enrolledCourses.length).padStart(2, "0"), "Meus cursos", "book", "orange"],
          ["92%", "Minha frequência", "check", "teal"],
          ["02", "Certificados", "certificate", "blue"],
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
              <div className="mt-1 text-xs font-semibold text-muted">{label}</div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Cursos em que estou inscrito</h2>
              <p className="mt-1 text-xs text-muted">Inscrições aprovadas pela Secretaria</p>
            </div>
            <button
              onClick={() => onNavigate("courses")}
              className="text-xs font-extrabold text-brand-teal"
            >
              Ver todos
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {enrolledCourses.length ? (
              enrolledCourses.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center gap-4 rounded-2xl bg-brand-orange p-5 text-white"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-teal">
                    <Icon name="book" />
                  </span>
                  <div className="flex-1">
                    <div className="text-[0.62rem] font-extrabold uppercase tracking-wider text-[#f3e5ce]">
                      Inscrição confirmada
                    </div>
                    <h3 className="mt-1 text-sm font-extrabold">{request.course}</h3>
                  </div>
                  <button
                    onClick={() => onNavigate("courses")}
                    className="flex size-10 items-center justify-center rounded-xl bg-brand-teal"
                  >
                    <Icon name="arrow" />
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-6 text-center text-xs text-muted">
                Você ainda não possui inscrições aprovadas.
              </div>
            )}
          </div>
          <div className="mt-5 rounded-2xl bg-blue-soft p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="text-xs font-extrabold text-brand-blue">
                  Mantenha seus dados atualizados
                </div>
                <p className="mt-1 text-[0.68rem] text-ink/65">
                  Garanta a validade dos seus certificados e declarações.
                </p>
              </div>
              <button
                onClick={() => onNavigate("settings")}
                className="text-xs font-extrabold text-brand-blue"
              >
                Atualizar agora
              </button>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-base font-extrabold">Acesso rápido</h2>
            <div className="mt-5 space-y-3">
              <button onClick={() => onNavigate("documents")} className="quick-link">
                <span className="card-icon bg-orange-soft text-brand-orange">
                  <Icon name="certificate" />
                </span>
                <span className="text-left text-xs font-extrabold">Emitir certificado</span>
                <Icon name="chevron" className="ml-auto size-4" />
              </button>
              <button onClick={() => onNavigate("documents")} className="quick-link">
                <span className="card-icon bg-teal-soft text-brand-teal">
                  <Icon name="document" />
                </span>
                <span className="text-left text-xs font-extrabold">Emitir declaração</span>
                <Icon name="chevron" className="ml-auto size-4" />
              </button>
            </div>
          </div>
        </aside>
      </section>

            {enrollmentLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              const unit = String(new FormData(event.currentTarget as HTMLFormElement).get("unit"));
              if (!enrollmentLecture.participants.some((participant) => participant.cpf === studentCpf)) {
                enrollmentLecture.participants.push({
                  name: user.name,
                  cpf: studentCpf,
                  unit,
                  role: "Aluno",
                  present: false,
                });
              }
              mockUserNotifications.unshift({
                id: Date.now(),
                requestId: enrollmentLecture.id,
                user: user.name,
                title: "Inscrição em palestra confirmada",
                message: `Sua inscrição em ${enrollmentLecture.title} foi confirmada.`,
              });
              setEnrollmentLecture(null);
              refreshLectures();
            }}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-orange">
                  Confirmar inscrição
                </div>
                <h2 className="mt-2 text-xl font-extrabold">{enrollmentLecture.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setEnrollmentLecture(null)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">Nome</span>
                <input readOnly value={user.name} className="standalone-input bg-slate-100" />
              </label>
              <label>
                <span className="field-label">CPF</span>
                <input readOnly value={studentCpf} className="standalone-input bg-slate-100" />
              </label>
              <label className="sm:col-span-2">
                <span className="field-label">Unidade de Saúde / Setor</span>
                <select
                  name="unit"
                  required
                  defaultValue={registration?.unit ?? "UAPS José Walter"}
                  className="standalone-input"
                >
                  {registration?.unit && <option>{registration.unit}</option>}
                  <option>UAPS José Walter</option>
                  <option>Hospital da Mulher</option>
                  <option>Secretaria Municipal da Saúde</option>
                  <option>Distrito de Saúde I</option>
                  <option>Outro setor</option>
                </select>
              </label>
            </div>
            <button className="primary-button mt-6">
              Confirmar inscrição <Icon name="check" className="size-5" />
            </button>
          </form>
        </div>
      )}

      {attendanceLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              const pin = String(new FormData(event.currentTarget as HTMLFormElement).get("pin"));
              const participant = attendanceLecture.participants.find(
                (item) => item.cpf === studentCpf && item.role === "Aluno",
              );
              if (!attendanceLecture.attendanceOpen || pin !== attendanceLecture.pin) {
                setPinError("Código inválido. Confira o PIN exibido pela organização.");
                return;
              }
              if (!participant || participant.present) {
                setPinError("Este CPF já possui um registro de presença.");
                return;
              }
              participant.present = true;
              mockUserNotifications.unshift({
                id: Date.now(),
                requestId: attendanceLecture.id,
                user: user.name,
                title: "Presença confirmada",
                message: `Sua presença em ${attendanceLecture.title} foi registrada com segurança.`,
              });
              setAttendanceLecture(null);
              refreshLectures();
            }}
            className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8"
          >
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal-soft text-brand-teal">
              <Icon name="lock" />
            </span>
            <h2 className="mt-5 text-xl font-extrabold">Registrar minha presença</h2>
            <p className="mt-2 text-xs leading-5 text-muted">
              Digite o PIN informado pela organização. O registro será vinculado ao seu CPF e poderá ser feito apenas uma vez.
            </p>
            <input
              name="pin"
              required
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              className="standalone-input mt-5 text-center text-xl font-extrabold tracking-[0.3em]"
              placeholder="0000"
            />
            {pinError && <p className="mt-3 text-xs font-bold text-brand-orange">{pinError}</p>}
            <button className="primary-button mt-5">Confirmar presença</button>
            <button
              type="button"
              onClick={() => setAttendanceLecture(null)}
              className="mt-3 text-xs font-bold text-muted"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

