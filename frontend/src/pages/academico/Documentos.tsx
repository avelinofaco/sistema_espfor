import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeading } from "../../components/PageHeading"
import {
  mockRegistrationRequests,
  systemState,
  mockUserNotifications,
  mockLectures,
  mockUploadedDocuments,
  mockDocumentRequests,
  mockDocumentArchive,
} from "../../data/mockData"
import {
  AcademicDocumentRequest,
  ArchivedDocument,
  Profile,
  SessionUser,
  UploadedDocumentStatus,
} from "../../types"
import {
  mockCpfForUser,
  downloadExport,
  formatLectureDate,
  lectureCertificateContent,
} from "../../utils/helpers"

export function StudentDocumentsPage({ user }: { user: SessionUser }) {
  const [documentType, setDocumentType] = useState(
    "Declaração de comparecimento",
  )
  const [documentCourse, setDocumentCourse] = useState(
    "Vigilância em Saúde e Atenção Primária",
  )
  const [documentRequests, setDocumentRequests] = useState(() =>
    mockDocumentRequests.filter((request) => request.student === user.name),
  )
  const [secondCopyRecord, setSecondCopyRecord] = useState<{
    course: string
    type: string
    attendance: number
    grade: number
    completed: boolean
  } | null>(null)
  const [uploads, setUploads] = useState<Record<string, string>>({
    Identidade: "identidade-frente-verso.pdf",
  })
  const records = [
    {
      course: "Vigilância em Saúde e Atenção Primária",
      attendance: 92,
      grade: 8.6,
      completed: true,
    },
    {
      course: "Planejamento e Gestão em Saúde",
      attendance: 81,
      grade: 7.8,
      completed: false,
    },
    {
      course: "Primeiros Socorros",
      attendance: 68,
      grade: 8.1,
      completed: true,
    },
  ]
  const selectedRecord = records.find(
    (record) => record.course === documentCourse,
  )
  const certificateEligible = Boolean(
    selectedRecord?.completed &&
      selectedRecord.attendance >= 75 &&
      selectedRecord.grade >= 7,
  )
  const academicSituation = selectedRecord?.completed
    ? "Concluído"
    : "Em andamento"
  const lectureCertificates = mockLectures.flatMap((lecture) =>
    lecture.certificatesIssued
      ? lecture.participants
          .filter(
            (participant) =>
              participant.name === user.name &&
              participant.role === "Aluno" &&
              participant.present,
          )
          .map((participant) => ({ lecture, participant }))
      : [],
  )

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Minha documentação"
        title="Declarações e certificados"
        description="Solicite seu certificado quando os critérios forem atendidos. A Secretaria fará a validação final antes da emissão."
        action={
          <span className="badge badge-blue">
            Critério: 75% de presença e média igual ou superior a 7,0
          </span>
        }
      />
      {lectureCertificates.length > 0 && (
        <section className="mt-8 rounded-3xl border border-brand-teal/20 bg-teal-soft/40 p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="card-icon bg-white text-brand-teal">
              <Icon name="certificate" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">
                Certificados de palestra
              </h2>
              <p className="mt-1 text-xs text-muted">
                Documentos liberados pela Secretaria após a confirmação de
                presença.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {lectureCertificates.map(({ lecture, participant }) => (
              <div
                key={lecture.id}
                className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="text-xs font-extrabold">
                    Certificado de Palestra
                  </div>
                  <div className="mt-1 text-[0.62rem] text-muted">
                    {lecture.title} · {formatLectureDate(lecture.date)}
                  </div>
                </div>
                <button
                  onClick={() =>
                    downloadExport(
                      `Certificado - ${lecture.title}`,
                      lectureCertificateContent(lecture, participant),
                      "pdf",
                    )
                  }
                  className="rounded-xl bg-brand-orange px-4 py-3 text-xs font-extrabold text-white"
                >
                  Baixar PDF
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div>
          <h2 className="text-lg font-extrabold">
            Solicitar documento acadêmico
          </h2>
          <p className="mt-1 text-xs text-muted">
            A Secretaria analisará a solicitação e emitirá o documento.
            Declarações não exigem frequência ou média mínima.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.2fr]">
          <label>
            <span className="field-label">Documento</span>
            <select
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
              className="standalone-input"
            >
              <option>Declaração de comparecimento</option>
              <option>Declaração de participação</option>
              <option>Certificado de conclusão</option>
            </select>
          </label>
          <label>
            <span className="field-label">Curso relacionado</span>
            <select
              value={documentCourse}
              onChange={(event) => setDocumentCourse(event.target.value)}
              className="standalone-input"
            >
              {records.map((record) => (
                <option key={record.course}>{record.course}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="field-label">Nome completo do aluno</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span className="field-label">CPF</span>
              <strong>{mockCpfForUser(user)}</strong>
            </div>
            <div>
              <span className="field-label">Matrícula</span>
              <strong>2026.ESP.001</strong>
            </div>
            <div>
              <span className="field-label">Curso</span>
              <strong>{documentCourse}</strong>
            </div>
            <div>
              <span className="field-label">Tipo de documento</span>
              <strong>{documentType}</strong>
            </div>
            <div>
              <span className="field-label">Frequência</span>
              <strong>{selectedRecord?.attendance ?? 0}%</strong>
            </div>
            <div>
              <span className="field-label">Média</span>
              <strong>{selectedRecord?.grade ?? 0}</strong>
            </div>
            <div>
              <span className="field-label">Situação</span>
              <strong>{academicSituation}</strong>
            </div>
          </div>
          <button
            disabled={
              documentType === "Certificado de conclusão" &&
              !certificateEligible
            }
            onClick={() => {
              const registration = mockRegistrationRequests.find(
                (item) => item.name === user.name,
              )
              const request: AcademicDocumentRequest = {
                id: Date.now(),
                student: user.name,
                cpf: registration?.cpf ?? mockCpfForUser(user),
                enrollment: "2026.ESP.001",
                course: documentCourse,
                type: documentType,
                attendance: selectedRecord?.attendance ?? 0,
                grade: selectedRecord?.grade ?? 0,
                situation: academicSituation,
                status: "Pendente",
                issuance: "1ª Via",
              }
              mockDocumentRequests.unshift(request)
              setDocumentRequests((current) => [request, ...current])
            }}
            className="primary-button mt-5 sm:w-auto disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            Solicitar documento
          </button>
        </div>
        {documentType === "Certificado de conclusão" &&
          !certificateEligible && (
            <p className="mt-3 text-xs font-semibold text-brand-orange">
              Certificado indisponível: este curso ainda não atende aos
              critérios de conclusão, presença mínima de 75% e média 7,0.
            </p>
          )}
        {documentRequests.length > 0 && (
          <div className="mt-5 space-y-2">
            {documentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs"
              >
                <span>
                  <strong>{request.type}</strong> · {request.course} ·{" "}
                  {request.issuance}
                </span>
                <span className="badge badge-orange">{request.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="mt-8 space-y-4">
        {records.map((record) => {
          const eligible =
            record.completed && record.attendance >= 75 && record.grade >= 7
          return (
            <article
              key={record.course}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <span
                  className={`card-icon ${
                    eligible
                      ? "bg-teal-soft text-brand-teal"
                      : "bg-slate-100 text-muted"
                  }`}
                >
                  <Icon name={eligible ? "certificate" : "lock"} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-extrabold">{record.course}</h2>
                  <div className="mt-3 flex flex-wrap gap-4 text-[0.68rem] font-semibold text-muted">
                    <span>
                      Frequência:{" "}
                      <strong
                        className={
                          record.attendance >= 75
                            ? "text-teal-dark"
                            : "text-brand-orange"
                        }
                      >
                        {record.attendance}%
                      </strong>
                    </span>
                    <span>
                      Média:{" "}
                      <strong
                        className={
                          record.grade >= 7
                            ? "text-teal-dark"
                            : "text-brand-orange"
                        }
                      >
                        {record.grade}
                      </strong>
                    </span>
                    <span>
                      Situação:{" "}
                      <strong className="text-ink">
                        {record.completed ? "Concluído" : "Em andamento"}
                      </strong>
                    </span>
                  </div>
                </div>
                {record.completed && eligible && (
                  <button
                    onClick={() =>
                      setSecondCopyRecord({
                        ...record,
                        type: "Certificado de conclusão",
                      })
                    }
                    className="shrink-0 rounded-xl bg-blue-soft px-4 py-3 text-xs font-extrabold text-brand-blue"
                  >
                    Solicitar 2ª Via
                  </button>
                )}
              </div>
              {!eligible && (
                <p className="mt-4 border-t border-slate-100 pt-4 text-[0.65rem] text-muted">
                  {record.completed
                    ? "Certificado indisponível: é necessário ter ao menos 75% de frequência e média 7."
                    : "O certificado será liberado após a conclusão do curso e o atendimento aos critérios."}
                </p>
              )}
            </article>
          )
        })}
      </section>
      <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div>
          <h2 className="text-base font-extrabold">
            Histórico de documentos emitidos
          </h2>
          <p className="mt-1 text-xs text-muted">
            Solicite uma nova via de declarações ou certificados já concluídos.
          </p>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="card-icon bg-teal-soft text-brand-teal">
              <Icon name="document" />
            </span>
            <div>
              <div className="text-xs font-extrabold">
                Declaração de participação
              </div>
              <div className="mt-1 text-[0.62rem] text-muted">
                Vigilância em Saúde e Atenção Primária · Emitida em 18/12/2025
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              setSecondCopyRecord({
                course: "Vigilância em Saúde e Atenção Primária",
                type: "Declaração de participação",
                attendance: 92,
                grade: 8.6,
                completed: true,
              })
            }
            className="rounded-xl bg-blue-soft px-4 py-3 text-xs font-extrabold text-brand-blue"
          >
            Solicitar 2ª Via
          </button>
        </div>
      </section>
      {secondCopyRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <span className="card-icon bg-blue-soft text-brand-blue">
              <Icon name="document" />
            </span>
            <h2 className="mt-5 text-xl font-extrabold">Solicitar 2ª Via</h2>
            <p className="mt-2 text-xs leading-5 text-muted">
              Confirme a solicitação de uma nova via de{" "}
              <strong className="text-ink">{secondCopyRecord.type}</strong> para{" "}
              {secondCopyRecord.course}.
            </p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs">
              <div>
                <strong>Aluno:</strong> {user.name}
              </div>
              <div className="mt-2">
                <strong>CPF:</strong> {mockCpfForUser(user)}
              </div>
              <div className="mt-2">
                <strong>Via solicitada:</strong> 2ª Via
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSecondCopyRecord(null)}
                className="secondary-button flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const request: AcademicDocumentRequest = {
                    id: Date.now(),
                    student: user.name,
                    cpf: mockCpfForUser(user),
                    enrollment: "2026.ESP.001",
                    course: secondCopyRecord.course,
                    type: secondCopyRecord.type,
                    attendance: secondCopyRecord.attendance,
                    grade: secondCopyRecord.grade,
                    situation: "Concluído",
                    status: "Pendente",
                    issuance: "2ª Via",
                  }
                  mockDocumentRequests.unshift(request)
                  setDocumentRequests((current) => [request, ...current])
                  setSecondCopyRecord(null)
                }}
                className="primary-button flex-1"
              >
                Confirmar pedido
              </button>
            </div>
          </section>
        </div>
      )}
      <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div>
          <h2 className="text-base font-extrabold">Enviar documentação</h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Envie os arquivos para análise da Coordenação ou Secretaria.
            Formatos aceitos: PDF, JPG e PNG.
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[["Identidade", "Documento de identificação"]].map(
            ([documentName, canonicalName]) => (
              <label
                key={documentName}
                className="cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-brand-teal hover:bg-teal-soft/30"
              >
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      setUploads((current) => ({
                        ...current,
                        [documentName]: file.name,
                      }))
                      const existing = mockUploadedDocuments.find(
                        (item) =>
                          item.student === user.name &&
                          item.document === canonicalName,
                      )
                      if (existing) {
                        existing.file = file.name
                        existing.status = "Pendente"
                      } else {
                        mockUploadedDocuments.unshift({
                          id: Date.now(),
                          student: user.name,
                          document: canonicalName,
                          file: file.name,
                          sent: "Agora",
                          status: "Pendente",
                        })
                      }
                    }
                  }}
                />
                <span
                  className={`card-icon ${
                    uploads[documentName]
                      ? "bg-teal-soft text-brand-teal"
                      : "bg-white text-muted"
                  }`}
                >
                  <Icon name={uploads[documentName] ? "check" : "plus"} />
                </span>
                <span className="mt-4 block text-xs font-extrabold">
                  {documentName}
                </span>
                <span className="mt-2 block truncate text-[0.62rem] text-muted">
                  {uploads[documentName] ?? "Clique para selecionar o arquivo"}
                </span>
                {uploads[documentName] && (
                  <span className="mt-3 inline-flex rounded-full bg-orange-soft px-2.5 py-1 text-[0.6rem] font-extrabold text-brand-orange">
                    Aguardando validação
                  </span>
                )}
              </label>
            ),
          )}
        </div>
        <div className="mt-4 rounded-2xl bg-blue-soft p-4 text-xs leading-5 text-ink/70">
          Para o perfil Aluno, solicitamos apenas a identificação. Diplomas e
          certificados são emitidos pela Secretaria após a validação de
          frequência mínima de 75% e média igual ou superior a 7,0.
        </div>
      </section>
      <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-base font-extrabold">Documentos enviados</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <span className="card-icon bg-teal-soft text-brand-teal">
              <Icon name="check" />
            </span>
            <div>
              <div className="text-xs font-bold">
                Documento de identificação
              </div>
              <div className="mt-1 text-[0.65rem] text-teal-dark">
                Validado pela Secretaria
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <span className="card-icon bg-blue-soft text-brand-blue">
              <Icon name="certificate" />
            </span>
            <div>
              <div className="text-xs font-bold">Diplomas e certificados</div>
              <div className="mt-1 text-[0.65rem] text-muted">
                Emitidos pela Secretaria após aprovação
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function SecretaryDocumentsPage({ profile }: { profile: Profile }) {
  const [documents, setDocuments] = useState(mockUploadedDocuments)
  const [academicRequests, setAcademicRequests] = useState(() => [
    ...mockDocumentRequests,
  ])
  const [selectedAcademicRequest, setSelectedAcademicRequest] =
    useState<AcademicDocumentRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedDocument, setSelectedDocument] =
    useState<typeof mockUploadedDocuments[number] | null>(null)
  const [officialTemplates, setOfficialTemplates] = useState([
    {
      id: 1,
      name: "Certificado padrão ESPFOR",
      format: "DOCX",
      file: "modelo-certificado-espfor.docx",
    },
    {
      id: 2,
      name: "Declaração de participação",
      format: "PDF",
      file: "modelo-declaracao-participacao.pdf",
    },
  ])
  const [selectedTemplate, setSelectedTemplate] =
    useState<typeof officialTemplates[number] | null>(null)
  const [importFeedback, setImportFeedback] = useState("")
  const requestedOfficialTemplate = selectedAcademicRequest
    ? officialTemplates.find((template) =>
        selectedAcademicRequest.type.includes("Certificado")
          ? template.name.includes("Certificado")
          : !template.name.includes("Certificado"),
      )
    : null
  const updateStatus = (id: number, status: UploadedDocumentStatus) =>
    setDocuments((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    )

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Secretaria acadêmica"
        title="Validação de documentação"
        description="Analise os arquivos enviados pelos alunos e mantenha os cadastros acadêmicos regularizados."
        action={
          <span className="badge badge-orange">
            {documents.filter((item) => item.status === "Pendente").length}{" "}
            análises pendentes
          </span>
        }
      />
      <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
        <div className="overflow-x-auto">
          <div className="min-w-[42rem]">
            <div className="grid grid-cols-[1.2fr_1.2fr_0.7fr_0.6fr_auto] gap-4 border-b-2 border-ink/10 px-3 pb-3 text-[0.62rem] font-extrabold uppercase tracking-wider text-ink">
              <span>Aluno</span>
              <span>Documento</span>
              <span>Envio</span>
              <span>Situação</span>
              <span>Visualização</span>
            </div>
            {documents.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1.2fr_1.2fr_0.7fr_0.6fr_auto] items-center gap-4 border-b border-slate-100 px-3 py-4 last:border-0"
              >
                <span className="text-xs font-extrabold">{item.student}</span>
                <span>
                  <span className="block text-[0.68rem] font-semibold text-ink">
                    {item.document}
                  </span>
                  <span className="mt-1 block truncate text-[0.6rem] text-muted">
                    {item.file}
                  </span>
                </span>
                <span className="text-[0.65rem] text-muted">{item.sent}</span>
                <span
                  className={`justify-self-start rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold ${
                    item.status === "Validado"
                      ? "bg-teal-soft text-teal-dark"
                      : item.status === "Recusado"
                        ? "bg-orange-soft text-brand-orange"
                        : "bg-blue-soft text-brand-blue"
                  }`}
                >
                  {item.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDocument(item)}
                    className="rounded-lg bg-blue-soft px-3 text-[0.62rem] font-bold text-brand-blue"
                  >
                    Visualizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {academicRequests.length > 0 && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
          <div>
            <h2 className="text-lg font-extrabold">
              Solicitações de declarações e certificados
            </h2>
            <p className="mt-1 text-xs text-muted">
              Analise os documentos solicitados pelos alunos antes da emissão.
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {academicRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center"
              >
                <div className="grid gap-x-8 gap-y-1 text-[0.68rem] leading-5 text-muted sm:grid-cols-2">
                  <div>
                    <strong className="text-ink">Nome:</strong>{" "}
                    {request.student}
                  </div>
                  <div>
                    <strong className="text-ink">CPF:</strong> {request.cpf}
                  </div>
                  <div>
                    <strong className="text-ink">Matrícula:</strong>{" "}
                    {request.enrollment}
                  </div>
                  <div>
                    <strong className="text-ink">Tipo de documento:</strong>{" "}
                    {request.type}
                  </div>
                  <div>
                    <strong className="text-ink">Via:</strong>{" "}
                    {request.issuance}
                  </div>
                  <div>
                    <strong className="text-ink">Curso:</strong>{" "}
                    {request.course}
                  </div>
                </div>
                {request.status === "Pendente" ? (
                  <button
                    onClick={() => {
                      setSelectedAcademicRequest(request)
                      setRejectionReason("")
                    }}
                    className="rounded-xl bg-brand-blue px-4 py-2.5 text-[0.62rem] font-bold text-white"
                  >
                    Analisar e preparar documento
                  </button>
                ) : (
                  <span
                    className={`badge ${
                      request.status === "Aprovado"
                        ? "badge-teal"
                        : "badge-orange"
                    }`}
                  >
                    {request.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {selectedAcademicRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const registrationNumber = selectedAcademicRequest.type.includes(
                "Certificado",
              )
                ? ++systemState.lastCertificateRegistration
                : undefined
              selectedAcademicRequest.registrationNumber = registrationNumber
              const content = `${selectedAcademicRequest.type.toUpperCase()}\n${selectedAcademicRequest.issuance}\n${
                registrationNumber
                  ? `Número de Registro: #${registrationNumber}`
                  : ""
              }\n\nAluno: ${selectedAcademicRequest.student}\nCPF: ${selectedAcademicRequest.cpf}\nMatrícula: ${selectedAcademicRequest.enrollment}\nCurso: ${selectedAcademicRequest.course}\nFrequência: ${selectedAcademicRequest.attendance}%\nMédia: ${selectedAcademicRequest.grade}\nSituação: ${selectedAcademicRequest.situation}\n\nDocumento gerado a partir do modelo oficial ${requestedOfficialTemplate?.name ?? "cadastrado"}.\nESPFOR`
              selectedAcademicRequest.status = "Aprovado"
              mockDocumentArchive.unshift({
                id: Date.now(),
                student: selectedAcademicRequest.student,
                cpf: selectedAcademicRequest.cpf,
                type: selectedAcademicRequest.type,
                course: selectedAcademicRequest.course,
                issuance: selectedAcademicRequest.issuance,
                year: new Date().getFullYear(),
                registrationNumber,
                issuedAt: new Intl.DateTimeFormat("pt-BR").format(new Date()),
                source: "Sistema",
              })
              setAcademicRequests((current) =>
                current.map((item) =>
                  item.id === selectedAcademicRequest.id
                    ? { ...item, status: "Aprovado" }
                    : item,
                ),
              )
              mockUserNotifications.unshift({
                id: Date.now(),
                requestId: selectedAcademicRequest.id,
                user: selectedAcademicRequest.student,
                title: "Documento disponível",
                message: `${selectedAcademicRequest.type} gerado com o modelo oficial e enviado pela Secretaria.`,
                downloadTitle: selectedAcademicRequest.type,
                downloadContent: content,
              })
              setSelectedAcademicRequest(null)
            }}
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">
                  Preparação e emissão
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-extrabold">
                    {selectedAcademicRequest.type}
                  </h2>
                  <span className="badge badge-orange">
                    {selectedAcademicRequest.issuance}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Solicitação de {selectedAcademicRequest.student}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAcademicRequest(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <section className="mt-6">
              <h3 className="text-sm font-extrabold">Dados do aluno</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Nome completo", selectedAcademicRequest.student],
                  ["CPF", selectedAcademicRequest.cpf],
                  ["Matrícula", selectedAcademicRequest.enrollment],
                  ["Curso", selectedAcademicRequest.course],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-4">
                    <div className="text-[0.6rem] font-bold uppercase tracking-wider text-muted">
                      {label}
                    </div>
                    <div className="mt-2 text-xs font-extrabold">{value}</div>
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-extrabold">Análise da solicitação</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-3">
                  <div className="text-[0.6rem] text-muted">Frequência</div>
                  <div
                    className={`mt-1 text-lg font-extrabold ${
                      selectedAcademicRequest.attendance >= 75
                        ? "text-teal-dark"
                        : "text-brand-orange"
                    }`}
                  >
                    {selectedAcademicRequest.attendance}%
                  </div>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="text-[0.6rem] text-muted">Média</div>
                  <div
                    className={`mt-1 text-lg font-extrabold ${
                      selectedAcademicRequest.grade >= 7
                        ? "text-teal-dark"
                        : "text-brand-orange"
                    }`}
                  >
                    {selectedAcademicRequest.grade}
                  </div>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="text-[0.6rem] text-muted">Situação</div>
                  <div className="mt-1 text-lg font-extrabold">
                    {selectedAcademicRequest.situation}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted">
                {selectedAcademicRequest.type.includes("Certificado")
                  ? "Para emitir o certificado, confirme presença mínima de 75%, média 7,0 e conclusão do curso."
                  : "Declarações não exigem frequência ou média mínima."}
              </p>
            </section>
            <section className="mt-6 rounded-2xl bg-blue-soft p-6">
              <div className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-brand-blue">
                Prévia preenchida automaticamente
              </div>
              <div className="mx-auto mt-5 max-w-2xl rounded-xl bg-white p-7 text-center shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-left text-xs font-extrabold uppercase tracking-wider text-brand-teal">
                    Escola de Saúde Pública de Fortaleza
                  </div>
                  <span className="badge badge-orange">
                    {selectedAcademicRequest.issuance}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-extrabold">
                  {selectedAcademicRequest.type.toUpperCase()}
                </h3>
                {selectedAcademicRequest.type.includes("Certificado") && (
                  <div className="mt-2 text-xs font-extrabold text-brand-blue">
                    Próximo Número de Registro: #
                    {systemState.lastCertificateRegistration + 1}
                  </div>
                )}
                <p className="mt-6 text-sm leading-7 text-muted">
                  Declaramos para os devidos fins que{" "}
                  <strong className="text-ink">
                    {selectedAcademicRequest.student}
                  </strong>
                  , CPF{" "}
                  <strong className="text-ink">
                    {selectedAcademicRequest.cpf}
                  </strong>
                  , matrícula{" "}
                  <strong className="text-ink">
                    {selectedAcademicRequest.enrollment}
                  </strong>
                  , participa do curso{" "}
                  <strong className="text-ink">
                    {selectedAcademicRequest.course}
                  </strong>
                  .
                </p>
                <div className="mt-7 text-xs text-muted">
                  Frequência: {selectedAcademicRequest.attendance}% · Média:{" "}
                  {selectedAcademicRequest.grade} ·{" "}
                  {selectedAcademicRequest.situation}
                </div>
              </div>
            </section>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl bg-teal-soft p-5">
                <div className="text-xs font-extrabold text-teal-dark">
                  Documento pronto para envio
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">
                  {requestedOfficialTemplate
                    ? "O sistema aplicará os dados conferidos ao modelo oficial correspondente."
                    : "Cadastre um modelo oficial compatível antes de enviar."}
                </p>
                <button
                  type="submit"
                  disabled={
                    !requestedOfficialTemplate ||
                    (selectedAcademicRequest.type.includes("Certificado") &&
                      (selectedAcademicRequest.attendance < 75 ||
                        selectedAcademicRequest.grade < 7 ||
                        selectedAcademicRequest.situation !== "Concluído"))
                  }
                  className="primary-button mt-4 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  Enviar ao aluno
                </button>
              </div>
              <div>
                <label className="block">
                  <span className="field-label">Motivo da recusa</span>
                  <textarea
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    className="form-textarea"
                    placeholder="Explique ao aluno o motivo e como regularizar"
                  />
                </label>
                <button
                  type="button"
                  disabled={!rejectionReason.trim()}
                  onClick={() => {
                    selectedAcademicRequest.status = "Recusado"
                    setAcademicRequests((current) =>
                      current.map((item) =>
                        item.id === selectedAcademicRequest.id
                          ? { ...item, status: "Recusado" }
                          : item,
                      ),
                    )
                    mockUserNotifications.unshift({
                      id: Date.now(),
                      requestId: selectedAcademicRequest.id,
                      user: selectedAcademicRequest.student,
                      title: "Solicitação de documento recusada",
                      message: rejectionReason,
                    })
                    setSelectedAcademicRequest(null)
                  }}
                  className="mt-3 h-11 w-full rounded-xl bg-orange-soft text-xs font-extrabold text-brand-orange disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Recusar e notificar aluno
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {(profile === "Secretária" || profile === "Coordenador") && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
          <div>
            <h2 className="text-lg font-extrabold">Documentos oficiais</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              Cadastre modelos de certificados e declarações. O sistema
              selecionará automaticamente o modelo correspondente à solicitação
              do aluno.
            </p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              const file = form.get("templateFile") as File
              setOfficialTemplates((current) => [
                {
                  id: Date.now(),
                  name: String(form.get("templateName")),
                  format: file?.name.toLowerCase().endsWith(".pdf")
                    ? "PDF"
                    : "DOCX",
                  file: file?.name ?? "modelo.docx",
                },
                ...current,
              ])
              ;(event.currentTarget as HTMLFormElement).reset()
            }}
            className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 md:grid-cols-[1fr_1fr_auto]"
          >
            <label>
              <span className="field-label">Nome do modelo</span>
              <input
                name="templateName"
                required
                className="standalone-input"
                placeholder="Ex.: Certificado curso livre"
              />
            </label>
            <label>
              <span className="field-label">Arquivo PDF ou Word</span>
              <input
                name="templateFile"
                required
                type="file"
                accept=".pdf,.doc,.docx"
                className="block h-14 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-blue-soft file:px-3 file:py-2 file:text-xs file:font-bold file:text-brand-blue"
              />
            </label>
            <button className="primary-button self-end md:w-auto">
              Cadastrar layout
            </button>
          </form>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {officialTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
              >
                <span className="card-icon bg-blue-soft text-brand-blue">
                  <Icon name="certificate" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold">{template.name}</div>
                  <div className="mt-1 truncate text-[0.62rem] text-muted">
                    {template.file}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="rounded-xl bg-blue-soft px-4 py-2.5 text-xs font-extrabold text-brand-blue"
                >
                  Visualizar
                </button>
                <button
                  onClick={() =>
                    setOfficialTemplates((current) =>
                      current.filter((item) => item.id !== template.id),
                    )
                  }
                  className="rounded-xl bg-orange-soft px-4 py-2.5 text-xs font-extrabold text-brand-orange"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      {profile === "Secretária" && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
          <div className="flex items-center gap-4">
            <span className="card-icon bg-orange-soft text-brand-orange">
              <Icon name="document" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">
                Importar Base Histórica (Planilha)
              </h2>
              <p className="mt-1 text-xs text-muted">
                Adicione certificados legados ao Acervo de Documentos e continue
                a numeração sequencial.
              </p>
            </div>
          </div>
          <label className="mt-5 block cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-brand-teal">
            <input
              type="file"
              accept=".xlsx,.csv"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                const historical = Array.from(
                  { length: 2148 },
                  (_, index): ArchivedDocument => ({
                    id: 100000 + index,
                    student: `Registro Histórico ${String(index + 1).padStart(4, "0")}`,
                    cpf: String(10000000000 + index),
                    type: "Certificado de conclusão",
                    course: [
                      "Vigilância em Saúde",
                      "Atenção Primária",
                      "Saúde Mental",
                    ][index % 3],
                    issuance: "1ª Via",
                    year: 2024 + (index % 3),
                    registrationNumber: index + 1,
                    issuedAt: `15/06/${2024 + (index % 3)}`,
                    source: "Base histórica",
                  }),
                )
                const systemDocuments = mockDocumentArchive.filter(
                  (document) => document.source === "Sistema",
                )
                mockDocumentArchive.splice(
                  0,
                  mockDocumentArchive.length,
                  ...historical,
                  ...systemDocuments,
                )
                systemState.lastCertificateRegistration = 2148
                setImportFeedback(
                  "2.148 certificados importados com sucesso — Último número identificado: #2148",
                )
                event.target.value = ""
              }}
            />
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="text-xs font-extrabold">
                  Selecionar planilha .xlsx ou .csv
                </div>
                <div className="mt-1 text-[0.62rem] text-muted">
                  O sistema identifica duplicidades e o último número de
                  registro.
                </div>
              </div>
              <span className="rounded-xl bg-brand-orange px-4 py-3 text-xs font-extrabold text-white">
                Escolher arquivo
              </span>
            </div>
          </label>
          {importFeedback && (
            <div className="mt-4 rounded-2xl bg-teal-soft p-4 text-xs font-extrabold text-teal-dark">
              <div className="flex items-center gap-2">
                <Icon name="check" className="size-4" />
                {importFeedback}
              </div>
              <div className="mt-2 text-[0.65rem] font-semibold text-ink/65">
                Próximo certificado gerado pelo sistema: #2149
              </div>
            </div>
          )}
        </section>
      )}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm">
          <section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">
                  Modelo oficial
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {selectedTemplate.name}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {selectedTemplate.file}
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 rounded-2xl bg-slate-100 p-6 sm:p-10">
              <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-lg">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-teal">
                  Escola de Saúde Pública de Fortaleza
                </div>
                <h3 className="mt-8 text-3xl font-extrabold text-ink">
                  {selectedTemplate.name.includes("Certificado")
                    ? "CERTIFICADO"
                    : "DECLARAÇÃO"}
                </h3>
                <p className="mt-8 text-sm leading-7 text-muted">
                  Certificamos que{" "}
                  <strong className="text-ink">[NOME DO ALUNO]</strong> concluiu
                  o curso <strong className="text-ink">[NOME DO CURSO]</strong>,
                  com carga horária de{" "}
                  <strong className="text-ink">[CARGA HORÁRIA]</strong>,
                  realizado no período de{" "}
                  <strong className="text-ink">[PERÍODO]</strong>.
                </p>
                <div className="mx-auto mt-12 h-px w-48 bg-slate-300" />
                <div className="mt-2 text-xs font-bold">
                  Assinatura da Secretaria
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm">
          <section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">
                  Documento enviado pelo aluno
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {selectedDocument.document}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {selectedDocument.student} · {selectedDocument.file}
                </p>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="self-start rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="flex min-h-[28rem] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-6">
                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-soft text-brand-blue">
                    <Icon name="document" className="size-8" />
                  </div>
                  <div className="mt-5 text-sm font-extrabold">
                    {selectedDocument.file}
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    Pré-visualização do documento enviado
                  </div>
                  <div className="mx-auto mt-8 h-2 w-4/5 rounded bg-slate-100" />
                  <div className="mx-auto mt-3 h-2 w-3/5 rounded bg-slate-100" />
                  <div className="mx-auto mt-3 h-2 w-4/5 rounded bg-slate-100" />
                  <div className="mx-auto mt-10 size-20 rounded-full border-4 border-brand-blue/20" />
                </div>
              </div>
              <aside className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-extrabold">Análise</h3>
                <div className="mt-5 space-y-4 text-xs">
                  <div>
                    <div className="text-[0.62rem] text-muted">Aluno</div>
                    <div className="mt-1 font-bold">
                      {selectedDocument.student}
                    </div>
                  </div>
                  <div>
                    <div className="text-[0.62rem] text-muted">
                      Data do envio
                    </div>
                    <div className="mt-1 font-bold">
                      {selectedDocument.sent}
                    </div>
                  </div>
                  <div>
                    <div className="text-[0.62rem] text-muted">Situação</div>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-[0.62rem] font-extrabold ${
                        selectedDocument.status === "Validado"
                          ? "bg-teal-soft text-teal-dark"
                          : "bg-orange-soft text-brand-orange"
                      }`}
                    >
                      {selectedDocument.status}
                    </span>
                  </div>
                </div>
                <label className="mt-6 block">
                  <span className="field-label">Observação da análise</span>
                  <textarea
                    className="form-textarea min-h-24"
                    placeholder="Registre uma observação, se necessário"
                  />
                </label>
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => {
                      updateStatus(selectedDocument.id, "Validado")
                      setSelectedDocument(null)
                    }}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-teal text-xs font-extrabold text-white"
                  >
                    <Icon name="check" className="size-4" /> Validar documento
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedDocument.id, "Recusado")
                      setSelectedDocument(null)
                    }}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-orange-soft text-xs font-extrabold text-brand-orange"
                  >
                    Recusar documento
                  </button>
                </div>
              </aside>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export function DocumentArchivePage() {
  const [year, setYear] = useState("2026")
  const [query, setQuery] = useState("")
  const [type, setType] = useState("Todos")
  const [issuance, setIssuance] = useState("Todas")
  const [selected, setSelected] = useState<ArchivedDocument | null>(null)
  const years = [
    ...new Set(mockDocumentArchive.map((document) => document.year)),
  ].sort((a, b) => b - a)
  const filtered = mockDocumentArchive.filter(
    (document) =>
      String(document.year) === year &&
      (type === "Todos" || document.type.startsWith(type)) &&
      (issuance === "Todas" || document.issuance === issuance) &&
      (!query ||
        `${document.student} ${document.cpf}`
          .toLocaleLowerCase("pt-BR")
          .includes(query.toLocaleLowerCase("pt-BR"))),
  )
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Repositório institucional"
        title="Acervo de Documentos"
        description="Consulte certificados e declarações emitidos pelo sistema e importados da base histórica."
        action={
          <span className="badge badge-blue">
            {mockDocumentArchive.length.toLocaleString("pt-BR")} documentos
            armazenados
          </span>
        }
      />
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label>
            <span className="field-label">Ano</span>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="standalone-input"
            >
              {years.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="field-label">Aluno / CPF</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="standalone-input"
              placeholder="Buscar nome ou CPF"
            />
          </label>
          <label>
            <span className="field-label">Tipo de documento</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="standalone-input"
            >
              <option>Todos</option>
              <option>Certificado</option>
              <option>Declaração</option>
            </select>
          </label>
          <label>
            <span className="field-label">Via</span>
            <select
              value={issuance}
              onChange={(event) => setIssuance(event.target.value)}
              className="standalone-input"
            >
              <option>Todas</option>
              <option>1ª Via</option>
              <option>2ª Via</option>
            </select>
          </label>
        </div>
      </section>
      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
        <div className="flex justify-between gap-4 border-b border-slate-100 p-6">
          <div>
            <h2 className="text-lg font-extrabold">Documentos de {year}</h2>
            <p className="mt-1 text-xs text-muted">
              {filtered.length.toLocaleString("pt-BR")} registros encontrados
              {filtered.length > 50 ? " · exibindo os 50 mais recentes" : ""}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[62rem]">
            <div className="grid grid-cols-[1.2fr_0.8fr_1.2fr_0.5fr_0.7fr_auto] gap-4 bg-slate-50 px-6 py-4 text-[0.6rem] font-extrabold uppercase text-muted">
              <span>Aluno / CPF</span>
              <span>Documento</span>
              <span>Curso / Atividade</span>
              <span>Via</span>
              <span>Registro</span>
              <span>Ações</span>
            </div>
            {filtered.slice(0, 50).map((document) => (
              <div
                key={document.id}
                className="grid grid-cols-[1.2fr_0.8fr_1.2fr_0.5fr_0.7fr_auto] items-center gap-4 border-t border-slate-100 px-6 py-4 text-xs"
              >
                <div>
                  <strong>{document.student}</strong>
                  <div className="mt-1 text-[0.62rem] text-muted">
                    {document.cpf}
                  </div>
                </div>
                <span>{document.type}</span>
                <span className="text-muted">{document.course}</span>
                <span className="badge badge-blue justify-self-start">
                  {document.issuance}
                </span>
                <span className="font-extrabold text-brand-blue">
                  {document.registrationNumber
                    ? `#${document.registrationNumber}`
                    : "—"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(document)}
                    className="rounded-lg bg-blue-soft px-3 py-2 text-[0.62rem] font-extrabold text-brand-blue"
                  >
                    Visualizar
                  </button>
                  <button
                    onClick={() =>
                      downloadExport(
                        `${document.type}-${document.student}`,
                        `${document.type.toUpperCase()}\n${document.issuance}\n${
                          document.registrationNumber
                            ? `Registro #${document.registrationNumber}`
                            : ""
                        }\n\nAluno: ${document.student}\nCPF: ${document.cpf}\nCurso: ${document.course}\nEmissão: ${document.issuedAt}`,
                        "pdf",
                      )
                    }
                    className="rounded-lg bg-orange-soft px-3 py-2 text-[0.62rem] font-extrabold text-brand-orange"
                  >
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm">
          <section className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">
                  Documento arquivado
                </div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {selected.type}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 rounded-2xl bg-slate-100 p-6">
              <div className="rounded-xl bg-white p-8 text-center shadow-card">
                <div className="flex justify-between">
                  <strong className="text-xs uppercase text-brand-teal">
                    ESPFOR
                  </strong>
                  <span className="badge badge-orange">
                    {selected.issuance}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-extrabold">
                  {selected.type.toUpperCase()}
                </h3>
                {selected.registrationNumber && (
                  <div className="mt-2 text-xs font-extrabold text-brand-blue">
                    Número de Registro #{selected.registrationNumber}
                  </div>
                )}
                <p className="mt-8 text-sm leading-7 text-muted">
                  Documento emitido para{" "}
                  <strong className="text-ink">{selected.student}</strong>, CPF{" "}
                  {selected.cpf}, referente a{" "}
                  <strong className="text-ink">{selected.course}</strong>.
                </p>
                <div className="mt-8 text-xs text-muted">
                  Emitido em {selected.issuedAt} · Origem: {selected.source}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export function LectureCertificatesPage({ user }: { user: SessionUser }) {
  const certificates = mockLectures.flatMap((lecture) =>
    lecture.certificatesIssued
      ? lecture.participants
          .filter(
            (participant) =>
              participant.present &&
              (participant.name === user.name ||
                (user.name === "Facilitador" &&
                  participant.role === "Facilitador")),
          )
          .map((participant) => ({ lecture, participant }))
      : [],
  )
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        eyebrow="Documentos pessoais"
        title="Certificados e declarações"
        description="Acesse os certificados liberados pela Secretaria após a confirmação de presença."
        action={
          <span className="badge badge-blue">
            {certificates.length} disponíveis
          </span>
        }
      />
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-extrabold">Certificados de palestra</h2>
        <div className="mt-5 space-y-3">
          {certificates.length ? (
            certificates.map(({ lecture, participant }) => (
              <div
                key={lecture.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="card-icon bg-blue-soft text-brand-blue">
                    <Icon name="certificate" />
                  </span>
                  <div>
                    <div className="text-sm font-extrabold">
                      Certificado de Palestra
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      {lecture.title} · {formatLectureDate(lecture.date)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    downloadExport(
                      `Certificado - ${lecture.title}`,
                      lectureCertificateContent(lecture, participant),
                      "pdf",
                    )
                  }
                  className="rounded-xl bg-brand-orange px-5 py-3 text-xs font-extrabold text-white"
                >
                  Baixar PDF
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-slate-50 p-8 text-center text-xs text-muted">
              Os certificados aparecerão aqui após a emissão pela Secretaria.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
