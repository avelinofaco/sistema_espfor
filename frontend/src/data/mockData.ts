import {
  AcademicDocumentRequest,
  AppSystemState,
  AuditLog,
  AssessmentType,
  ArchivedDocument,
  AttendanceForm,
  CatalogCourse,
  Course,
  CourseClass,
  CourseEnrollmentPeriod,
  CourseMaterial,
  DashboardView,
  EmailNotification,
  EnrollmentRequest,
  IconName,
  IconProfile,
  Lecture,
  LectureMaterial,
  NavigationItem,
  Profile,
  Project,
  RegistrationRequest,
  RoleOverviews,
  StudentGrades,
  StudentRecord,
  UploadedDocument,
  UserNotification,
} from "../types"
import { projectStatus } from "../utils/helpers"

export const profiles: IconProfile[] = [
  { name: "Aluno", description: "Participante", icon: "user" },
  { name: "Coordenador", description: "Gestão acadêmica", icon: "grid" },
  { name: "Professor", description: "Corpo docente", icon: "book" },
  { name: "Secretária", description: "Apoio administrativo", icon: "document" },
  { name: "Facilitador", description: "Convidado externo", icon: "users" },
  { name: "Administrador", description: "Governança do sistema", icon: "grid" },
]

export const navigation: NavigationItem[] = [
  { id: "overview", label: "Visão geral", icon: "grid" },
  { id: "projects", label: "Projetos", icon: "folder" },
  { id: "courses", label: "Cursos", icon: "book" },
  { id: "classes", label: "Turmas", icon: "users" },
  { id: "students", label: "Alunos", icon: "students" },
  { id: "attendance", label: "Frequência", icon: "calendar" },
  { id: "documents", label: "Documentação", icon: "document" },
  { id: "documentArchive", label: "Acervo de Documentos", icon: "folder" },
  { id: "materials", label: "Materiais", icon: "folder" },
  { id: "lectures", label: "Palestras", icon: "calendar" },
  { id: "auditLogs", label: "Logs de Auditoria", icon: "lock" },
  { id: "reports", label: "Relatórios", icon: "grid" },
  { id: "system", label: "Configuração geral", icon: "building" },
]

export const mockRegistrationRequests: RegistrationRequest[] = [
  {
    id: 4,
    name: "Juliana Costa",
    email: "juliana@aluno.edu.br",
    cpf: "12345678901",
    profession: "Enfermeiro",
    profile: "Aluno",
    unit: "Universidade de Fortaleza",
    role: "Aluno",
    status: "Pendente",
  },
  {
    id: 1,
    name: "Rafael Moura",
    email: "rafael@fortaleza.ce.gov.br",
    cpf: "23456789012",
    profession: "Enfermeiro",
    profile: "Professor",
    unit: "UAPS José Walter",
    role: "Enfermeiro",
    status: "Pendente",
  },
  {
    id: 2,
    name: "Lívia Andrade",
    email: "livia@hospital.ce.gov.br",
    cpf: "34567890123",
    profession: "Psicóloga",
    profile: "Facilitador",
    unit: "Hospital da Mulher",
    role: "Psicóloga convidada",
    status: "Aprovado",
  },
  {
    id: 3,
    name: "Marcos Vieira",
    email: "marcos@samu.ce.gov.br",
    cpf: "45678901234",
    profession: "Médico",
    profile: "Professor",
    unit: "SAMU Fortaleza",
    role: "Médico",
    status: "Pendente",
  },
]

export const projectData: Project[] = [
  {
    name: "Fortaleza Mais Saúde",
    description: "Formação continuada para equipes da atenção primária.",
    period: "15 ago — 20 dez 2024",
    courses: 4,
    people: 186,
    status: projectStatus("2024-08-15", "2024-12-20"),
    color: "orange",
    responsible: "Carla Souza",
    start: "2024-08-15",
    end: "2024-12-20",
  },
  {
    name: "Cuidar de Quem Cuida",
    description: "Ações de promoção à saúde dos trabalhadores da rede.",
    period: "02 set — 30 nov 2024",
    courses: 3,
    people: 92,
    status: projectStatus("2024-09-02", "2024-11-30"),
    color: "teal",
    responsible: "Núcleo de Educação Permanente",
    start: "2024-09-02",
    end: "2024-11-30",
  },
  {
    name: "Residência Multiprofissional",
    description: "Trilhas formativas para residentes da saúde municipal.",
    period: "10 mar — 18 dez 2024",
    courses: 8,
    people: 240,
    status: projectStatus("2024-03-10", "2024-12-18"),
    color: "blue",
    responsible: "Coordenação de Residências",
    start: "2024-03-10",
    end: "2024-12-18",
  },
]

export const courseSchedules: Record<string, string> = {
  "Vigilância em Saúde e Atenção Primária": "Quartas e sextas · 08:00–12:00",
  "Primeiros Socorros em Ambientes Públicos": "Sábados · 08:00–16:00",
  "Saúde Mental no Trabalho": "Terças · 18:00–21:00",
}

export const courseData: Course[] = [
  {
    title: "Vigilância em Saúde e Atenção Primária",
    project: "Fortaleza Mais Saúde",
    hours: "40h",
    classes: 3,
    students: 86,
    vacancies: 40,
    type: "Projeto",
    status: "Ativo",
    schedule: "Quartas e sextas · 08:00–12:00",
    start: "2024-09-10",
    end: "2024-11-28",
  },
  {
    title: "Primeiros Socorros em Ambientes Públicos",
    project: "Curso avulso",
    hours: "8h",
    classes: 2,
    students: 42,
    vacancies: 30,
    type: "Avulso",
    status: "Concluído",
    schedule: "Sábados · 08:00–16:00",
    start: "2024-09-21",
    end: "2024-09-21",
  },
  {
    title: "Saúde Mental no Trabalho",
    project: "Cuidar de Quem Cuida",
    hours: "20h",
    classes: 1,
    students: 31,
    vacancies: 35,
    type: "Projeto",
    status: "Planejamento",
    schedule: "Terças · 18:00–21:00",
    start: "2024-10-05",
    end: "2024-11-09",
  },
]

export const mockEnrollmentPeriods: Record<string, CourseEnrollmentPeriod> = {
  "Vigilância em Saúde e Atenção Primária": {
    start: "2020-01-10",
    end: "2099-12-31",
  },
  "Primeiros Socorros em Ambientes Públicos": {
    start: "2024-01-10",
    end: "2024-01-31",
  },
  "Saúde Mental e Bem-estar no Trabalho": {
    start: "2020-01-10",
    end: "2099-12-31",
  },
  "Planejamento e Gestão em Saúde": { start: "2024-02-01", end: "2024-02-28" },
}

export const mockEnrollmentRequests: EnrollmentRequest[] = [
  {
    id: 1,
    student: "Ana Beatriz Lima",
    course: "Vigilância em Saúde e Atenção Primária",
    requested: "Hoje, 09:18",
    status: "Pendente",
  },
  {
    id: 2,
    student: "Diego Martins Alves",
    course: "Primeiros Socorros em Ambientes Públicos",
    requested: "Ontem, 15:42",
    status: "Pendente",
  },
  {
    id: 3,
    student: "Emanuela Costa",
    course: "Saúde Mental no Trabalho",
    requested: "26 ago, 10:05",
    status: "Aprovada",
  },
]

export const systemState: AppSystemState = {
  activeAttendanceForm: null,
  lastCertificateRegistration: 2148,
}

export const mockUserNotifications: UserNotification[] = [
  {
    id: 9001,
    requestId: 101,
    role: "Aluno",
    title: "Palestra com inscrições abertas",
    message:
      "Inscreva-se em Saúde Mental e Cuidado em Rede. As vagas são limitadas.",
  },
]

export const mockEmailNotifications: EmailNotification[] = []

export const mockLectures: Lecture[] = [
  {
    id: 101,
    title: "Saúde Mental e Cuidado em Rede",
    date: "2026-12-05",
    time: "14:00",
    location: "Auditório ESPFOR",
    capacity: 80,
    speaker: "Lívia Andrade",
    pin: "4827",
    attendanceOpen: false,
    certificatesIssued: false,
    participants: [
      {
        name: "Lívia Andrade",
        cpf: "34567890123",
        unit: "Hospital da Mulher",
        role: "Facilitador",
        present: true,
      },
    ],
  },
  {
    id: 102,
    title: "Inovação na Atenção Primária",
    date: "2026-12-12",
    time: "09:00",
    location: "Online · Microsoft Teams",
    capacity: 120,
    speaker: "Lívia Andrade",
    pin: "7315",
    attendanceOpen: false,
    certificatesIssued: false,
    participants: [
      {
        name: "Lívia Andrade",
        cpf: "34567890123",
        unit: "Hospital da Mulher",
        role: "Facilitador",
        present: false,
      },
    ],
  },
]

export const mockLectureMaterials: LectureMaterial[] = [
  {
    id: 1,
    lectureId: 101,
    speaker: "Lívia Andrade",
    type: "Slides",
    fileName: "saude-mental-cuidado-em-rede.pdf",
  },
  {
    id: 2,
    lectureId: 101,
    speaker: "Lívia Andrade",
    type: "Referências bibliográficas",
    fileName: "referencias-saude-mental.pdf",
  },
  {
    id: 3,
    lectureId: 102,
    speaker: "Lívia Andrade",
    type: "Slides",
    fileName: "inovacao-atencao-primaria.pptx",
  },
  {
    id: 4,
    lectureId: 102,
    speaker: "Lívia Andrade",
    type: "Referências bibliográficas",
    fileName: "leituras-recomendadas.pdf",
  },
]

export const catalogCourses: CatalogCourse[] = [
  {
    id: 1,
    title: "Vigilância em Saúde e Atenção Primária",
    category: "Saúde coletiva",
    hours: 40,
    period: "10 set — 28 nov",
    places: 12,
    format: "Presencial",
    color: "teal",
  },
  {
    id: 2,
    title: "Primeiros Socorros em Ambientes Públicos",
    category: "Urgência e emergência",
    hours: 8,
    period: "21 set · 08:00",
    places: 8,
    format: "Presencial",
    color: "orange",
  },
  {
    id: 3,
    title: "Saúde Mental e Bem-estar no Trabalho",
    category: "Saúde do trabalhador",
    hours: 20,
    period: "05 out — 09 nov",
    places: 20,
    format: "Híbrido",
    color: "blue",
  },
  {
    id: 4,
    title: "Planejamento e Gestão em Saúde",
    category: "Gestão pública",
    hours: 30,
    period: "14 out — 16 dez",
    places: 15,
    format: "Online",
    color: "teal",
  },
]

export const mockUploadedDocuments: UploadedDocument[] = [
  {
    id: 1,
    student: "Ana Beatriz Lima",
    document: "Documento de identificação",
    file: "identidade-ana.pdf",
    sent: "Hoje, 09:42",
    status: "Pendente",
  },
  {
    id: 2,
    student: "Bruno da Silva Rocha",
    document: "Documento de identificação",
    file: "identidade-bruno.pdf",
    sent: "Ontem, 16:20",
    status: "Pendente",
  },
  {
    id: 3,
    student: "Camila Fernandes",
    document: "Documento de identificação",
    file: "documento-camila.jpg",
    sent: "26 ago, 11:05",
    status: "Validado",
  },
]

export const mockDocumentRequests: AcademicDocumentRequest[] = []

export const mockDocumentArchive: ArchivedDocument[] = [
  {
    id: 90001,
    student: "Ana Beatriz Lima",
    cpf: "12345678901",
    type: "Certificado de conclusão",
    course: "Vigilância em Saúde e Atenção Primária",
    issuance: "1ª Via",
    year: 2025,
    registrationNumber: 2042,
    issuedAt: "18/12/2025",
    source: "Base histórica",
  },
  {
    id: 90002,
    student: "Camila Fernandes",
    cpf: "98765432100",
    type: "Declaração de participação",
    course: "Primeiros Socorros em Ambientes Públicos",
    issuance: "2ª Via",
    year: 2024,
    issuedAt: "22/10/2024",
    source: "Base histórica",
  },
  {
    id: 90003,
    student: "João Pedro Lima",
    cpf: "45678912300",
    type: "Certificado de conclusão",
    course: "Saúde Mental no Trabalho",
    issuance: "1ª Via",
    year: 2026,
    registrationNumber: 2148,
    issuedAt: "12/11/2026",
    source: "Base histórica",
  },
]

export const mockMaterials: CourseMaterial[] = [
  {
    id: 1,
    title: "Slides — Vigilância epidemiológica",
    type: "Slides",
    course: "Vigilância em Saúde e Atenção Primária",
    className: "Turma A · Manhã",
    file: "aula-01-vigilancia.pdf",
    date: "26 ago 2024",
    evaluationDate: "",
  },
]

export const studentData: StudentRecord[] = [
  ["Ana Beatriz Lima", "2024.1048", "ana.lima@aluno.edu.br"],
  ["Bruno da Silva Rocha", "2024.1062", "bruno.rocha@aluno.edu.br"],
  ["Camila Fernandes", "2024.1089", "camila.fernandes@aluno.edu.br"],
  ["Diego Martins Alves", "2024.1104", "diego.alves@aluno.edu.br"],
  ["Emanuela Costa", "2024.1127", "emanuela.costa@aluno.edu.br"],
]

export const mockClassRosters: Record<number, StudentRecord[]> = {
  1: studentData,
  2: studentData.slice(0, 4),
  3: studentData.slice(1),
}

export const classData: CourseClass[] = [
  {
    id: 1,
    name: "Turma A · Manhã",
    course: "Vigilância em Saúde e Atenção Primária",
    schedule: "Quartas · 08:00–12:00",
    students: 5,
    room: "Sala 04",
    start: "2024-08-15",
    end: "2024-12-20",
  },
  {
    id: 2,
    name: "Turma B · Tarde",
    course: "Primeiros Socorros em Ambientes Públicos",
    schedule: "Sextas · 13:30–17:30",
    students: 4,
    room: "Laboratório 02",
    start: "2024-09-21",
    end: "2024-10-26",
  },
  {
    id: 3,
    name: "Turma Única · Noite",
    course: "Saúde Mental no Trabalho",
    schedule: "Terças · 18:00–21:00",
    students: 4,
    room: "Auditório",
    start: "2024-10-05",
    end: "2024-11-09",
  },
]

export const mockAssessmentTypes: AssessmentType[] = ["Prova", "Trabalho", ""]

export const mockGradesByStudent: Record<string, StudentGrades> = {
  "Ana Beatriz Lima": { note1: "8.5", note2: "9.0", note3: "" },
  "Bruno da Silva Rocha": { note1: "7.8", note2: "8.2", note3: "" },
  "Camila Fernandes": { note1: "9.2", note2: "9.4", note3: "" },
  "Diego Martins Alves": { note1: "6.5", note2: "7.0", note3: "" },
  "Emanuela Costa": { note1: "8.9", note2: "8.6", note3: "" },
}

export const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    date: "2026-11-14",
    time: "09:42",
    user: "Carla Souza",
    profile: "Coordenador",
    action: "Aprovação de Cadastro",
    details: "Aprovou o cadastro de Lívia Andrade como Facilitador",
    status: "Concluído",
  },
  {
    id: 2,
    date: "2026-11-14",
    time: "10:18",
    user: "Renata Lima",
    profile: "Secretária",
    action: "Validação de Documento",
    details: "Aprovou documento de Maria Silva",
    status: "Validado",
  },
  {
    id: 3,
    date: "2026-11-13",
    time: "16:05",
    user: "Renata Lima",
    profile: "Secretária",
    action: "Emissão de Certificado",
    details: "Emitiu certificado do curso Vigilância em Saúde para João Pedro",
    status: "Emitido",
  },
  {
    id: 4,
    date: "2026-11-13",
    time: "14:32",
    user: "Carla Souza",
    profile: "Coordenador",
    action: "Aprovação de Cadastro",
    details: "Recusou o cadastro de Paulo Mendes por documentação incompleta",
    status: "Recusado",
  },
  {
    id: 5,
    date: "2026-11-12",
    time: "11:27",
    user: "Renata Lima",
    profile: "Secretária",
    action: "Validação de Documento",
    details: "Solicitou correção do documento de Ana Beatriz Lima",
    status: "Pendente",
  },
  {
    id: 6,
    date: "2026-11-12",
    time: "08:50",
    user: "Renata Lima",
    profile: "Secretária",
    action: "Emissão de Certificado",
    details: "Emitiu certificados da palestra Saúde Mental e Cuidado em Rede",
    status: "Emitido",
  },
]

export const roleOverview: RoleOverviews = {
  Aluno: {
    message:
      "Continue sua jornada de aprendizagem e acompanhe suas atividades.",
    stats: [
      ["04", "Meus cursos", "book", "orange"],
      ["92%", "Minha frequência", "check", "teal"],
      ["02", "Certificados", "certificate", "blue"],
    ],
    task: "Retomar curso em andamento",
  },
  Coordenador: {
    message: "Acompanhe projetos, cursos, turmas e indicadores acadêmicos.",
    stats: [
      ["03", "Projetos ativos", "folder", "orange"],
      ["12", "Cursos publicados", "book", "teal"],
      ["284", "Usuários ativos", "students", "blue"],
    ],
    task: "4 novos cadastros aguardam validação de acesso",
  },
  Professor: {
    message:
      "Organize suas turmas e mantenha o acompanhamento dos alunos em dia.",
    stats: [
      ["03", "Minhas turmas", "users", "orange"],
      ["05", "Meus alunos", "students", "teal"],
      ["02", "Calendário de Avaliações e Entregas", "calendar", "blue"],
    ],
    task: "Registrar frequência da Turma A",
  },
  Secretária: {
    message: "Gerencie cadastros, documentos e o atendimento acadêmico.",
    stats: [
      ["05", "Total de Alunos Ativos", "students", "orange"],
      ["03", "Documentação Incompleta", "document", "teal"],
      ["02", "Diários de Classe Pendentes", "calendar", "blue"],
    ],
    task: "Validar documentos pendentes",
  },
  Facilitador: {
    message: "Consulte seus próximos encontros e materiais de apoio.",
    stats: [
      ["02", "Próximas palestras", "calendar", "orange"],
      ["04", "Materiais Didáticos", "document", "teal"],
      ["00", "Certificados e Declarações", "certificate", "blue"],
    ],
    task: "Enviar material da próxima palestra",
  },
  Administrador: {
    message:
      "Gerencie parâmetros institucionais, perfis privilegiados e segurança da plataforma.",
    stats: [
      ["05", "Total de Alunos Ativos", "students", "orange"],
      ["03", "Cursos e Turmas Ativas", "book", "teal"],
      ["415", "Certificações e Conclusões", "certificate", "blue"],
    ],
    task: "Gerenciar usuários, perfis e segurança do sistema",
  },
}
