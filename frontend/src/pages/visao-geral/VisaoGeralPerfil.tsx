import { useState } from "react";
import { Icon } from "../../components/Icon";
import { PageHeading } from "../../components/PageHeading";
import {
  classData,
  courseData,
  mockClassRosters,
  mockLectureMaterials,
  mockLectures,
  mockMaterials,
  projectData,
  roleOverview,
  studentData,
} from "../../data/mockData";
import { DashboardView, IconName, SessionUser } from "../../types";
import { currentDate, formatLectureDate } from "../../utils/helpers";

export function VisaoGeralPerfil({
  user,
  onNavigate,
}: {
  user: SessionUser;
  onNavigate: (view: DashboardView) => void;
}) {
  const baseContent = roleOverview[user.profile];
  const speakerLectures =
    user.name === "Facilitador"
      ? mockLectures
      : mockLectures.filter((lecture) => lecture.speaker === user.name);
  const speakerMaterials =
    user.name === "Facilitador"
      ? mockLectureMaterials
      : mockLectureMaterials.filter((material) => material.speaker === user.name);
  const speakerCertificates = speakerLectures.filter(
    (lecture) =>
      lecture.certificatesIssued &&
      lecture.participants.some((participant) => participant.role === "Facilitador" && participant.present),
  ).length;

  const content =
    user.profile === "Facilitador"
      ? {
          ...baseContent,
          stats: [
            [String(speakerLectures.length).padStart(2, "0"), "Próximas palestras", "calendar", "orange"],
            [String(speakerMaterials.length).padStart(2, "0"), "Materiais Didáticos", "document", "teal"],
            [String(speakerCertificates).padStart(2, "0"), "Certificados e Declarações", "certificate", "blue"],
          ] as [string, string, IconName, string][],
        }
      : baseContent;

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [professionFilter, setProfessionFilter] = useState("Todas");

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow={currentDate()}
        title={`Olá, ${user.name}!`}
        description={content.message}
        action={<span className="badge badge-teal">{user.profile}</span>}
      />

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {content.stats.map(([value, label, icon, color]) => {
          const inner = (
            <>
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
              <span className="min-w-0 text-left">
                <span className="block text-2xl font-extrabold">{value}</span>
                <span className="mt-1 block text-xs font-semibold text-muted">{label}</span>
              </span>
              {["Coordenador", "Secretária", "Professor", "Administrador"].includes(user.profile) && (
                <Icon name="chevron" className="ml-auto size-4 shrink-0 text-slate-300" />
              )}
            </>
          );

          return ["Coordenador", "Secretária", "Professor", "Administrador"].includes(user.profile) ? (
            <button
              key={label}
              onClick={() => setSelectedMetric(label)}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-teal/30 hover:shadow-lg"
            >
              {inner}
            </button>
          ) : (
            <article key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              {inner}
            </article>
          );
        })}
      </section>

      {user.profile === "Facilitador" && (
        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Minhas Palestras</h2>
              <p className="mt-1 text-xs text-muted">Programação vinculada ao seu perfil</p>
            </div>
            <button onClick={() => onNavigate("lectures")} className="text-xs font-extrabold text-brand-teal">
              Ver agenda completa
            </button>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {speakerLectures.map((lecture) => (
              <div key={lecture.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start gap-3">
                  <span className="card-icon bg-orange-soft text-brand-orange">
                    <Icon name="calendar" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold">{lecture.title}</div>
                    <div className="mt-1 text-[0.62rem] leading-5 text-muted">
                      {formatLectureDate(lecture.date)} · {lecture.time}
                      <br />
                      {lecture.location} · {lecture.participants.filter((participant) => participant.role === "Aluno").length} alunos inscritos
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => onNavigate("materials")}
                    className="rounded-xl bg-teal-soft px-4 py-3 text-xs font-extrabold text-teal-dark"
                  >
                    Gerenciar materiais
                  </button>
                  <button
                    onClick={() => onNavigate("documents")}
                    className="rounded-xl bg-blue-soft px-4 py-3 text-xs font-extrabold text-brand-blue"
                  >
                    Certificado da Palestra
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm">
          <section className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-teal">
                  Visão detalhada
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">{selectedMetric}</h2>
              </div>
              <button
                onClick={() => setSelectedMetric(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className={`mt-6 ${selectedMetric === "Usuários ativos" ? "max-h-[55vh] overflow-y-auto rounded-2xl border border-slate-100" : "space-y-3"}`}>
              {selectedMetric === "Usuários ativos" && (
                <div className="sticky top-0 grid grid-cols-[1.1fr_0.7fr_1.2fr_0.8fr_1fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[0.62rem] font-extrabold uppercase tracking-wider text-ink">
                  <span>Nome</span><span>Matrícula</span><span>E-mail</span><span>CPF</span><span>Profissão</span>
                </div>
              )}
              {selectedMetric === "Projetos ativos" &&
                projectData
                  .filter((project) => project.status === "Em andamento")
                  .map((project) => (
                    <div key={project.name} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                      <span className="card-icon bg-orange-soft text-brand-orange"><Icon name="folder" /></span>
                      <div className="flex-1">
                        <div className="text-xs font-extrabold">{project.name}</div>
                        <div className="mt-1 text-[0.62rem] text-muted">{project.period} · {project.courses} cursos</div>
                      </div>
                      <span className="badge badge-teal">{project.status}</span>
                    </div>
                  ))}
              {selectedMetric === "Cursos publicados" &&
                courseData.map((course) => (
                  <div key={course.title} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                    <span className="card-icon bg-teal-soft text-brand-teal"><Icon name="book" /></span>
                    <div className="flex-1">
                      <div className="text-xs font-extrabold">{course.title}</div>
                      <div className="mt-1 text-[0.62rem] text-muted">{course.hours} · {course.schedule} · {course.students} alunos</div>
                    </div>
                    <span className="badge badge-blue">Publicado</span>
                  </div>
                ))}
                            {selectedMetric === "Total de Alunos Ativos" && user.profile !== "Administrador" && (
                <>
                  <div className="grid grid-cols-[1.1fr_0.8fr_0.8fr_1.2fr_1fr] gap-3 rounded-xl bg-slate-50 px-4 py-3 text-[0.6rem] font-extrabold uppercase">
                    <span>Nome</span><span>Matrícula</span><span>CPF</span><span>E-mail</span><span>Profissão</span>
                  </div>
                  {studentData.map(([name, enrollment, email], index) => (
                    <div key={name} className="grid grid-cols-[1.1fr_0.8fr_0.8fr_1.2fr_1fr] gap-3 border-b border-slate-100 px-4 py-3 text-[0.65rem]">
                      <strong>{name}</strong>
                      <span>{enrollment}</span>
                      <span>{`1234567890${index}`.slice(0, 11)}</span>
                      <span className="truncate">{email}</span>
                      <span>{["Enfermeiro", "Médico", "ACS", "Odontólogo", "Técnico de enfermagem"][index]}</span>
                    </div>
                  ))}
                </>
              )}

              {selectedMetric === "Total de Alunos Ativos" && user.profile === "Administrador" && (
                <>
                  <label className="block max-w-xs">
                    <span className="field-label">Filtrar por profissão</span>
                    <select value={professionFilter} onChange={(event) => setProfessionFilter(event.target.value)} className="standalone-input">
                      <option>Todas</option>
                      {["Enfermeiro", "Médico", "ACS", "Odontólogo", "Técnico de enfermagem"].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <div className="grid grid-cols-[1.1fr_0.8fr_1.2fr_1fr] gap-3 rounded-xl bg-slate-50 px-4 py-3 text-[0.6rem] font-extrabold uppercase">
                    <span>Nome</span><span>CPF</span><span>E-mail</span><span>Profissão</span>
                  </div>
                  {studentData
                    .map(([name, , email], index) => ({
                      name,
                      email,
                      profession: ["Enfermeiro", "Médico", "ACS", "Odontólogo", "Técnico de enfermagem"][index],
                      cpf: `1234567890${index}`.slice(0, 11),
                    }))
                    .filter((item) => professionFilter === "Todas" || item.profession === professionFilter)
                    .map((item) => (
                      <div key={item.name} className="grid grid-cols-[1.1fr_0.8fr_1.2fr_1fr] gap-3 border-b border-slate-100 px-4 py-3 text-[0.65rem]">
                        <strong>{item.name}</strong>
                        <span>{item.cpf}</span>
                        <span className="truncate">{item.email}</span>
                        <span>{item.profession}</span>
                      </div>
                    ))}
                </>
              )}

              {selectedMetric === "Cursos e Turmas Ativas" && (
                <>
                  <div className="rounded-2xl bg-blue-soft p-5">
                    <div className="text-2xl font-extrabold text-brand-blue">
                      {courseData.length} cursos ativos • {classData.reduce((sum, item) => sum + item.students, 0)} alunos em andamento
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      Volume atual da oferta pedagógica para monitoramento da capacidade de tutoria e suporte técnico.
                    </p>
                  </div>
                  {courseData.map((course) => (
                    <div key={course.title} className="flex justify-between rounded-xl border border-slate-100 p-4 text-xs">
                      <div>
                        <strong>{course.title}</strong>
                        <div className="mt-1 text-muted">{course.hours} · {course.vacancies} vagas</div>
                      </div>
                      <span className="badge badge-teal">
                        {classData.filter((item) => item.course === course.title).length} turmas
                      </span>
                    </div>
                  ))}
                </>
              )}

              {selectedMetric === "Certificações e Conclusões" && (
                <div className="rounded-2xl bg-teal-soft p-6">
                  <div className="text-3xl font-extrabold text-teal-dark">415 certificados emitidos</div>
                  <div className="mt-2 text-sm font-bold text-brand-orange">+12% em relação ao mês anterior</div>
                  <p className="mt-4 text-xs leading-5 text-muted">
                    Indicador de entrega final da ESPFOR para prestação de contas e controle de validade dos certificados.
                  </p>
                </div>
              )}

              {selectedMetric === "Documentação Incompleta" && (
                <>
                  <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 px-4 py-3 text-[0.62rem] font-extrabold uppercase">
                    <span>Nome</span><span>Documento pendente</span>
                  </div>
                  {[
                    ["Bruno da Silva Rocha", "RG e comprovante de residência"],
                    ["Diego Martins Alves", "CPF"],
                    ["Emanuela Costa", "Comprovante de residência"],
                  ].map(([name, pending]) => (
                    <div key={name} className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 p-4 text-xs">
                      <strong>{name}</strong>
                      <span className="text-brand-orange">{pending}</span>
                    </div>
                  ))}
                </>
              )}

              {selectedMetric === "Diários de Classe Pendentes" && (
                <>
                  <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 px-4 py-3 text-[0.62rem] font-extrabold uppercase">
                    <span>Nome do professor</span><span>Pendências</span>
                  </div>
                  {[
                    ["Prof. Ricardo Mendes", "Turma A · Frequência pendente"],
                    ["Profa. Luana Costa", "Turma B · Notas pendentes"],
                  ].map(([name, pending]) => (
                    <div key={name} className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 p-4 text-xs">
                      <strong>{name}</strong>
                      <span className="text-brand-orange">{pending}</span>
                    </div>
                  ))}
                </>
              )}

              {selectedMetric === "Minhas turmas" &&
                classData.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-100 p-4">
                    <div className="text-xs font-extrabold">{item.name}</div>
                    <div className="mt-1 text-[0.65rem] text-muted">
                      {item.course} · {item.students} alunos · {item.schedule}
                    </div>
                  </div>
                ))}

              {selectedMetric === "Meus alunos" &&
                classData.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-100">
                    <div className="bg-blue-soft p-4 text-xs font-extrabold text-brand-blue">
                      {item.course} · {item.name}
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 bg-slate-50 px-4 py-3 text-[0.6rem] font-extrabold uppercase">
                      <span>Nome do aluno</span><span>Matrícula</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {(mockClassRosters[item.id] ?? []).map(([name, enrollment]) => (
                        <div key={name} className="grid grid-cols-2 gap-4 px-4 py-3 text-[0.68rem]">
                          <span>{name}</span>
                          <span className="text-muted">{enrollment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {selectedMetric === "Calendário de Avaliações e Entregas" &&
                mockMaterials
                  .filter((item) => item.evaluationDate)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between rounded-xl border border-slate-100 p-4 text-xs">
                      <div>
                        <strong>{item.title}</strong>
                        <div className="mt-1 text-muted">{item.className} · {item.type}</div>
                      </div>
                      <span className="font-bold text-brand-orange">
                        {new Date(`${item.evaluationDate}T12:00:00`).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  ))}

              {selectedMetric === "Calendário de Avaliações e Entregas" && (
                <div className="flex justify-between rounded-xl border border-brand-teal/20 bg-teal-soft p-4 text-xs">
                  <div>
                    <strong>Fechamento das notas do bimestre</strong>
                    <div className="mt-1 text-muted">Todas as turmas</div>
                  </div>
                  <span className="font-bold text-teal-dark">15/12/2026</span>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      <section className="mt-7 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="self-start rounded-3xl bg-brand-orange p-7 text-white shadow-card">
          <div className="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#f3e5ce]">
            Próxima ação
          </div>
                    <p className="mt-2 text-xs leading-5 text-white/55">
            Há uma atividade importante aguardando sua atenção no portal.
          </p>
          {user.profile !== "Facilitador" ? (
            <button
              onClick={() =>
                onNavigate(
                  user.profile === "Professor"
                    ? "classes"
                    : user.profile === "Secretária"
                      ? "documents"
                      : user.profile === "Coordenador"
                        ? "students"
                        : user.profile === "Administrador"
                          ? "system"
                          : "projects",
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-xs font-extrabold"
            >
              {user.profile === "Professor"
                ? "Abrir minhas turmas"
                : user.profile === "Secretária"
                  ? "Validar documentos"
                  : user.profile === "Coordenador"
                    ? "Revisar cadastros"
                    : user.profile === "Administrador"
                      ? "Configurar sistema"
                      : "Acessar agora"}{" "}
              <Icon name="arrow" className="size-4" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate("materials")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-xs font-extrabold"
            >
              Ir para Envio de materiais <Icon name="arrow" className="size-4" />
            </button>
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-base font-extrabold">
            {user.profile === "Coordenador"
              ? "Pendências de gestão"
              : user.profile === "Secretária"
                ? "Guia da Secretaria"
                : "Avisos do perfil"}
          </h2>
          <div className="mt-5 space-y-4">
            {user.profile === "Secretária" ? (
              <>
                <button
                  onClick={() => onNavigate("courses")}
                  className="flex w-full items-center gap-3 rounded-2xl bg-brand-orange p-4 text-left text-white"
                >
                  <span className="card-icon bg-brand-teal text-white">
                    <Icon name="book" />
                  </span>
                  <span>
                    <span className="block text-xs font-extrabold">
                      Aprovar inscrições no curso
                    </span>
                    <span className="mt-1 block text-[0.65rem] text-white/70">
                      Acesse Cursos e analise as solicitações pendentes.
                    </span>
                  </span>
                  <Icon name="arrow" className="ml-auto size-4" />
                </button>
                <div className="rounded-2xl bg-[#f3e5ce] p-4 text-xs leading-5 text-ink/70">
                  Use esta etapa antes de formar as turmas: aprove as inscrições e depois distribua os alunos pelo limite de vagas de cada turma.
                </div>
              </>
            ) : user.profile === "Coordenador" ? (
              <>
                <div className="flex gap-3">
                  <span className="mt-1 size-2 rounded-full bg-brand-orange" />
                  <div>
                    <div className="text-xs font-bold">4 cadastros para validar</div>
                    <div className="mt-1 text-[0.65rem] text-muted">
                      Alunos, professores e convidados
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 size-2 rounded-full bg-brand-teal" />
                  <div>
                    <div className="text-xs font-bold">2 projetos em planejamento</div>
                    <div className="mt-1 text-[0.65rem] text-muted">
                      Aguardando definição de cursos
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <span className="mt-1 size-2 rounded-full bg-brand-orange" />
                  <div>
                    <div className="text-xs font-bold">Acompanhe suas notificações</div>
                    <div className="mt-1 text-[0.65rem] text-muted">
                      Novos avisos aparecem no ícone de sino
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 size-2 rounded-full bg-brand-teal" />
                  <div>
                    <div className="text-xs font-bold">Mantenha seus dados atualizados</div>
                    <div className="mt-1 text-[0.65rem] text-muted">
                      Revise suas configurações de perfil
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


