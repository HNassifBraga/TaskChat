import React from "react";
import { useNavigate } from "react-router-dom";

const techs = ["React", "TypeScript", "Node.js", "Express", "Prisma ORM", "PostgreSQL", "Docker"];

const roles = [
  {
    icon: "👑",
    title: "CEO",
    text: "Registra a empresa, aprova usuários e possui controle total sobre permissões e organização interna.",
  },
  {
    icon: "🛠",
    title: "Admin",
    text: "É promovido pelo CEO e pode criar tarefas, acompanhar equipes e apoiar a gestão operacional.",
  },
  {
    icon: "👤",
    title: "Usuário",
    text: "Recebe tarefas, acompanha o progresso das atividades e conversa com a equipe no chat interno.",
  },
];

const features = [
  {
    icon: "💬",
    title: "Chat integrado",
    text: "Usuários da mesma empresa podem conversar em tempo real, mantendo a comunicação centralizada.",
  },
  {
    icon: "📋",
    title: "Kanban de tarefas",
    text: "Organize atividades em colunas de progresso e acompanhe o fluxo de trabalho da equipe.",
  },
  {
    icon: "🔐",
    title: "Controle de permissões",
    text: "CEO, administradores e usuários possuem níveis diferentes de acesso dentro da empresa.",
  },
  {
    icon: "👥",
    title: "Gestão de equipes",
    text: "Controle membros, aprovações, cargos e organização interna da empresa em um só lugar.",
  },
  {
    icon: "⚡",
    title: "Atualizações em tempo real",
    text: "Mensagens e tarefas sincronizadas para manter todos alinhados durante a rotina.",
  },
];

const status = [
  { label: "Cadastro e autenticação", state: "Concluído", progress: 100 },
  { label: "Registro de empresas", state: "Concluído", progress: 100 },
  { label: "Chat interno", state: "Em desenvolvimento", progress: 65 },
  { label: "Kanban", state: "Em desenvolvimento", progress: 55 },
  { label: "Permissões avançadas", state: "Em desenvolvimento", progress: 45 },
  { label: "Dashboard", state: "Planejado", progress: 20 },
];

export default function TaskChatLanding() {
  const navigate = useNavigate();
  return (
    <main
      className="min-vh-100 text-white"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(99,102,241,.35), transparent 32%), radial-gradient(circle at top right, rgba(168,85,247,.25), transparent 30%), #0f172a",
      }}
    >
      <nav
        className="navbar navbar-expand-lg navbar-dark sticky-top border-bottom border-secondary border-opacity-25"
        style={{ backdropFilter: "blur(16px)", background: "rgba(15, 23, 42, .82)" }}
      >
        <div className="container py-2">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#hero">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-4"
              style={{ width: 38, height: 38, background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
            >
              T
            </span>
            TaskChat
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="menu">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
              <li className="nav-item"><a className="nav-link" href="#recursos">Recursos</a></li>
              <li className="nav-item"><a className="nav-link" href="#como-funciona">Como funciona</a></li>
              <li className="nav-item"><a className="nav-link" href="#tecnologias">Tecnologias</a></li>
              <li className="nav-item"><a className="nav-link" href="#contato">Contato</a></li>
            </ul>

            <div className="d-flex gap-2">
              <button  className="btn btn-outline-light rounded-pill px-4" onClick={()=>navigate('/login')}>Entrar</button>
              <button className="btn rounded-pill px-4 text-white" onClick={()=>navigate('/signup')} style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
                Registrar-se
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section id="hero" className="container py-5 py-lg-5">
        <div className="row align-items-center g-5 py-lg-5">
          <div className="col-lg-6">
            <span className="badge rounded-pill border border-primary border-opacity-50  bg-primary bg-opacity-10 px-3 py-2 mb-4">
              SaaS para equipes em crescimento
            </span>
            

            <h1 className="display-4 fw-bold lh-1 mb-4">
              Gerencie equipes, tarefas e comunicação em um único lugar
            </h1>

            <p className="lead text-white-50 mb-4">
              O TaskChat une gestão de tarefas e comunicação interna para que empresas organizem equipes,
              acompanhem atividades e mantenham todos conectados.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
              <a href="/signup" className="btn btn-lg rounded-pill text-white px-4" style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
                Começar agora
              </a>
              <a href="#recursos" className="btn btn-lg btn-outline-light rounded-pill px-4">
                Saiba mais
              </a>
            </div>

            <div className="d-flex flex-wrap gap-3 text-white-50 small">
              <span>✓ Chat interno</span>
              <span>✓ Kanban</span>
              <span>✓ Permissões por cargo</span>
            </div>
          </div>

          <div className="col-lg-6">
            <div
              className="rounded-5 border border-secondary border-opacity-25 shadow-lg p-3 p-md-4"
              style={{ background: "rgba(15, 23, 42, .72)", backdropFilter: "blur(18px)" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="rounded-circle bg-danger d-inline-block" style={{ width: 10, height: 10 }} />
                  <span className="rounded-circle bg-warning d-inline-block" style={{ width: 10, height: 10 }} />
                  <span className="rounded-circle bg-success d-inline-block" style={{ width: 10, height: 10 }} />
                </div>
                <span className="small text-white-50">taskchat.app/workspace</span>
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <div className="rounded-4 p-3 h-100" style={{ background: "rgba(30,41,59,.85)" }}>
                    <p className="text-uppercase small text-white-50 mb-3">Canais</p>
                    {['# geral', '# produto', '# suporte'].map((item) => (
                      <div key={item} className="rounded-3 px-3 py-2 mb-2 small" style={{ background: item === '# geral' ? "rgba(99,102,241,.35)" : "transparent" }}>
                        {item}
                      </div>
                    ))}

                    <p className="text-uppercase small text-white-50 mt-4 mb-3">Online</p>
                    {['Ana', 'Lucas', 'Marina'].map((name, index) => (
                      <div key={name} className="d-flex align-items-center gap-2 mb-2 small">
                        <span className={`rounded-circle d-inline-block bg-${index === 2 ? 'primary' : 'success'}`} style={{ width: 9, height: 9 }} />
                        {name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="rounded-4 p-3 mb-3" style={{ background: "rgba(30,41,59,.85)" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <strong>Sprint atual</strong>
                      <span className="small text-white-50">12 tarefas</span>
                    </div>

                    <div className="row g-2">
                      {['A fazer', 'Em curso', 'Pronto'].map((col, idx) => (
                        <div className="col-4" key={col}>
                          <div className="rounded-4 p-2" style={{ background: "rgba(15,23,42,.8)" }}>
                            <p className="small mb-2 text-white-50">{col}</p>
                            {[1, 2, 3].map((n) => (
                              <div key={n} className="rounded-3 mb-2" style={{ height: 12, background: idx === 2 && n === 1 ? "rgba(34,197,94,.75)" : "rgba(148,163,184,.35)" }} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="rounded-4 p-3" style={{ background: "rgba(30,41,59,.85)" }}>
                        <span className="small text-white-50">Produtividade</span>
                        <h4 className="mb-0">+24%</h4>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="rounded-4 p-3" style={{ background: "rgba(30,41,59,.85)" }}>
                        <span className="small text-white-50">Concluídas</span>
                        <h4 className="mb-0">38</h4>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-4 p-3 mt-3" style={{ background: "rgba(99,102,241,.18)" }}>
                    <div className="d-flex align-items-start gap-2">
                      <span className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>A</span>
                      <div>
                        <strong className="small">Ana</strong>
                        <p className="small text-white-50 mb-0">Movi a task para revisão ✨</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="container py-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: 720 }}>
          <span className="badge rounded-pill text-bg-dark border border-secondary mb-3">Como funciona</span>
          <h2 className="fw-bold display-6">Cada pessoa tem o acesso certo para seu papel</h2>
          <p className="text-white-50">O TaskChat separa permissões para manter a gestão organizada e segura.</p>
        </div>

        <div className="row g-4">
          {roles.map((role) => (
            <div className="col-md-4" key={role.title}>
              <div className="card h-100 text-white border-secondary border-opacity-25 rounded-5 p-4 shadow-sm hover-card" style={{ background: "rgba(30,41,59,.62)" }}>
                <div className="fs-1 mb-3">{role.icon}</div>
                <h3 className="h4 fw-bold">{role.title}</h3>
                <p className="text-white-50 mb-0">{role.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="recursos" className="container py-5">
        <div className="row align-items-end mb-5">
          <div className="col-lg-7">
            <span className="badge rounded-pill text-bg-dark border border-secondary mb-3">Recursos</span>
            <h2 className="fw-bold display-6">Tudo para organizar o trabalho da empresa</h2>
          </div>
          <div className="col-lg-5">
            <p className="text-white-50 mb-0">Centralize conversas, tarefas, permissões e acompanhamento da equipe em uma única experiência.</p>
          </div>
        </div>

        <div className="row g-4">
          {features.map((feature) => (
            <div className="col-md-6 col-lg-4" key={feature.title}>
              <div className="card h-100 text-white border-secondary border-opacity-25 rounded-5 p-4 hover-card" style={{ background: "rgba(15,23,42,.55)" }}>
                <div className="fs-2 mb-3">{feature.icon}</div>
                <h3 className="h5 fw-bold">{feature.title}</h3>
                <p className="text-white-50 mb-0">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="tecnologias" className="container py-5">
        <div className="rounded-5 p-4 p-lg-5 border border-secondary border-opacity-25" style={{ background: "rgba(30,41,59,.55)" }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-5">
              <span className="badge rounded-pill text-bg-dark border border-secondary mb-3">Tecnologias</span>
              <h2 className="fw-bold display-6">Stack moderna para produto real</h2>
              <p className="text-white-50 mb-0">Tecnologias utilizadas no desenvolvimento do TaskChat.</p>
            </div>
            <div className="col-lg-7">
              <div className="d-flex flex-wrap gap-3">
                {techs.map((tech) => (
                  <span key={tech} className="badge rounded-pill fs-6 fw-normal px-4 py-3 border border-primary border-opacity-25 bg-primary bg-opacity-10 text-white hover-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: 720 }}>
          <span className="badge rounded-pill text-bg-dark border border-secondary mb-3">Status</span>
          <h2 className="fw-bold display-6">Projeto em desenvolvimento</h2>
          <p className="text-white-50">Acompanhe as principais etapas do desenvolvimento do produto.</p>
        </div>

        <div className="mx-auto" style={{ maxWidth: 860 }}>
          {status.map((item) => (
            <div key={item.label} className="mb-4">
              <div className="d-flex justify-content-between gap-3 mb-2">
                <span>{item.label}</span>
                <span className="text-white-50 small">{item.state}</span>
              </div>
              <div className="progress bg-dark rounded-pill" style={{ height: 10 }}>
                <div
                  className="progress-bar rounded-pill"
                  role="progressbar"
                  style={{
                    width: `${item.progress}%`,
                    background: item.progress === 100 ? "#22c55e" : "linear-gradient(135deg,#6366f1,#a855f7)",
                  }}
                  aria-valuenow={item.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      

      <footer className="container py-4 border-top border-secondary border-opacity-25">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-white-50 small">
          <span>TaskChat © 2026</span>
          <div className="d-flex gap-4">
            <a className="link-light link-opacity-75-hover text-decoration-none" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a className="link-light link-opacity-75-hover text-decoration-none" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="link-light link-opacity-75-hover text-decoration-none" href="mailto:contato@taskchat.com">Contato</a>
          </div>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        .hover-card, .hover-badge { transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .hover-card:hover { transform: translateY(-6px); border-color: rgba(99,102,241,.7) !important; background: rgba(30,41,59,.8) !important; }
        .hover-badge:hover { transform: translateY(-3px); background: rgba(99,102,241,.25) !important; }
      `}</style>
    </main>
  );
}
