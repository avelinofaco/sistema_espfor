export type IconName = "arrow" | "bell" | "book" | "building" | "calendar" | "certificate" | "check" | "chevron" | "clock" | "document" | "eye" | "folder" | "grid" | "help" | "lock" | "mail" | "menu" | "more" | "plus" | "search" | "students" | "user" | "users"

export type Profile = "Aluno" | "Coordenador" | "Professor" | "Secretária" | "Facilitador" | "Administrador"

export type SessionUser = {
  name: string
  profile: Profile
}

export type AppScreen = "login" | "register" | "support" | "dashboard"

export type DashboardView = "overview" | "projects" | "courses" | "classes" | "students" | "attendance" | "documents" | "documentArchive" | "materials" | "lectures" | "auditLogs" | "reports" | "system" | "settings"

export type IconProfile = {
  name: Profile
  description: string
  icon: IconName
}

export type NavigationItem = {
  id: DashboardView
  label: string
  icon: IconName
}

export type RoleOverviewContent = {
  message: string
  stats: [string, string, IconName, string][]
  task: string
}

export type RoleOverviews = Record<Profile, RoleOverviewContent>

export type AppSystemState = {
  activeAttendanceForm: AttendanceForm | null
  lastCertificateRegistration: number
}

export type RegistrationStatus = "Pendente" | "Aprovado" | "Recusado"

export type RegistrationRequest = {
  id: number
  name: string
  email: string
  cpf: string
  profession: string
  profile: Profile
  unit: string
  role: string
  status: RegistrationStatus
}

export type ProjectStatus = "Planejado" | "Em andamento" | "Concluído"

export type Project = {
  name: string
  description: string
  period: string
  courses: number
  people: number
  status: ProjectStatus
  color: "orange" | "teal" | "blue"
  responsible: string
  start: string
  end: string
}

export type CourseStatus = "Ativo" | "Concluído" | "Planejamento"
export type CourseType = "Projeto" | "Avulso"

export type Course = {
  title: string
  project: string
  hours: string
  classes: number
  students: number
  vacancies: number
  type: CourseType
  status: CourseStatus
  schedule: string
  start: string
  end: string
}

export type CourseEnrollmentPeriod = {
  start: string
  end: string
}

export type EnrollmentStatus = "Pendente" | "Aprovada" | "Recusada"

export type EnrollmentRequest = {
  id: number
  student: string
  course: string
  requested: string
  status: EnrollmentStatus
}

export type CatalogCourse = {
  id: number
  title: string
  category: string
  hours: number
  period: string
  places: number
  format: string
  color: "teal" | "orange" | "blue"
}

export type CourseClass = {
  id: number
  name: string
  course: string
  schedule: string
  students: number
  room: string
  start: string
  end: string
}

export type StudentRecord = [name: string, enrollment: string, email: string]

export type UploadedDocumentStatus = "Pendente" | "Validado" | "Recusado"

export type UploadedDocument = {
  id: number
  student: string
  document: string
  file: string
  sent: string
  status: UploadedDocumentStatus
}

export type CourseMaterial = {
  id: number
  title: string
  type: string
  course: string
  className: string
  file: string
  date: string
  evaluationDate: string
}

export type AssessmentType = "Prova" | "Trabalho" | "Estudo de caso" | ""

export type StudentGrades = {
  note1: string
  note2: string
  note3: string
}

export type EmailNotification = {
  email: string
  subject: string
  message: string
}

export type AttendanceForm = {
  id: number
  course: string
  className: string
  date: string
  content: string
  validity: number
  link: string
  attendees: AttendanceAttendee[]
}

export type AttendanceAttendee = {
  name: string
  cpf: string
  registeredAt: string
}

export type UserNotification = {
  id: number
  requestId: number
  user?: string
  role?: Profile
  title: string
  message: string
  downloadTitle?: string
  downloadContent?: string
  downloadUrl?: string
  downloadFileName?: string
}

export type LectureParticipant = {
  name: string
  cpf: string
  unit: string
  role: "Aluno" | "Facilitador"
  present: boolean
  certificateRegistration?: number
}

export type Lecture = {
  id: number
  title: string
  date: string
  time: string
  location: string
  capacity: number
  speaker: string
  pin: string
  attendanceOpen: boolean
  certificatesIssued: boolean
  participants: LectureParticipant[]
}

export type LectureMaterial = {
  id: number
  lectureId: number
  speaker: string
  type: "Slides" | "Referências bibliográficas"
  fileName: string
  fileUrl?: string
}

export type AcademicDocumentRequest = {
  id: number
  student: string
  cpf: string
  enrollment: string
  course: string
  type: string
  attendance: number
  grade: number
  situation: string
  status: "Pendente" | "Aprovado" | "Recusado"
  issuance: "1ª Via" | "2ª Via"
  registrationNumber?: number
}

export type ArchivedDocument = {
  id: number
  student: string
  cpf: string
  type: string
  course: string
  issuance: "1ª Via" | "2ª Via"
  year: number
  registrationNumber?: number
  issuedAt: string
  source: "Sistema" | "Base histórica"
}

export type CalendarEvent = {
  id: number
  date: string
  title: string
  type: string
  audience: Profile
}

export type AuditLog = {
  id: number
  date: string
  time: string
  user: string
  profile: string
  action: string
  details: string
  status: string
}
