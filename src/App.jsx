import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  Heart,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircleMore,
  Search,
  Sparkles,
  Store,
  Utensils,
  Users,
  X,
} from 'lucide-react'

const missions = [
  {
    id: 'lomi',
    type: 'Taste',
    title: 'Try a bowl of Batangas lomi',
    copy: 'Find a neighborhood lomihan, eat it while it’s hot, and ask what makes their version special.',
    points: 20,
    icon: Utensils,
    color: 'saffron',
    proof: 'Share a photo of your bowl',
    tip: 'Order first, photograph second. The thick noodles are best enjoyed hot.',
  },
  {
    id: 'eh',
    type: 'Speak',
    title: 'Hear the Batangueño “eh”',
    copy: 'Listen for how locals use “eh” in conversation, then try it naturally—not after every sentence.',
    points: 15,
    icon: MessageCircleMore,
    color: 'blue',
    proof: 'Mark after a real conversation',
    tip: 'Language is context. Ask a local when it sounds natural and let them be your guide.',
  },
  {
    id: 'kuya',
    type: 'Connect',
    title: 'Use kuya or ate with care',
    copy: 'Address an older shopkeeper or guide respectfully, and notice the warmth these family words carry.',
    points: 15,
    icon: Users,
    color: 'coral',
    proof: 'A reflection is enough',
    tip: 'Kuya is for an older man; ate is for an older woman. When unsure, a polite “po” works well.',
  },
  {
    id: 'museo',
    type: 'Discover',
    title: 'Find one story at Museo Puntong Batangan',
    copy: 'Choose one object or story you didn’t know before. Save what it taught you about the city.',
    points: 20,
    icon: Compass,
    color: 'green',
    proof: 'Photo check-in or short note',
    tip: 'The museum is about Batangueño history and ways of life—not just old objects.',
    place: 'Museo Puntong Batangan',
  },
  {
    id: 'local',
    type: 'Support',
    title: 'Buy something made or served locally',
    copy: 'Choose a family-run store, market stall, or local maker. Ask the person behind it about their craft.',
    points: 15,
    icon: Store,
    color: 'plum',
    proof: 'Tell us what you discovered',
    tip: 'The goal is connection, not spending. A small purchase and genuine conversation count.',
  },
  {
    id: 'story',
    type: 'Reflect',
    title: 'Bring home a person’s story',
    copy: 'Remember one local by name and write one sentence about what they shared with you.',
    points: 15,
    icon: Heart,
    color: 'rose',
    proof: 'Private journal entry',
    tip: 'Ask before sharing someone’s photo or story publicly. Your entry stays on this device.',
  },
]

const landmarks = [
  { name: 'Museo Puntong Batangan', eyebrow: 'History & identity', icon: '𐂷', className: 'museum', mission: 'Find one object that tells a local story' },
  { name: 'Basilica of the Immaculate Conception', eyebrow: 'Faith & heritage', icon: '✦', className: 'basilica', mission: 'Observe respectfully and learn why it matters' },
  { name: 'Isla Verde passage', eyebrow: 'Sea & livelihood', icon: '≈', className: 'isla', mission: 'Meet the coast through the people who care for it' },
]

function App() {
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kababyan-progress')) || ['lomi', 'eh'] } catch { return ['lomi', 'eh'] }
  })
  const [filter, setFilter] = useState('All')
  const [activeMission, setActiveMission] = useState(null)
  const [activePage, setActivePage] = useState('journey')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('kababyan-progress', JSON.stringify(completed)), [completed])

  const points = missions.filter((m) => completed.includes(m.id)).reduce((sum, m) => sum + m.points, 0)
  const percent = Math.round((completed.length / missions.length) * 100)
  const visibleMissions = useMemo(
    () => filter === 'All' ? missions : missions.filter((m) => m.type === filter),
    [filter],
  )

  function toggleMission(id) {
    const done = completed.includes(id)
    setCompleted(done ? completed.filter((item) => item !== id) : [...completed, id])
    if (!done) {
      setToast(completed.length + 1 === missions.length ? 'Journey complete — your welcome badge is ready!' : 'Salamat! Mission added to your journey.')
      setTimeout(() => setToast(''), 3000)
    }
    setActiveMission(null)
  }

  function goTo(page) {
    setActivePage(page)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => goTo('journey')} aria-label="Kababyan home">
          <span className="brand-mark"><span />K</span>
          <span>Kababyan</span>
        </button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          <button className={activePage === 'journey' ? 'active' : ''} onClick={() => goTo('journey')}>My journey</button>
          <button className={activePage === 'places' ? 'active' : ''} onClick={() => goTo('places')}>Places & stories</button>
          <button className={activePage === 'about' ? 'active' : ''} onClick={() => goTo('about')}>Why Kababyan</button>
        </nav>
        <div className="nav-actions">
          <button className="icon-button search-button" aria-label="Search"><Search size={19} /></button>
          <button className="profile-button" aria-label="Open profile">ML</button>
          <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      {activePage === 'journey' && (
        <main>
          <section className="hero">
            <div className="hero-image" aria-hidden="true" />
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="location-pill"><MapPin size={15} /> Batangas City, Philippines</div>
              <p className="kicker">Your cultural journey</p>
              <h1>Come as a visitor.<br /><em>Leave as kababayan.</em></h1>
              <p className="hero-copy">Six small experiences. One deeper connection to the food, words, stories, and people that make Batangas feel like home.</p>
              <div className="hero-progress">
                <div className="progress-copy">
                  <strong>{completed.length} of {missions.length} experiences</strong>
                  <span>{points} puntos earned</span>
                </div>
                <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
              </div>
            </div>
            <div className="hero-stamp" aria-label={`${percent} percent complete`}>
              <div><strong>{percent}%</strong><span>complete</span></div>
            </div>
          </section>

          <section className="journey-section page-width">
            <div className="section-heading">
              <div>
                <p className="kicker dark">Batangueño journey</p>
                <h2>Experience it, <em>don’t just visit.</em></h2>
                <p>Every mission comes from a part of everyday local life. Go at your own pace, stay curious, and always ask with respect.</p>
              </div>
              <div className="filter-row" aria-label="Filter missions">
                {['All', 'Taste', 'Speak', 'Connect', 'Discover'].map((item) => (
                  <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>
                ))}
              </div>
            </div>

            <div className="mission-grid">
              {visibleMissions.map((mission) => {
                const Icon = mission.icon
                const done = completed.includes(mission.id)
                return (
                  <article className={`mission-card ${done ? 'done' : ''}`} key={mission.id}>
                    <div className="mission-topline">
                      <span className={`mission-icon ${mission.color}`}><Icon size={21} /></span>
                      <span className="mission-number">{String(missions.indexOf(mission) + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="mission-type">{mission.type}</div>
                    <h3>{mission.title}</h3>
                    <p>{mission.copy}</p>
                    {mission.place && <div className="place-tag"><MapPin size={13} /> {mission.place}</div>}
                    <div className="mission-footer">
                      <span className="points">+{mission.points} puntos</span>
                      <button className={done ? 'complete-button completed' : 'complete-button'} onClick={() => done ? toggleMission(mission.id) : setActiveMission(mission)}>
                        {done ? <><Check size={16} /> Done</> : <>Start <ChevronRight size={16} /></>}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="badge-section page-width">
            <div className="badge-copy">
              <p className="kicker dark">What you’re working toward</p>
              <h2>A welcome you <em>earn with care.</em></h2>
              <p>Complete all six experiences to unlock your Batangas Kababayan badge—a keepsake of the people you met and stories you’ll carry home.</p>
              <div className="badge-note"><BadgeCheck size={20} /><span><strong>Community-authored, never a test of “being Filipino.”</strong><br />It celebrates participation, curiosity, and respect.</span></div>
            </div>
            <div className={percent === 100 ? 'badge-card unlocked' : 'badge-card'}>
              <div className="sun-rays" />
              <div className="badge-emblem"><span>ᜃ</span><small>KABABAYAN</small></div>
              <p>Batangas City</p>
              <h3>{percent === 100 ? 'Maligayang pagdating!' : `${missions.length - completed.length} experiences to go`}</h3>
              <div className="badge-lock">{percent === 100 ? <Sparkles size={16} /> : <LockKeyhole size={15} />} {percent === 100 ? 'Badge unlocked' : 'Badge in progress'}</div>
            </div>
          </section>
        </main>
      )}

      {activePage === 'places' && (
        <main className="subpage page-width">
          <button className="back-link" onClick={() => goTo('journey')}><ArrowLeft size={17} /> Back to journey</button>
          <div className="subpage-heading">
            <p className="kicker dark">Places & stories</p>
            <h1>Let the place open a <em>conversation.</em></h1>
            <p>This isn’t a list of sights to collect. Each place offers one small invitation to look closer and understand who calls it home.</p>
          </div>
          <div className="landmark-grid">
            {landmarks.map((place) => (
              <article className={`landmark-card ${place.className}`} key={place.name}>
                <div className="landmark-art"><span>{place.icon}</span><div className="landmark-sun" /></div>
                <div className="landmark-content">
                  <span>{place.eyebrow}</span>
                  <h2>{place.name}</h2>
                  <p>{place.mission}</p>
                  <button onClick={() => { setToast('Place saved to your Batangas journey.'); setTimeout(() => setToast(''), 3000) }}>Save place <ArrowRight size={16} /></button>
                </div>
              </article>
            ))}
          </div>
          <div className="proof-explainer">
            <Camera size={28} />
            <div><h3>A photo can confirm a place—not an experience.</h3><p>Location missions may use a private photo check-in, but reflection and respectful participation are what complete the story. Photos stay on your device in this prototype.</p></div>
          </div>
        </main>
      )}

      {activePage === 'about' && (
        <main className="about-page">
          <section className="about-hero page-width">
            <p className="kicker dark">Why Kababyan</p>
            <h1>Tourism should feel less like a checklist of places—and more like <em>being welcomed in.</em></h1>
            <p>Kababyan turns local knowledge into small, respectful invitations. Visitors don’t perform a culture; they listen, participate, and support the people keeping it alive.</p>
          </section>
          <section className="principles page-width">
            <article><span>01</span><Users /><h2>Local voices lead</h2><p>Every city journey should be reviewed and authored with residents, cultural workers, and local businesses.</p></article>
            <article><span>02</span><Heart /><h2>Belonging over badges</h2><p>The reward marks connection and learning. It never claims that a visitor has earned someone else’s identity.</p></article>
            <article><span>03</span><Compass /><h2>Meaning before maps</h2><p>Locations appear only when the place adds context to a food, tradition, livelihood, or story.</p></article>
          </section>
          <section className="name-story page-width">
            <div className="name-mark">Ka<br />ba<br />byan</div>
            <div><p className="kicker">The name</p><h2>From <em>kababayan</em>—a fellow person from home.</h2><p>We shortened the word, but kept its heart: the warmth of recognizing someone as one of your own. That feeling—not a reservation or a pin on a map—is the product.</p></div>
          </section>
        </main>
      )}

      <footer>
        <div className="footer-inner page-width">
          <div className="brand footer-brand"><span className="brand-mark"><span />K</span><span>Kababyan</span></div>
          <p>Travel closer. Listen longer. Leave as kababayan.</p>
          <span>Made with malasakit in the Philippines.</span>
        </div>
      </footer>

      {activeMission && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setActiveMission(null)}>
          <div className="mission-modal" role="dialog" aria-modal="true" aria-labelledby="mission-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveMission(null)} aria-label="Close"><X /></button>
            <span className={`mission-icon modal-icon ${activeMission.color}`}><activeMission.icon size={24} /></span>
            <p className="kicker dark">{activeMission.type} · +{activeMission.points} puntos</p>
            <h2 id="mission-title">{activeMission.title}</h2>
            <p>{activeMission.copy}</p>
            <div className="local-tip"><Sparkles size={19} /><div><strong>A local note</strong><p>{activeMission.tip}</p></div></div>
            <div className="proof-row"><Camera size={18} /><span><strong>How to complete</strong>{activeMission.proof}</span></div>
            <button className="primary-button" onClick={() => toggleMission(activeMission.id)}><CheckCircle2 size={19} /> Mark experience complete</button>
            <p className="privacy-note"><LockKeyhole size={13} /> Your progress stays on this device.</p>
          </div>
        </div>
      )}

      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </div>
  )
}

export default App
