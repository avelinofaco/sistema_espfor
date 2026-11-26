import {
  Lecture,
  LectureParticipant,
  ProjectStatus,
  SessionUser,
  StudentRecord,
} from "../types"
import {
  mockEnrollmentPeriods,
  mockRegistrationRequests,
  studentData,
} from "../data/mockData"

export function nameFromIdentifier(identifier: string) {
  const source = identifier.includes("@")
    ? identifier.split("@")[0]
    : identifier
  const normalized = source
    .replace(/[._-]+/g, " ")
    .replace(/\d+/g, "")
    .trim()
  if (!normalized) return "Usuário"
  return normalized
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

export function mockCpfForUser(user: SessionUser) {
  const registeredCpf = mockRegistrationRequests.find(
    (item) => item.name === user.name,
  )?.cpf
  if (registeredCpf) return registeredCpf
  const seed = Array.from(user.name).reduce(
    (total: number, character: string) => total + character.charCodeAt(0),
    0,
  )
  return String(10000000000 + ((seed * 7919) % 89999999999)).slice(0, 11)
}

export function currentDate() {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date())
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function projectStatus(start: string, end: string): ProjectStatus {
  const today = new Date().toISOString().slice(0, 10)
  if (today < start) return "Planejado"
  if (today > end) return "Concluído"
  return "Em andamento"
}

export function enrollmentPeriodLabel(title: string) {
  const period = mockEnrollmentPeriods[title]
  if (!period) return "Não definido"
  return `${new Date(`${period.start}T12:00:00`).toLocaleDateString("pt-BR")} a ${new Date(`${period.end}T12:00:00`).toLocaleDateString("pt-BR")}`
}

export function enrollmentIsOpen(title: string) {
  const period = mockEnrollmentPeriods[title]
  const today = new Date().toISOString().slice(0, 10)
  return Boolean(period && period.start <= today && today <= period.end)
}

export function downloadDocument(title: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `${title.toLocaleLowerCase("pt-BR").replace(/\s+/g, "-")}.txt`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function downloadExport(
  title: string,
  content: string,
  extension: "csv" | "xlsx" | "pdf",
) {
  const mime =
    extension === "csv"
      ? "text/csv;charset=utf-8"
      : extension === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf"
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `${title.toLocaleLowerCase("pt-BR").replace(/\s+/g, "-")}.${extension}`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function formatLectureDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`))
}

export function lectureCertificateContent(
  lecture: Lecture,
  participant: LectureParticipant,
) {
  return `CERTIFICADO DE PALESTRA\nNúmero de Registro: #${participant.certificateRegistration ?? "Pendente"}\n\nA Escola de Saúde Pública de Fortaleza certifica que ${participant.name}, CPF ${participant.cpf}, participou da palestra “${lecture.title}”, realizada em ${formatLectureDate(lecture.date)}, às ${lecture.time}.\n\nESPFOR · Prefeitura de Fortaleza`
}

export function studentRosterEntry(name: string): StudentRecord {
  const existing = studentData.find(
    ([studentName]: string[]) => studentName === name,
  )
  if (existing) return existing
  const registration = mockRegistrationRequests.find(
    (item) => item.name === name,
  )
  return [
    name,
    `ESP.${registration?.id ?? Date.now()}`,
    registration?.email ??
      `${name.toLocaleLowerCase("pt-BR").replace(/\s+/g, ".")}@aluno.edu.br`,
  ]
}
