import { useState } from "react"
import { Icon } from "./components/Icon"
import { Sidebar } from "./components/Sidebar"
import {
  DocumentArchivePage,
  LectureCertificatesPage,
  SecretaryDocumentsPage,
  StudentDocumentsPage,
} from "./pages/academico/Documentos"

import { Cursos } from "./pages/academico/Cursos"

import { CursosAluno } from "./pages/academico/CursosAluno"

import { CursosSecretaria } from "./pages/academico/CursosSecretaria"

import { Projetos } from "./pages/academico/Projetos"

import { Turmas } from "./pages/academico/Turmas"

import {
  AdminUserManagementPage,
  AuditLogsPage,
  ManagementReportsPage,
  MaterialsPage,
  ReportsPage,
  SettingsPage,
  StudentsPage,
  SystemSettingsPage,
} from "./pages/administracao/Gestao"

import { Login } from "./pages/auth/Login"

import { Register } from "./pages/auth/Register"

import { SupportPage } from "./pages/auth/SupportPage"

import { LecturesPage, SpeakerMaterialsPage } from "./pages/eventos/Palestras"

import { AttendancePage } from "./pages/frequencia/Acompanhamento"

import { FrequenciaProfessor } from "./pages/frequencia/FrequenciaProfessor"

import { VisaoGeralAluno } from "./pages/visao-geral/VisaoGeralAluno"

import { VisaoGeralPerfil } from "./pages/visao-geral/VisaoGeralPerfil"

import { mockUserNotifications } from "./data/mockData"

import { downloadDocument } from "./utils/helpers"

import type {
  AppScreen,
  CalendarEvent,
  DashboardView,
  SessionUser,
} from "./types"

function Dashboard({
  user,

  onUpdateUser,

  onLogout,
}: {
  user: SessionUser

  onUpdateUser: (user: SessionUser) => void

  onLogout: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const [activeView, setActiveView] = useState<DashboardView>("overview")

  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const [notificationOpen, setNotificationOpen] = useState(false)

  const [, setLectureVersion] = useState(0)

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      date: "Hoje, 14:00",
      title: "Aula de Vigilância em Saúde",
      type: "Aula",
      audience: "Aluno",
    },

    {
      id: 2,
      date: "Hoje, 17:00",
      title: "Prazo da atividade avaliativa",
      type: "Prazo",
      audience: "Aluno",
    },
  ])

  const userNotifications = mockUserNotifications.filter(
    (notification) =>
      notification.user === user.name || notification.role === user.profile,
  )

  function renderPage() {
    switch (activeView) {
      case "projects":
        return <Projetos readOnly={user.profile === "Secretária"} />

      case "courses":
        if (user.profile === "Aluno") return <CursosAluno user={user} />

        if (user.profile === "Secretária") return <CursosSecretaria />

        return <Cursos />

      case "classes":
        return user.profile === "Professor" ? (
          <FrequenciaProfessor />
        ) : (
          <Turmas profile={user.profile} />
        )

      case "students":
        return user.profile === "Administrador" ? (
          <AdminUserManagementPage />
        ) : (
          <StudentsPage />
        )

      case "attendance":
        return (
          <AttendancePage
            user={user}
            profile={user.profile}
            events={calendarEvents}
            setEvents={setCalendarEvents}
          />
        )

      case "documents":
        if (user.profile === "Aluno")
          return <StudentDocumentsPage user={user} />

        if (user.profile === "Facilitador")
          return <LectureCertificatesPage user={user} />

        return <SecretaryDocumentsPage profile={user.profile} />

      case "documentArchive":
        return user.profile === "Secretária" ? <DocumentArchivePage /> : null

      case "reports":
        return user.profile === "Administrador" ? (
          <ManagementReportsPage />
        ) : (
          <ReportsPage profile={user.profile} />
        )

      case "auditLogs":
        return user.profile === "Administrador" ? <AuditLogsPage /> : null

      case "materials":
        return user.profile === "Facilitador" ? (
          <SpeakerMaterialsPage
            user={user}
            onChange={() => setLectureVersion((version) => version + 1)}
          />
        ) : (
          <MaterialsPage readOnly={user.profile === "Aluno"} user={user} />
        )

      case "lectures":
        return (
          <LecturesPage
            user={user}
            onNavigate={setActiveView}
            onChange={() => setLectureVersion((version) => version + 1)}
          />
        )

      case "system":
        return user.profile === "Administrador" ? <SystemSettingsPage /> : null

      case "settings":
        return <SettingsPage user={user} onUpdate={onUpdateUser} />

      case "overview":
        return user.profile === "Aluno" ? (
          <VisaoGeralAluno
            user={user}
            reminders={calendarEvents}
            onNavigate={setActiveView}
            onLectureChange={() => setLectureVersion((version) => version + 1)}
          />
        ) : (
          <VisaoGeralPerfil user={user} onNavigate={setActiveView} />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Sidebar
        open={menuOpen}
        setOpen={setMenuOpen}
        active={activeView}
        setActive={setActiveView}
        profile={user.profile}
        onLogout={onLogout}
      />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-slate-200/70 bg-white/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <button
            aria-label="Abrir menu"
            title="Abrir menu"
            onClick={() => setMenuOpen(true)}
            className="icon-button lg:hidden"
          >
            <Icon name="menu" />
          </button>
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Icon
              name="search"
              className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              placeholder="Buscar cursos, documentos..."
              className="h-11 w-full rounded-xl bg-slate-100 pl-12 pr-4 text-sm outline-none ring-brand-teal/20 transition focus:bg-white focus:ring-4"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotificationOpen((value) => !value)}
                aria-label="Notificações"
                title="Notificações"
                className="icon-button relative"
              >
                <Icon name="bell" />
                {userNotifications.length > 0 && (
                  <span className="absolute right-2.5 top-2.5 size-2 rounded-full border-2 border-white bg-brand-orange" />
                )}
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-14 z-50 w-80 animate-reveal rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  <div className="flex items-center justify-between px-2 pb-3">
                    <div className="text-sm font-extrabold">Notificações</div>
                    <span className="badge badge-orange">
                      {userNotifications.length}
                    </span>
                  </div>
                  <div className="max-h-80 space-y-2 overflow-y-auto">
                    {userNotifications.length ? (
                      userNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="rounded-xl bg-slate-50 p-3"
                        >
                          <div className="text-xs font-extrabold">
                            {notification.title}
                          </div>
                          <p className="mt-1 text-[0.65rem] leading-5 text-muted">
                            {notification.message}
                          </p>
                          {notification.downloadUrl ? (
                            <a
                              href={notification.downloadUrl}
                              download={
                                notification.downloadFileName ??
                                "documento-espfor.pdf"
                              }
                              className="mt-3 inline-flex rounded-lg bg-brand-orange px-3 py-2 text-[0.62rem] font-extrabold text-white"
                            >
                              Baixar documento
                            </a>
                          ) : notification.downloadContent ? (
                            <button
                              onClick={() =>
                                downloadDocument(
                                  notification.downloadTitle ??
                                    "Documento ESPFOR",

                                  notification.downloadContent ?? "",
                                )
                              }
                              className="mt-3 rounded-lg bg-brand-orange px-3 py-2 text-[0.62rem] font-extrabold text-white"
                            >
                              Baixar documento
                            </button>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-muted">
                        Nenhuma notificação nova.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((value) => !value)}
                className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-100"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-teal-soft text-sm font-extrabold text-brand-teal">
                  {user.name

                    .split(" ")

                    .map((part) => part[0])

                    .slice(0, 2)

                    .join("")

                    .toUpperCase()}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-bold">{user.name}</span>
                  <span className="block text-[0.68rem] font-medium text-muted">
                    {user.profile}
                  </span>
                </span>
                <Icon
                  name="chevron"
                  className={`hidden size-4 text-muted transition sm:block ${
                    profileMenuOpen ? "-rotate-90" : "rotate-90"
                  }`}
                />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-14 z-50 w-56 animate-reveal rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2 sm:hidden">
                    <div className="text-xs font-extrabold">{user.name}</div>
                    <div className="mt-1 text-[0.62rem] text-muted">
                      {user.profile}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveView("settings")

                      setProfileMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold hover:bg-slate-50"
                  >
                    <Icon name="user" className="size-4 text-brand-teal" />
                    Configurações do perfil
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold text-brand-orange hover:bg-orange-soft"
                  >
                    <Icon name="arrow" className="size-4 rotate-180" />
                    Sair do sistema
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("login")

  const [user, setUser] = useState<SessionUser>({
    name: "Usuário",

    profile: "Coordenador",
  })

  if (screen === "dashboard") {
    return (
      <Dashboard
        user={user}
        onUpdateUser={setUser}
        onLogout={() => setScreen("login")}
      />
    )
  }

  if (screen === "register")
    return <Register onBack={() => setScreen("login")} />

  if (screen === "support")
    return <SupportPage onBack={() => setScreen("login")} />

  return (
    <Login
      onLogin={(loggedUser) => {
        setUser(loggedUser)

        setScreen("dashboard")
      }}
      onRegister={() => setScreen("register")}
      onSupport={() => setScreen("support")}
    />
  )
}
