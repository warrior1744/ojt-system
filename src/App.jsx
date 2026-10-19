import { useMemo, useState } from 'react'
import './App.css'

const initialSkills = [
  { id: 'ENG-001', name: 'Engine borescope inspection', category: 'Inspection', description: 'Perform and document a visual inspection of engine internal components using a borescope.' },
  { id: 'ENG-002', name: 'Fuel nozzle removal & installation', category: 'Fuel system', description: 'Safely remove, inspect, and reinstall fuel nozzles to approved maintenance practices.' },
  { id: 'ENG-003', name: 'Combustion liner inspection', category: 'Inspection', description: 'Inspect combustion liners for cracking, distortion, and thermal damage.' },
  { id: 'ENG-004', name: 'Oil filter inspection', category: 'Lubrication', description: 'Inspect oil filters and interpret contamination findings against maintenance limits.' },
  { id: 'ENG-005', name: 'Ignition system troubleshooting', category: 'Electrical', description: 'Diagnose ignition system faults and verify serviceability after corrective action.' },
  { id: 'ENG-006', name: 'Engine ground run', category: 'Operations', description: 'Prepare for, conduct, and record an engine ground run in accordance with the work card.' },
]

const initialCandidates = [
  { id: 'c1', technician: 'Liam Chen', initials: 'LC', color: 'blue', skillId: 'ENG-001', skill: 'Engine borescope inspection', records: 3, workOrders: ['WO-4821', 'WO-4910', 'WO-5038'], supervisors: ['Maya Patel', 'Maya Patel', 'Noah Brooks'], eligible: true, approved: false },
  { id: 'c2', technician: 'Sofia Rivera', initials: 'SR', color: 'rose', skillId: 'ENG-002', skill: 'Fuel nozzle removal & installation', records: 2, workOrders: ['WO-4952', 'WO-5071'], supervisors: ['Noah Brooks', 'Maya Patel'], eligible: false, approved: false },
  { id: 'c3', technician: 'Ethan Walker', initials: 'EW', color: 'amber', skillId: 'ENG-003', skill: 'Combustion liner inspection', records: 3, workOrders: ['WO-5014', 'WO-5014', 'WO-5102'], supervisors: ['Maya Patel', 'Noah Brooks', 'Maya Patel'], eligible: false, approved: false },
]

const initialTraining = [
  { id: 'TR-2084', technician: 'Liam Chen', initials: 'LC', color: 'blue', skill: 'Engine borescope inspection', workOrder: 'WO-5038', supervisor: 'Noah Brooks', date: 'Oct 18, 2026', result: 'Successful', verified: true },
  { id: 'TR-2083', technician: 'Sofia Rivera', initials: 'SR', color: 'rose', skill: 'Fuel nozzle removal & installation', workOrder: 'WO-5071', supervisor: 'Maya Patel', date: 'Oct 18, 2026', result: 'Successful', verified: false },
  { id: 'TR-2082', technician: 'Ethan Walker', initials: 'EW', color: 'amber', skill: 'Combustion liner inspection', workOrder: 'WO-5102', supervisor: 'Maya Patel', date: 'Oct 17, 2026', result: 'Successful', verified: false },
  { id: 'TR-2081', technician: 'Amara Okafor', initials: 'AO', color: 'violet', skill: 'Oil filter inspection', workOrder: 'WO-5094', supervisor: 'Noah Brooks', date: 'Oct 17, 2026', result: 'Successful', verified: true },
]

const technicians = [
  { name: 'Liam Chen', initials: 'LC', color: 'blue', role: 'Engine Technician II', active: 5, qualified: 3, progress: 78 },
  { name: 'Sofia Rivera', initials: 'SR', color: 'rose', role: 'Engine Technician I', active: 4, qualified: 1, progress: 54 },
  { name: 'Ethan Walker', initials: 'EW', color: 'amber', role: 'Engine Technician II', active: 6, qualified: 2, progress: 67 },
  { name: 'Amara Okafor', initials: 'AO', color: 'violet', role: 'Senior Engine Technician', active: 3, qualified: 5, progress: 91 },
]

const matrixRows = [
  { name: 'Liam Chen', initials: 'LC', color: 'blue', skills: ['qualified', 'qualified', 'in-progress', 'qualified', 'not-started'] },
  { name: 'Sofia Rivera', initials: 'SR', color: 'rose', skills: ['in-progress', 'in-progress', 'not-started', 'qualified', 'not-started'] },
  { name: 'Ethan Walker', initials: 'EW', color: 'amber', skills: ['qualified', 'not-started', 'in-progress', 'qualified', 'in-progress'] },
  { name: 'Amara Okafor', initials: 'AO', color: 'violet', skills: ['qualified', 'qualified', 'qualified', 'in-progress', 'qualified'] },
]

const navItems = [
  { id: 'Overview', icon: 'grid' },
  { id: 'Skills', icon: 'layers' },
  { id: 'Technicians', icon: 'users' },
  { id: 'Verification', icon: 'check' },
  { id: 'Skills matrix', icon: 'matrix' },
]

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    check: <><path d="M9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
    matrix: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    filter: <><path d="M4 7h16M7 12h10m-7 5h4" /><circle cx="8" cy="7" r="1.5" /><circle cx="15" cy="12" r="1.5" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Avatar({ initials, color, size = '' }) {
  return <span className={`avatar avatar-${color} ${size}`}>{initials}</span>
}

function StatCard({ label, value, change, icon, tone, footnote }) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className={`stat-icon ${tone}`}><Icon name={icon} size={19} /></span>
        <span className="stat-change"><Icon name="arrow" size={13} /> {change}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-footnote">{footnote}</div>
    </article>
  )
}

function ProgressBar({ value }) {
  return <div className="progress-track"><span style={{ width: `${value}%` }} /></div>
}

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [role, setRole] = useState('Manager')
  const [skills, setSkills] = useState(initialSkills)
  const [candidates, setCandidates] = useState(initialCandidates)
  const [training, setTraining] = useState(initialTraining)
  const [search, setSearch] = useState('')
  const [skillModalOpen, setSkillModalOpen] = useState(false)
  const [toast, setToast] = useState('')

  const eligibleSupervisor = role === 'Qualified supervisor'
  const filteredSkills = useMemo(
    () => skills.filter((skill) => `${skill.id} ${skill.name} ${skill.category}`.toLowerCase().includes(search.toLowerCase())),
    [skills, search],
  )

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  function verifyRecord(id) {
    if (!eligibleSupervisor) {
      notify('Only qualified employees can verify training.')
      return
    }
    setTraining((items) => items.map((item) => item.id === id ? { ...item, verified: true } : item))
    notify('Training record verified.')
  }

  function approveCandidate(id) {
    const candidate = candidates.find((item) => item.id === id)
    if (!candidate?.eligible) return
    if (role !== 'Manager') {
      notify('Manager access is required to approve qualifications.')
      return
    }
    setCandidates((items) => items.map((item) => item.id === id ? { ...item, approved: true } : item))
    notify(`${candidate.technician} is now qualified to supervise.`)
  }

  function addSkill(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const description = String(formData.get('description') || '').trim()
    const category = String(formData.get('category') || '').trim()
    if (!name || !description || !category) return
    const nextNumber = Math.max(0, ...skills.map((skill) => Number(skill.id.slice(4)) || 0)) + 1
    const skill = { id: `ENG-${String(nextNumber).padStart(3, '0')}`, name, description, category }
    setSkills((items) => [...items, skill])
    setSkillModalOpen(false)
    event.currentTarget.reset()
    notify(`${skill.id} added to the skills library.`)
  }

  const pageHeading = {
    Overview: ['Good morning, Alex', 'Here’s what’s happening across your training program today.'],
    Skills: ['Skills library', 'Manage the skills technicians need to demonstrate on the engine floor.'],
    Technicians: ['Technicians', 'Track individual training progress and qualification readiness.'],
    Verification: ['Supervisor verification', 'Review training records submitted by qualified supervisors.'],
    'Skills matrix': ['Skills matrix', 'A shared view of qualification coverage across your team.'],
  }[activePage]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setActivePage('Overview')}>
          <span className="brand-mark"><span /><span /><span /></span>
          <span className="brand-copy"><strong>Forge<span>OJT</span></strong><small>ENGINE TRAINING</small></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.id} className={`nav-link ${activePage === item.id ? 'active' : ''}`} onClick={() => { setActivePage(item.id); setSearch('') }}>
              <Icon name={item.icon} size={18} /><span>{item.id}</span>
              {item.id === 'Verification' && <span className="nav-count">{training.filter((record) => !record.verified).length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">?</div>
            <strong>Need a hand?</strong>
            <p>Visit the OJT program guide for help and best practices.</p>
            <button onClick={() => notify('Program guide is coming soon.')}>Open guide <Icon name="chevron" size={14} /></button>
          </div>
          <button className="profile-button" onClick={() => setRole(role === 'Manager' ? 'Qualified supervisor' : 'Manager')}>
            <Avatar initials="AM" color="navy" />
            <span className="profile-copy"><strong>Alex Morgan</strong><small>{role}</small></span>
            <span className="profile-dots">•••</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <label className="search-box">
              <Icon name="search" size={17} />
              <input aria-label="Search" placeholder="Search anything..." value={search} onChange={(event) => setSearch(event.target.value)} />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('You’re all caught up.')}>
              <Icon name="bell" size={19} /><i />
            </button>
            <span className="topbar-divider" />
            <div className="date-label"><span>Today</span><strong>October 18, 2026</strong></div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-title-row">
            <div><div className="greeting-kicker"><span className="status-dot" /> TRAINING OPERATIONS</div><h1>{pageHeading[0]}</h1><p>{pageHeading[1]}</p></div>
            {activePage === 'Skills' && role === 'Manager' && <button className="primary-button" onClick={() => setSkillModalOpen(true)}><Icon name="plus" size={17} /> Add a skill</button>}
            {activePage === 'Overview' && <button className="outline-button" onClick={() => notify('Your training report is ready to export.')}><span className="download-icon">↓</span> Export report</button>}
          </div>

          {activePage === 'Overview' && (
            <>
              <div className="stats-grid">
                <StatCard label="Active technicians" value="24" change="+3 this month" footnote="Across 4 engine teams" icon="users" tone="stat-indigo" />
                <StatCard label="Skills in library" value={skills.length.toString().padStart(2, '0')} change="+2 this quarter" footnote="Maintained by managers" icon="layers" tone="stat-mint" />
                <StatCard label="Awaiting approval" value={candidates.filter((item) => !item.approved).length.toString().padStart(2, '0')} change="Needs your review" footnote="Qualification requests" icon="clock" tone="stat-orange" />
                <StatCard label="Qualified supervisors" value={String(12 + candidates.filter((candidate) => candidate.approved).length)} change="+2 this quarter" footnote="Ready to coach others" icon="check" tone="stat-blue" />
              </div>

              <section className="overview-grid">
                <article className="panel activity-panel">
                  <div className="panel-heading">
                    <div><span className="panel-overline">TEAM MOMENTUM</span><h2>Training activity</h2><p>Successful training records over time</p></div>
                    <button className="select-button" onClick={() => notify('Showing activity for the last 6 months.')}>Last 6 months <span>⌄</span></button>
                  </div>
                  <div className="chart-summary"><strong>186</strong><span><b>↑ 12.8%</b> vs. previous period</span></div>
                  <div className="chart-wrap">
                    <div className="chart-y-labels"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div>
                    <div className="chart-area">
                      <div className="chart-gridlines"><i /><i /><i /><i /><i /></div>
                      <svg className="activity-chart" viewBox="0 0 600 190" preserveAspectRatio="none" role="img" aria-label="Training activity increased from May through October">
                        <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4966e9" stopOpacity=".18" /><stop offset="100%" stopColor="#4966e9" stopOpacity="0" /></linearGradient></defs>
                        <path d="M0 146 C40 136 52 145 86 127 S135 134 171 105 S220 114 256 91 S307 109 343 73 S395 88 429 59 S477 71 514 48 S560 57 600 25 V190 H0Z" fill="url(#chartFill)" />
                        <path d="M0 146 C40 136 52 145 86 127 S135 134 171 105 S220 114 256 91 S307 109 343 73 S395 88 429 59 S477 71 514 48 S560 57 600 25" fill="none" stroke="#4966e9" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                        <circle cx="600" cy="25" r="5" fill="#fff" stroke="#4966e9" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                      </svg>
                      <div className="chart-x-labels"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
                    </div>
                  </div>
                  <div className="chart-legend"><span><i className="legend-dot" /> Successful records</span><span><i className="legend-dot pale" /> Monthly target</span></div>
                </article>

                <article className="panel team-panel">
                  <div className="panel-heading">
                    <div><span className="panel-overline">TEAM OVERVIEW</span><h2>Technician progress</h2><p>Average qualification progress</p></div>
                    <button className="text-button" onClick={() => setActivePage('Technicians')}>View all <Icon name="chevron" size={15} /></button>
                  </div>
                  <div className="team-average"><div><strong>72%</strong><span>team average</span></div><div className="average-chart"><span style={{ height: '38%' }} /><span style={{ height: '51%' }} /><span style={{ height: '47%' }} /><span style={{ height: '70%' }} /><span style={{ height: '61%' }} /><span style={{ height: '84%' }} /><span style={{ height: '76%' }} /><span style={{ height: '100%' }} /></div></div>
                  <div className="team-list">
                    {technicians.slice(0, 3).map((person) => <div className="team-person" key={person.name}><Avatar initials={person.initials} color={person.color} /><div className="team-person-info"><strong>{person.name}</strong><span>{person.qualified} skills qualified</span></div><div className="person-progress"><strong>{person.progress}%</strong><ProgressBar value={person.progress} /></div></div>)}
                  </div>
                </article>
              </section>

              <section className="panel approvals-panel">
                <div className="panel-heading approvals-heading">
                  <div><span className="panel-overline">MANAGER REVIEW</span><h2>Qualification approvals <span className="count-pill">{candidates.filter((item) => !item.approved).length} pending</span></h2><p>Approve eligible technicians to become qualified supervisors.</p></div>
                  <button className="text-button" onClick={() => setActivePage('Verification')}>View verification queue <Icon name="chevron" size={15} /></button>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead><tr><th>TECHNICIAN</th><th>SKILL</th><th>TRAINING RECORDS</th><th>WORK ORDERS</th><th>ELIGIBILITY</th><th /></tr></thead>
                    <tbody>{candidates.map((candidate) => <tr key={candidate.id}>
                      <td><div className="table-person"><Avatar initials={candidate.initials} color={candidate.color} /><strong>{candidate.technician}</strong></div></td>
                      <td><span className="skill-name-cell">{candidate.skill}</span></td>
                      <td><span className={`record-count ${candidate.records === 3 && new Set(candidate.workOrders).size === 3 ? 'complete' : ''}`}>{candidate.records} / 3</span><span className="sub-cell">successful records</span></td>
                      <td><span className="work-order-list">{candidate.workOrders.join(' · ')}</span><span className="sub-cell">{new Set(candidate.workOrders).size} unique work orders</span></td>
                      <td>{candidate.approved ? <span className="badge badge-qualified">Qualified</span> : candidate.eligible ? <span className="badge badge-ready">Ready to approve</span> : <span className="badge badge-progress">In progress</span>}</td>
                      <td><button className={`small-button ${candidate.eligible && !candidate.approved && role === 'Manager' ? '' : 'disabled'}`} disabled={!candidate.eligible || candidate.approved || role !== 'Manager'} onClick={() => approveCandidate(candidate.id)}>{candidate.approved ? 'Approved' : 'Review'}</button></td>
                    </tr>)}</tbody>
                  </table>
                </div>
                <div className="approval-rule"><span className="info-mark">i</span> Qualification requires <strong>3 successful records</strong> from <strong>3 different work orders</strong>, verified by qualified supervisors.</div>
              </section>

              <section className="panel matrix-preview">
                <div className="panel-heading"><div><span className="panel-overline">QUALIFICATION COVERAGE</span><h2>Skills matrix</h2><p>See who’s qualified, in training, or yet to begin.</p></div><button className="text-button" onClick={() => setActivePage('Skills matrix')}>Open full matrix <Icon name="chevron" size={15} /></button></div>
                <MatrixTable compact />
              </section>
            </>
          )}

          {activePage === 'Skills' && (
            <section className="panel page-panel">
              <div className="panel-heading list-heading"><div><span className="panel-overline">SKILL CATALOG</span><h2>All skills <span className="count-pill">{skills.length} skills</span></h2><p>Every skill has a unique ID, description, and training category.</p></div><button className="filter-button" onClick={() => setSearch('')}><Icon name="filter" size={16} /> Clear filters</button></div>
              <div className="table-scroll"><table><thead><tr><th>SKILL ID</th><th>SKILL NAME</th><th>CATEGORY</th><th>DESCRIPTION</th><th>STATUS</th></tr></thead><tbody>{filteredSkills.map((skill) => <tr key={skill.id}><td><span className="id-chip">{skill.id}</span></td><td><strong>{skill.name}</strong></td><td><span className="category-label">{skill.category}</span></td><td className="description-cell">{skill.description}</td><td><span className="badge badge-qualified">Active</span></td></tr>)}</tbody></table></div>
              {filteredSkills.length === 0 && <div className="empty-state">No skills match “{search}”. Try another search.</div>}
              <div className="table-footnote">Skills are maintained by managers and visible to all employees.</div>
            </section>
          )}

          {activePage === 'Technicians' && (
            <section className="panel page-panel">
              <div className="panel-heading list-heading"><div><span className="panel-overline">PEOPLE & PROGRESS</span><h2>Technician roster <span className="count-pill">24 active</span></h2><p>Everyone can view progress; qualification approvals are manager-only.</p></div><button className="filter-button" onClick={() => notify('Showing all active technicians.')}><Icon name="filter" size={16} /> All teams</button></div>
              <div className="technician-grid">{technicians.map((person) => {
                const isSupervisor = candidates.some((candidate) => candidate.technician === person.name && candidate.approved)
                return <article className="technician-card" key={person.name}><div className="technician-card-top"><Avatar initials={person.initials} color={person.color} size="avatar-large" /><button className="more-button" aria-label={`More about ${person.name}`} onClick={() => notify(`${person.name} has ${person.qualified} qualified skills.`)}>•••</button></div><h3>{person.name}</h3><p>{person.role}</p>{isSupervisor && <span className="badge badge-qualified supervisor-badge"><Icon name="check" size={12} /> Qualified supervisor</span>}<div className="technician-metrics"><span><strong>{person.qualified}</strong> qualified</span><span><strong>{person.active}</strong> in progress</span></div><div className="technician-progress-heading"><span>Overall progress</span><strong>{person.progress}%</strong></div><ProgressBar value={person.progress} /><button className="card-link" onClick={() => notify(`Showing training details for ${person.name}.`)}>View training details <Icon name="chevron" size={14} /></button></article>
              })}</div>
            </section>
          )}

          {activePage === 'Verification' && (
            <section className="panel page-panel">
              <div className="panel-heading list-heading"><div><span className="panel-overline">RECORD REVIEW</span><h2>Training records <span className="count-pill">{training.filter((item) => !item.verified).length} need verification</span></h2><p>Supervisors must be qualified employees. Managers approve qualification after three verified records.</p></div>{eligibleSupervisor ? <span className="badge badge-qualified role-badge"><Icon name="check" size={13} /> Qualified supervisor</span> : <span className="badge badge-review role-badge">Manager view</span>}</div>
              {!eligibleSupervisor && <div className="notice-banner"><span className="info-mark">i</span><span>You’re viewing as a manager. Switch to <strong>Qualified supervisor</strong> using the profile control to verify records.</span></div>}
              <div className="table-scroll"><table><thead><tr><th>RECORD</th><th>TECHNICIAN / SKILL</th><th>WORK ORDER</th><th>SUPERVISOR</th><th>DATE</th><th>RESULT</th><th>STATUS</th></tr></thead><tbody>{training.map((record) => <tr key={record.id}><td><span className="id-chip">{record.id}</span></td><td><div className="training-person"><div className="table-person"><Avatar initials={record.initials} color={record.color} /><strong>{record.technician}</strong></div><span>{record.skill}</span></div></td><td><span className="work-order-chip">{record.workOrder}</span></td><td>{record.supervisor}</td><td>{record.date}</td><td><span className="result-dot" /> {record.result}</td><td>{record.verified ? <span className="badge badge-qualified">Verified</span> : <button className="small-button verify-button" disabled={!eligibleSupervisor} onClick={() => verifyRecord(record.id)}>{eligibleSupervisor ? 'Verify record' : 'Pending'}</button>}</td></tr>)}</tbody></table></div>
              <div className="approval-rule"><span className="info-mark">i</span> A supervisor can only verify training when they already hold an approved qualification.</div>
            </section>
          )}

          {activePage === 'Skills matrix' && (
            <section className="panel page-panel matrix-page">
              <div className="panel-heading list-heading"><div><span className="panel-overline">TEAM CAPABILITY</span><h2>Qualification matrix</h2><p>Shared visibility into current skills and training status.</p></div><button className="filter-button" onClick={() => notify('Matrix exported successfully.')}>↓ Export matrix</button></div>
              <MatrixTable />
              <div className="matrix-legend"><span><i className="matrix-dot qualified" /> Qualified</span><span><i className="matrix-dot progress" /> In progress</span><span><i className="matrix-dot not-started" /> Not started</span></div>
              <div className="approval-rule"><span className="info-mark">i</span> A technician becomes qualified for a skill after manager approval of three successful records from three unique work orders.</div>
            </section>
          )}

          <footer className="page-footer"><span>© 2026 ForgeOJT <i /> Aircraft Engine Training</span><span><i className="footer-live" /> All training data up to date</span></footer>
        </div>
      </main>

      {skillModalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSkillModalOpen(false) }}><section className="skill-modal" role="dialog" aria-modal="true" aria-labelledby="skill-modal-title"><div className="modal-heading"><div><span className="panel-overline">SKILLS LIBRARY</span><h2 id="skill-modal-title">Add a skill</h2><p>Create a skill for technician training plans.</p></div><button className="icon-button" aria-label="Close dialog" onClick={() => setSkillModalOpen(false)}><Icon name="close" /></button></div><form onSubmit={addSkill}><label>Skill name<input name="name" required maxLength="80" placeholder="e.g. Compressor blade inspection" /></label><label>Category<select name="category" required defaultValue=""><option value="" disabled>Select category</option><option>Inspection</option><option>Fuel system</option><option>Lubrication</option><option>Electrical</option><option>Operations</option><option>Other</option></select></label><label>Description<textarea name="description" required maxLength="300" rows="3" placeholder="Describe the task and expected standard..." /></label><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setSkillModalOpen(false)}>Cancel</button><button className="primary-button" type="submit"><Icon name="plus" size={16} /> Add skill</button></div></form></section></div>}
      {toast && <div className="toast" role="status"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  )
}

function MatrixTable({ compact = false }) {
  const headers = ['Borescope inspection', 'Fuel nozzle R&I', 'Combustion liner', 'Oil filter inspection', 'Ignition troubleshooting']
  return <div className="table-scroll matrix-scroll"><table className={`matrix-table ${compact ? 'compact-matrix' : ''}`}><thead><tr><th>TECHNICIAN</th>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{matrixRows.map((row) => <tr key={row.name}><td><div className="table-person"><Avatar initials={row.initials} color={row.color} /><strong>{row.name}</strong></div></td>{row.skills.map((status, index) => <td key={`${row.name}-${index}`}><span className={`matrix-cell ${status}`} title={status.replace('-', ' ')}>{status === 'qualified' ? <Icon name="check" size={14} /> : status === 'in-progress' ? <span className="matrix-progress-dot" /> : <span className="matrix-dash">—</span>}<span className="matrix-status-label">{status === 'qualified' ? 'Qualified' : status === 'in-progress' ? 'In progress' : 'Not started'}</span></span></td>)}</tr>)}</tbody></table></div>
}

export default App
