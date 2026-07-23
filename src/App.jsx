import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  Heart,
  Home,
  ImagePlus,
  Leaf,
  LockKeyhole,
  LogIn,
  MapPin,
  Menu,
  PhilippinePeso,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Stamp,
  UserRound,
  Users,
  WalletCards,
  X,
} from 'lucide-react'
import {
  communities,
  experienceById,
  journey,
  placeQuestById,
  placeQuests,
} from './data/batangasJourney.js'
import {
  clearPlacePhotos,
  deletePlacePhoto,
  getPlacePhoto,
  savePlacePhoto,
} from './lib/photoStore.js'

const STORAGE_KEY = 'kababyan-mvp-v3'

function emptyProgress() {
  return {
    displayName: 'Guest Traveler',
    activeCommunity: 'batangas',
    communities: {
      batangas: { completed: [], notes: {}, reflection: '', badgeDate: '' },
    },
    placeQuests: {},
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved) return saved

    const previous = JSON.parse(localStorage.getItem('kababyan-batangas-v2'))
    if (previous) {
      return {
        ...emptyProgress(),
        communities: {
          batangas: {
            completed: previous.completed || [],
            notes: previous.notes || {},
            reflection: previous.reflection || '',
            badgeDate: previous.badgeDate || '',
          },
        },
      }
    }
  } catch {
    return emptyProgress()
  }
  return emptyProgress()
}

function useRouter() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextPath) {
    if (nextPath !== window.location.pathname) window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { path, navigate }
}

function App() {
  const { path, navigate } = useRouter()
  const [progress, setProgress] = useState(loadProgress)
  const [toast, setToast] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)), [progress])

  function go(nextPath) {
    setMenuOpen(false)
    navigate(nextPath)
  }

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const publicPage = !path.startsWith('/app')
  let page

  const experienceMatch = path.match(/^\/app\/discover\/([^/]+)\/experiences\/([^/]+)$/)
  const communityMatch = path.match(/^\/app\/discover\/([^/]+)$/)
  const questMatch = path.match(/^\/app\/journey\/([^/]+)$/)

  if (path === '/login' || path === '/signup') {
    page = <AuthPlaceholder mode={path === '/login' ? 'login' : 'signup'} navigate={go} />
  } else if (path === '/how-it-works') {
    page = <HowItWorksPage navigate={go} />
  } else if (experienceMatch) {
    page = experienceMatch[1] === 'batangas' && experienceById[experienceMatch[2]]
      ? <ExperiencePage experience={experienceById[experienceMatch[2]]} progress={progress} setProgress={setProgress} navigate={go} showToast={showToast} />
      : <NotFound navigate={go} />
  } else if (communityMatch) {
    const community = communities.find((item) => item.id === communityMatch[1])
    page = community
      ? <CommunityJourneyPage community={community} progress={progress} setProgress={setProgress} navigate={go} showToast={showToast} />
      : <NotFound navigate={go} />
  } else if (questMatch) {
    page = <PlaceQuestPage quest={placeQuestById[questMatch[1]]} progress={progress} setProgress={setProgress} navigate={go} showToast={showToast} />
  } else if (path === '/app/journey') {
    page = <JourneyPage progress={progress} navigate={go} />
  } else if (path === '/app/passport') {
    page = <PassportPage progress={progress} setProgress={setProgress} showToast={showToast} />
  } else if (path === '/app/discover') {
    page = <CommunitySelectionPage progress={progress} setProgress={setProgress} navigate={go} />
  } else {
    page = <LandingPage navigate={go} />
  }

  return (
    <div className="app-shell">
      {publicPage ? <PublicHeader navigate={go} path={path} /> : <AppHeader navigate={go} path={path} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
      {page}
      <Footer navigate={go} publicPage={publicPage} />
      {!publicPage && <MobileNav navigate={go} path={path} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} /> {toast}</div>}
    </div>
  )
}

function KababayanMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Kababayan open bahay mark">
      <path className="mark-shelter" d="M8 28 32 8l24 20" />
      <path className="mark-home" d="M14 25v29h36V25" />
      <path className="mark-k" d="M25 29v23m0-10 12-12m-12 12 13 10" />
      <circle className="mark-person mark-person-one" cx="37.5" cy="31" r="3.5" />
      <path className="mark-person mark-person-one" d="M32.5 45c.7-5.8 2.4-8.7 5-8.7s4.3 2.9 5 8.7" />
      <circle className="mark-person mark-person-two" cx="46" cy="35" r="2.7" />
      <path className="mark-person mark-person-two" d="M42.2 46c.5-4.5 1.8-6.7 3.8-6.7s3.3 2.2 3.8 6.7" />
      <path className="mark-threshold" d="M19 54h26" />
    </svg>
  )
}

function Brand({ navigate, showDescriptor = false }) {
  return (
    <button className="brand" onClick={() => navigate('/')} aria-label="Kababayan home">
      <span className="brand-mark"><KababayanMark /></span>
      <span className="brand-copy">
        <strong>Kababayan</strong>
        {showDescriptor && <small>Philippines, from within</small>}
      </span>
    </button>
  )
}

function PublicHeader({ navigate }) {
  return (
    <header className="topbar public-header">
      <Brand navigate={navigate} showDescriptor />
      <nav className="public-links">
        <button onClick={() => navigate('/how-it-works')}>How it works</button>
        <button onClick={() => navigate('/login')}>Log in</button>
        <button className="header-signup" onClick={() => navigate('/signup')}>Sign up</button>
      </nav>
    </header>
  )
}

function AppHeader({ navigate, path, menuOpen, setMenuOpen }) {
  const active = path.startsWith('/app/discover') ? 'discover' : path.startsWith('/app/journey') ? 'journey' : 'passport'
  return (
    <header className="topbar">
      <Brand navigate={navigate} />
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <button className={active === 'discover' ? 'active' : ''} onClick={() => navigate('/app/discover')}>Discover</button>
        <button className={active === 'journey' ? 'active' : ''} onClick={() => navigate('/app/journey')}>Journey</button>
        <button className={active === 'passport' ? 'active' : ''} onClick={() => navigate('/app/passport')}>Passport</button>
      </nav>
      <div className="nav-actions">
        <button className="passport-shortcut" onClick={() => navigate('/app/passport')}><UserRound size={17} /> Guest</button>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
  )
}

function MobileNav({ path, navigate }) {
  const items = [
    { label: 'Discover', path: '/app/discover', icon: Home, active: path.startsWith('/app/discover') },
    { label: 'Journey', path: '/app/journey', icon: Compass, active: path.startsWith('/app/journey') },
    { label: 'Passport', path: '/app/passport', icon: WalletCards, active: path.startsWith('/app/passport') },
  ]
  return (
    <nav className="mobile-nav">
      {items.map(({ label, path: itemPath, icon: Icon, active }) => (
        <button key={itemPath} className={active ? 'active' : ''} onClick={() => navigate(itemPath)}><Icon size={20} /><span>{label}</span></button>
      ))}
    </nav>
  )
}

function LandingPage({ navigate }) {
  return (
    <main>
      <section className="discover-hero landing-hero">
        <div className="discover-photo" />
        <div className="discover-scrim" />
        <div className="discover-content page-width">
          <div className="hero-brand-stamp"><KababayanMark /><span><strong>Kababayan</strong>Philippine community journeys</span></div>
          <p className="kicker">Experience the Philippines from within</p>
          <h1>Come as a visitor.<br /><em>Leave as a kababayan.</em></h1>
          <p>Kababayan turns food, language, stories, and everyday encounters into respectful invitations to participate in Filipino community life.</p>
          <div className="hero-actions">
            <button className="primary-button fit gold-button" onClick={() => navigate('/signup')}>Start your journey <ArrowRight size={18} /></button>
            <button className="ghost-button light" onClick={() => navigate('/how-it-works')}>See how it works</button>
          </div>
        </div>
        <div className="hero-note"><KababayanMark /><p><strong>From kababayan</strong>Someone welcomed as a person from home—not treated as a passing tourist.</p></div>
      </section>

      <section className="intro-section page-width">
        <div className="intro-heading"><p className="kicker dark">A focused travel companion</p><h2>Places are the setting.<br /><em>People are the experience.</em></h2></div>
        <div className="intro-copy"><p>Discover community experiences, take optional place quests, and keep what you learned in a cultural Passport.</p><p>No reservations, ratings, directions, or tourist leaderboards.</p></div>
      </section>

      <section className="landing-preview">
        <div className="page-width preview-layout">
          <div className="preview-copy"><p className="kicker">Your first community</p><h2>Begin in Batangas City.</h2><p>Taste lomi, speak with warmth, enter the palengke with curiosity, and listen to what makes locals proud.</p><button className="text-arrow light-arrow" onClick={() => navigate('/signup')}>Preview the experience <ArrowRight size={17} /></button></div>
          <div className="preview-passport"><div className="badge-emblem"><span>CB</span><small>BATANGAS CITY</small></div><p>Complete every experience and reflect</p><h3>Certified Batangueño</h3></div>
        </div>
      </section>

      <section className="trust-strip page-width"><ShieldCheck size={25} /><div><h3>Private and trust-based.</h3><p>Your word is enough. Photos and reflections stay on this device.</p></div><button onClick={() => navigate('/how-it-works')}>Our approach <ArrowRight size={15} /></button></section>
    </main>
  )
}

function AuthPlaceholder({ mode, navigate }) {
  const signup = mode === 'signup'
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="auth-icon">{signup ? <Sparkles /> : <LogIn />}</span>
        <p className="kicker dark">{signup ? 'Create your Passport' : 'Welcome back'}</p>
        <h1>{signup ? 'Start as a guest traveler.' : 'Continue your local journey.'}</h1>
        <p>Real accounts are intentionally not part of this prototype. Continue to explore the complete app with progress stored on this device.</p>
        <button className="primary-button" onClick={() => navigate('/app/discover')}>{signup ? 'Create guest Passport' : 'Continue as guest'} <ArrowRight size={17} /></button>
        <button className="auth-switch" onClick={() => navigate(signup ? '/login' : '/signup')}>{signup ? 'Already returning? Log in' : 'New here? Sign up'}</button>
        <span className="privacy-note"><LockKeyhole size={13} /> No email or password will be collected.</span>
      </section>
    </main>
  )
}

function CommunitySelectionPage({ progress, setProgress, navigate }) {
  const activeCommunityId = communities.some((community) => community.id === progress.activeCommunity)
    ? progress.activeCommunity
    : 'batangas'
  const [communitySearch, setCommunitySearch] = useState('')
  const filteredCommunities = communities.filter((community) => {
    const query = communitySearch.trim().toLowerCase()
    return !query || `${community.city} ${community.country}`.toLowerCase().includes(query)
  })

  function selectCommunity(communityId) {
    setProgress((current) => ({ ...current, activeCommunity: communityId }))
    navigate(`/app/discover/${communityId}`)
  }

  return (
    <main>
      <section className="community-header">
        <div className="page-width">
          <p className="kicker">Discover communities</p>
          <h1>Choose where you want to <em>belong for a while.</em></h1>
          <p>Each community journey is a set of invitations into everyday local life—not a list of attractions.</p>
        </div>
      </section>

      <section className="community-overview page-width">
        <div className="community-browser">
          <div className="community-browser-heading">
            <div>
              <span className="eyebrow">Explore by city</span>
              <h2>Find your next community.</h2>
            </div>
            <span className="community-count">{communities.length} {communities.length === 1 ? 'community' : 'communities'}</span>
          </div>

          <div className="community-search" role="search">
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              value={communitySearch}
              onChange={(event) => setCommunitySearch(event.target.value)}
              placeholder="Search a city or province"
              aria-label="Search communities"
            />
            {communitySearch && <button type="button" onClick={() => setCommunitySearch('')} aria-label="Clear community search"><X size={16} /></button>}
          </div>

          <div className="community-city-list" aria-live="polite">
            {filteredCommunities.map((community) => (
              <CommunityCityCard
                key={community.id}
                community={community}
                active={community.id === activeCommunityId}
                onSelect={() => selectCommunity(community.id)}
              />
            ))}
            {!filteredCommunities.length && (
              <div className="community-search-empty">
                <Search size={24} />
                <div><strong>No communities found</strong><span>Try another city or province name.</span></div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

function CommunityJourneyPage({ community, progress, setProgress, navigate, showToast }) {
  const communityProgress = progress.communities.batangas
  const canReflect = communityProgress.completed.length >= journey.completionRequired
  const badgeEarned = communityProgress.completed.length >= journey.completionRequired && Boolean(communityProgress.reflection.trim())
  const [reflection, setReflection] = useState(communityProgress.reflection)
  const [reflectionError, setReflectionError] = useState('')

  function saveReflection() {
    if (!canReflect) {
      setReflectionError('Complete every community invitation before writing the closing reflection.')
      return
    }
    if (!reflection.trim()) {
      setReflectionError('Write a short reflection before completing the community journey.')
      return
    }
    setProgress((current) => ({
      ...current,
      communities: {
        ...current.communities,
        batangas: {
          ...current.communities.batangas,
          reflection: reflection.trim(),
          badgeDate: current.communities.batangas.completed.length >= journey.completionRequired
            ? current.communities.batangas.badgeDate || new Date().toISOString()
            : current.communities.batangas.badgeDate,
        },
      },
    }))
    showToast(communityProgress.completed.length >= journey.completionRequired ? 'Certified Batangueño badge earned!' : 'Your reflection was saved.')
  }

  function toggleExperience(experienceId) {
    const completed = communityProgress.completed.includes(experienceId)
    setProgress((current) => ({
      ...current,
      communities: {
        ...current.communities,
        batangas: {
          ...current.communities.batangas,
          completed: completed
            ? current.communities.batangas.completed.filter((id) => id !== experienceId)
            : [...current.communities.batangas.completed, experienceId],
        },
      },
    }))
    showToast(completed ? 'Invitation returned to your list.' : 'Added to your Batangas memories.')
  }

  return (
    <main className={`community-journey-page ${community.id === 'batangas' ? 'batangas-journey-page' : ''}`}>
      <section className="community-header community-journey-header">
        {community.id === 'batangas' && (
          <span className="journey-festival-pennants" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
        )}
        <div className={`page-width ${community.id === 'batangas' ? 'sublian-hero-layout' : ''}`}>
          <div className="sublian-hero-copy">
            <button className="community-back-link" onClick={() => navigate('/app/discover')}><ArrowLeft size={16} /> All communities</button>
            <p className="kicker">{community.city} community journey</p>
            <h1>{community.status === 'coming-soon' ? <>A journey for {community.city} is <em>taking shape.</em></> : <>Enter the rhythm <em>of Batangas.</em></>}</h1>
            <p>{community.status === 'coming-soon' ? 'Community journeys are only published after their experiences have been researched and locally validated.' : 'Follow a festival route through food, language, livelihood, history, and personal stories. Complete every invitation, then gather your thoughts in the closing circle.'}</p>
          </div>
          {community.id === 'batangas' && (
            <aside className="sublian-festival-seal" aria-label="Sublian-inspired Batangas community route">
              <span>Batangas City</span>
              <strong>Sublian</strong>
              <em>community route</em>
              <div className="festival-mask-mark" aria-hidden="true"><i /><i /><i /></div>
              <small>Devotion · rhythm · bayanihan</small>
            </aside>
          )}
        </div>
      </section>

      {community.status === 'coming-soon' ? (
        <section className="community-overview page-width">
          <div className="community-coming-soon">
            <span className="coming-soon-mark">{community.city.slice(0, 2).toUpperCase()}</span>
            <div><p className="kicker dark">Journey in development</p><h2>{community.city} is not ready to welcome travelers yet.</h2><p>Return to the community directory to explore Batangas City, the functional MVP journey.</p></div>
          </div>
        </section>
      ) : (
        <>
          <section className="community-overview community-task-overview page-width">
            <div className="sublian-theme-band">
              <span>Festival route</span>
              <strong>Choose what feels natural · skip anything</strong>
              <i aria-hidden="true" />
            </div>
            <div className="community-intro">
              <div><span className="location-pill dark-pill"><MapPin size={14} /> Batangas City, Philippines</span><p className="kicker dark">Gentle invitations from the community</p><h2>Follow your<br /><em>own curiosity.</em></h2><p>Browse what Batangas has to share. There is no order and no rush—mark only the moments that become part of your visit.</p></div>
              <div className="community-progress-card"><span className="festival-pass-stamp">Sublian<br />memory pass</span><span className="eyebrow">Memories marked</span><strong>{communityProgress.completed.length}<small> moments</small></strong><div className="progress-track"><span style={{ width: `${communityProgress.completed.length / 6 * 100}%` }} /></div><p>{badgeEarned ? 'Certified Batangueño earned' : 'Explore only what feels right today.'}</p></div>
            </div>
            <div className="mission-grid">
              {journey.experiences.map((experience) => (
                <ExperienceListItem key={experience.id} experience={experience} done={communityProgress.completed.includes(experience.id)} onToggle={toggleExperience} navigate={navigate} />
              ))}
            </div>
          </section>

          <section className="community-reflection page-width">
            <div className="reflection-intro"><p className="kicker dark">The closing circle</p><h2>When did you feel least like a tourist?</h2><p>After the route, gather what stayed with you. What happened in that moment, and what do you understand differently about Batangas now?</p><div className="badge-definition"><BadgeCheck size={20} /><span><strong>Certified Batangueño</strong>A cultural participation badge—not an official credential or claim of residency.</span></div></div>
            <div className="reflection-form">
              <textarea rows="8" value={reflection} disabled={!canReflect} onChange={(event) => { setReflection(event.target.value); setReflectionError('') }} placeholder={canReflect ? 'Write your honest reflection. It stays on this device.' : 'Complete every community invitation to open the closing reflection.'} />
              {reflectionError && <p className="form-error">{reflectionError}</p>}
              {badgeEarned ? <div className="earned-community"><Sparkles size={18} /><span><strong>{journey.welcome}</strong>Your community badge is now in your Passport.</span><button onClick={() => navigate('/app/passport')}>Open Passport <ArrowRight size={15} /></button></div> : <button className="primary-button" disabled={!canReflect} onClick={saveReflection}><Sparkles size={18} /> Formally finish Batangas City</button>}
            </div>
          </section>
        </>
      )}
    </main>
  )
}

function CommunityCityCard({ community, active, onSelect }) {
  const available = community.status !== 'coming-soon'

  return (
    <div className="community-city-entry">
      <button
        type="button"
        className={`community-city-card ${community.id}-city-card${active ? ' active' : ''}`}
        onClick={onSelect}
        aria-pressed={active}
      >
        {community.id === 'batangas' ? (
          <>
            <img className="batangas-card-photo" src="/images/sublian-festival-batangas-city-2022.jpg" alt="" aria-hidden="true" />
            <span className="batangas-card-scrim" aria-hidden="true" />
            <span className="festival-pennants" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="batangas-card-content">
              <span className="batangas-card-topline">
                <small>Community journey · Philippines</small>
                <span className={`city-card-status${available ? ' available' : ''}`}>
                  <>Open journey <ArrowRight size={15} /></>
                </span>
              </span>
              <strong className="batangas-card-title">Batangas <em>City</em></strong>
              <span className="batangas-card-footer">
                <span className="batangas-card-theme"><small>Industrial Port City</small><b>of CALABARZON</b></span>
                <span className="batangas-card-location"><MapPin size={14} /> Batangas, Philippines</span>
              </span>
            </span>
          </>
        ) : (
          <>
            <span className="city-card-art" aria-hidden="true">
              <span className="city-monogram">{community.city.slice(0, 2).toUpperCase()}</span>
            </span>
            <span className="city-card-copy">
              <small>Future community journey</small>
              <strong>{community.city}</strong>
              <span><MapPin size={13} /> {community.country}</span>
            </span>
            <span className="city-card-status">{active ? <><Check size={15} /> Selected</> : 'Coming soon'}</span>
          </>
        )}
      </button>
      {community.id === 'batangas' && (
        <span className="city-photo-credit">
          Photo: <a href="https://batangascity.gov.ph/web/current-news/4993-pagdiriwang-ng-53rd-batangas-city-foundation-day-matagumpay" target="_blank" rel="noreferrer">Batangas City PIO · 2022 Sublian Parade</a> · cropped for display
        </span>
      )}
    </div>
  )
}

function ExperienceListItem({ experience, done, onToggle, navigate }) {
  return (
    <article className={`experience-list-item ${done ? 'done' : ''}`}>
      <label className="experience-check" aria-label={`${done ? 'Uncheck' : 'Check'} ${experience.title}`}>
        <input type="checkbox" checked={done} onChange={() => onToggle(experience.id)} />
        <span aria-hidden="true"><Check size={17} /></span>
      </label>
      <button className="experience-list-action" onClick={() => navigate(`/app/discover/batangas/experiences/${experience.id}`)}>
        <img src={experience.image} alt="" aria-hidden="true" />
        <span className="experience-list-copy"><strong>{experience.title}</strong><small>{experience.summary}</small></span>
        <ChevronRight className="experience-list-chevron" size={19} aria-hidden="true" />
      </button>
      <span className="experience-complete-stamp" aria-hidden="true"><i className="salakot-mark"><b /></i><small>Salamat</small></span>
    </article>
  )
}

function ExperiencePage({ experience, progress, setProgress, navigate, showToast }) {
  const communityProgress = progress.communities.batangas
  const [note, setNote] = useState(experience ? communityProgress.notes[experience.id] || '' : '')
  const [error, setError] = useState('')
  if (!experience) return <NotFound navigate={navigate} />

  const Icon = experience.icon
  const done = communityProgress.completed.includes(experience.id)

  function complete() {
    if (experience.noteRequired && !note.trim()) {
      setError('Add a short reflection before completing this experience.')
      return
    }
    setProgress((current) => ({
      ...current,
      communities: {
        ...current.communities,
        batangas: {
          ...current.communities.batangas,
          completed: current.communities.batangas.completed.includes(experience.id) ? current.communities.batangas.completed : [...current.communities.batangas.completed, experience.id],
          notes: { ...current.communities.batangas.notes, [experience.id]: note.trim() },
        },
      },
    }))
    showToast('Community experience completed.')
    navigate('/app/discover/batangas')
  }

  function undo() {
    setProgress((current) => ({
      ...current,
      communities: {
        ...current.communities,
        batangas: { ...current.communities.batangas, completed: current.communities.batangas.completed.filter((id) => id !== experience.id) },
      },
    }))
    showToast('Experience marked incomplete.')
    navigate('/app/discover/batangas')
  }

  return (
    <main className="experience-page">
      <div className="page-width experience-breadcrumb"><button onClick={() => navigate('/app/discover/batangas')}><ArrowLeft size={17} /> Back to Batangas</button><span>Discover <ChevronRight size={13} /> {experience.category}</span></div>
      <section className="page-width experience-layout">
        <aside className="experience-aside"><span className={`mission-icon large ${experience.color}`}><Icon size={28} /></span><p className="kicker dark">{experience.category}</p><h1>{experience.title}</h1><p>{experience.summary}</p><div className="experience-meta"><span><Clock3 size={17} /><div><small>Time</small>{experience.duration}</div></span><span><PhilippinePeso size={17} /><div><small>Cost</small>{experience.cost}</div></span>{experience.place && <span><MapPin size={17} /><div><small>Suggested setting</small>{experience.place}</div></span>}</div></aside>
        <article className="experience-content">
          <section><span className="section-number">01</span><div><h2>Why this matters</h2><p>{experience.whyItMatters}</p></div></section>
          {experience.phrases && <div className="phrase-list">{experience.phrases.map((phrase) => <div key={phrase.term}><strong>{phrase.term}</strong><span>{phrase.meaning}</span></div>)}</div>}
          <section><span className="section-number">02</span><div><h2>What to do</h2><ol>{experience.steps.map((step) => <li key={step}>{step}</li>)}</ol></div></section>
          <div className="guidance-grid"><div className="guidance-card etiquette"><Heart size={19} /><div><h3>Do it with care</h3><p>{experience.etiquette}</p></div></div><div className="guidance-card alternative"><Leaf size={19} /><div><h3>Another way</h3><p>{experience.alternative}</p></div></div></div>
          <section className="complete-section"><span className="section-number">03</span><div className="complete-content"><p className="kicker dark">Trust-based completion</p><h2>When it feels complete, say so.</h2><p className="completion-statement">“{experience.completionPrompt}”</p><label htmlFor="experience-note">{experience.notePrompt}{experience.noteRequired && <span> Required</span>}</label><textarea id="experience-note" value={note} onChange={(event) => { setNote(event.target.value); setError('') }} rows="4" placeholder="This stays private on your device." />{error && <p className="form-error">{error}</p>}<div className="completion-actions">{done ? <button className="secondary-button" onClick={undo}>Mark incomplete</button> : <button className="primary-button fit" onClick={complete}><CheckCircle2 size={18} /> Complete experience</button>}<span><LockKeyhole size={13} /> No proof or upload required</span></div></div></section>
        </article>
      </section>
    </main>
  )
}

function JourneyPage({ progress, navigate }) {
  return (
    <main className="place-journey-page">
      <section className="place-journey-hero">
        <div className="page-width"><p className="kicker">Optional place quests</p><h1>Let a location open<br /><em>a deeper story.</em></h1><p>Visit meaningful places, complete a small set of activities, and keep a private photo or observation in your Passport.</p></div>
      </section>
      <section className="page-width place-quest-list">
        <div className="section-heading"><div><p className="kicker dark">Batangas place quests</p><h2>Side quests with a purpose.</h2><p>These quests are optional and do not affect your Certified Batangueño badge.</p></div></div>
        <div className="place-quest-grid">
          {placeQuests.map((quest) => {
            const completed = progress.placeQuests[quest.id]?.completed
            return <article className={`place-quest-card ${quest.color}`} key={quest.id}><div className="quest-art"><img src={quest.image} alt={quest.imageAlt} /><a className="quest-photo-credit" href={quest.photoCreditUrl} target="_blank" rel="noreferrer">{quest.photoCredit} · {quest.photoLicense}</a></div><div className="quest-content"><span className="quest-theme">{quest.theme}</span><h3>{quest.name}</h3><p>{quest.summary}</p><div className="quest-meta"><span><MapPin size={13} /> {quest.location}</span><span><Clock3 size={13} /> {quest.duration}</span></div><button className={completed ? 'quest-completed' : ''} onClick={() => navigate(`/app/journey/${quest.id}`)}>{completed ? <><Stamp size={16} /> Stamp earned</> : <>Open place quest <ArrowRight size={16} /></>}</button></div></article>
          })}
        </div>
      </section>
    </main>
  )
}

function PlaceQuestPage({ quest, progress, setProgress, navigate, showToast }) {
  const existing = quest ? progress.placeQuests[quest.id] || {} : {}
  const [observation, setObservation] = useState(existing.observation || '')
  const [photoName, setPhotoName] = useState(existing.photoName || '')
  const [photoUrl, setPhotoUrl] = useState('')
  const [useAlternative, setUseAlternative] = useState(Boolean(existing.usedAlternative))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!quest) return
    let url
    getPlacePhoto(quest.id).then((blob) => {
      if (blob) {
        url = URL.createObjectURL(blob)
        setPhotoUrl(url)
      }
    }).catch(() => {})
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [quest])

  if (!quest) return <NotFound navigate={navigate} />

  async function choosePhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }
    await savePlacePhoto(quest.id, file)
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(URL.createObjectURL(file))
    setPhotoName(file.name)
    setError('')
  }

  async function removePhoto() {
    await deletePlacePhoto(quest.id)
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl('')
    setPhotoName('')
  }

  function completeQuest() {
    if (!photoName && !(useAlternative && observation.trim())) {
      setError(useAlternative ? 'Write a short observation to use the photography alternative.' : 'Add a private location photo, or choose the written alternative.')
      return
    }
    setProgress((current) => ({
      ...current,
      placeQuests: {
        ...current.placeQuests,
        [quest.id]: {
          completed: true,
          observation: observation.trim(),
          photoName,
          usedAlternative: useAlternative && !photoName,
          completedAt: current.placeQuests[quest.id]?.completedAt || new Date().toISOString(),
        },
      },
    }))
    showToast(`${quest.stamp} place stamp earned.`)
    navigate('/app/passport')
  }

  return (
    <main className="quest-detail-page">
      <div className="page-width experience-breadcrumb"><button onClick={() => navigate('/app/journey')}><ArrowLeft size={17} /> Back to place quests</button><span>Journey <ChevronRight size={13} /> {quest.name}</span></div>
      <section className="page-width quest-detail-layout">
        <aside className={`quest-detail-aside ${quest.color}`}><img className="quest-detail-image" src={quest.image} alt="" aria-hidden="true" /><span className="quest-detail-scrim" aria-hidden="true" /><div className="quest-detail-copy"><p className="kicker">{quest.theme}</p><h1>{quest.name}</h1><p>{quest.context}</p><div className="quest-meta vertical"><span><MapPin size={15} /> {quest.location}</span><span><Clock3 size={15} /> {quest.duration}</span></div><a className="quest-detail-credit" href={quest.photoCreditUrl} target="_blank" rel="noreferrer">Photo: {quest.photoCredit} · {quest.photoLicense}</a></div></aside>
        <article className="quest-detail-content">
          <section><span className="section-number">01</span><div><h2>While you are there</h2><ol>{quest.activities.map((activity) => <li key={activity}>{activity}</li>)}</ol></div></section>
          <div className="guidance-card etiquette standalone"><Heart size={19} /><div><h3>Visit with care</h3><p>{quest.etiquette}</p></div></div>
          <section><span className="section-number">02</span><div className="quest-completion"><p className="kicker dark">Final requirement</p><h2>Keep one private memory.</h2><p>{quest.photoPrompt}</p>
            <div className="photo-picker">
              {photoUrl ? <div className="photo-preview"><img src={photoUrl} alt="Private place-quest preview" /><button onClick={removePhoto}><X size={15} /> Remove</button></div> : <label><ImagePlus size={28} /><strong>Add a private photo</strong><span>Stored only in this browser</span><input type="file" accept="image/*" onChange={choosePhoto} /></label>}
            </div>
            <button className="alternative-toggle" onClick={() => { setUseAlternative(!useAlternative); setError('') }}>{useAlternative ? 'Use a photo instead' : 'Photography is not appropriate or accessible'}</button>
            {useAlternative && <div className="alternative-field"><label htmlFor="place-observation">{quest.alternativePrompt}</label><textarea id="place-observation" rows="5" value={observation} onChange={(event) => { setObservation(event.target.value); setError('') }} /></div>}
            {error && <p className="form-error">{error}</p>}
            {existing.completed ? <div className="stamp-earned-inline"><Stamp size={19} /><span><strong>Place stamp earned</strong>This memory is already in your Passport.</span><button onClick={() => navigate('/app/passport')}>View Passport</button></div> : <button className="primary-button" onClick={completeQuest}><Stamp size={18} /> Complete place quest</button>}
          </div></section>
        </article>
      </section>
    </main>
  )
}

function PassportPage({ progress, setProgress, showToast }) {
  const communityProgress = progress.communities.batangas
  const badgeEarned = communityProgress.completed.length >= journey.completionRequired && Boolean(communityProgress.reflection)
  const [name, setName] = useState(progress.displayName)
  const [photos, setPhotos] = useState({})
  const [pageIndex, setPageIndex] = useState(0)
  const [turning, setTurning] = useState(null)
  const [drag, setDrag] = useState({ active: false, startX: 0, delta: 0 })

  useEffect(() => {
    const urls = []
    Promise.all(placeQuests.map(async (quest) => {
      const blob = await getPlacePhoto(quest.id)
      if (!blob) return
      const url = URL.createObjectURL(blob)
      urls.push(url)
      setPhotos((current) => ({ ...current, [quest.id]: url }))
    })).catch(() => {})
    return () => urls.forEach(URL.revokeObjectURL)
  }, [progress.placeQuests])

  function saveName() {
    const displayName = name.trim() || 'Guest Traveler'
    setName(displayName)
    setProgress((current) => ({ ...current, displayName }))
    showToast('Passport name saved locally.')
  }

  async function reset() {
    if (!window.confirm('Reset all Kababayan progress and private photos on this device?')) return
    await clearPlacePhotos(placeQuests.map((quest) => quest.id))
    setProgress(emptyProgress())
    setPhotos({})
    showToast('Local Passport reset.')
  }

  const pages = [
    {
      label: 'Identity',
      content: (
        <div className="passport-paper-content identity-paper">
          <PassportPaperHeader title="Kababayan Passport" page="01" />
          <div className="passport-identity-grid">
            <div className="passport-portrait">
              <KababayanMark />
              <span>Guest portrait</span>
            </div>
            <div className="passport-data">
              <span className="passport-micro-label">Name of holder</span>
              <div className="passport-name-field">
                <input aria-label="Passport display name" value={name} onChange={(event) => setName(event.target.value)} />
                <button onClick={saveName}>Save</button>
              </div>
              <div className="passport-data-row">
                <PassportDatum label="Passport no." value="KBY 000 2026" />
                <PassportDatum label="Type" value="Visitor" />
              </div>
              <div className="passport-data-row">
                <PassportDatum label="Issued by" value="Kababayan" />
                <PassportDatum label="Community" value="Batangas City" />
              </div>
            </div>
          </div>
          <div className="passport-machine-row"><div className="passport-machine-code">KABABAYAN&lt;&lt;GUEST&lt;TRAVELER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div><button onClick={reset}><RotateCcw size={12} /> Reset</button></div>
        </div>
      ),
    },
    {
      label: 'Batangas City',
      content: (
        <div className="passport-paper-content community-paper">
          <PassportPaperHeader title="Batangas City" page="02" />
          <div className="passport-city-layout">
            <div className="passport-city-badge-wrap">
              <CityCertificationBadge
                community="Batangueño"
                date={formatPassportDate(communityProgress.badgeDate, 'Awaiting reflection')}
                earned={badgeEarned}
              />
              <span>{badgeEarned ? 'Community journey formally finished' : `${communityProgress.completed.length} of ${journey.completionRequired} invitations complete`}</span>
            </div>
            <div className="passport-city-reflection">
              <span className="passport-micro-label">My reflection</span>
              <blockquote>{communityProgress.reflection || 'Your closing reflection will live here after every Batangas City invitation is complete.'}</blockquote>
              <small>{badgeEarned ? 'Recorded in Batangas City' : 'Complete all invitations, then write your reflection to certify this page.'}</small>
              <div className="passport-entry-marks" aria-label={`${communityProgress.completed.length} of ${journey.completionRequired} invitations complete`}>
                {journey.experiences.map((experience) => <i className={communityProgress.completed.includes(experience.id) ? 'marked' : ''} key={experience.id} />)}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    ...placeQuests.map((quest, index) => {
      const questProgress = progress.placeQuests[quest.id] || {}
      const completed = Boolean(questProgress.completed)
      return {
        label: quest.name,
        content: (
          <div className={`passport-paper-content scrapbook-paper ${completed ? 'completed' : ''}`}>
            <PassportPaperHeader title={quest.name} page={String(index + 3).padStart(2, '0')} />
            <div className="passport-scrapbook">
              <figure className="scrapbook-photo scrapbook-place-photo">
                <span className="scrapbook-tape" aria-hidden="true" />
                <img src={quest.image} alt={quest.imageAlt} />
                <figcaption>Batangas City · {quest.name}</figcaption>
              </figure>
              <figure className="scrapbook-photo scrapbook-memory-photo">
                <span className="scrapbook-tape" aria-hidden="true" />
                {photos[quest.id]
                  ? <img src={photos[quest.id]} alt={`Traveler memory from ${quest.name}`} />
                  : <div className="scrapbook-photo-empty"><ImagePlus size={28} /><span>{questProgress.usedAlternative ? 'Written memory' : 'Your photo goes here'}</span></div>}
                <figcaption>{completed ? 'My memory' : 'Awaiting this journey'}</figcaption>
              </figure>
              <div className="scrapbook-caption">
                <span className="passport-micro-label">Place journey</span>
                <h2>{quest.name}</h2>
                <p><MapPin size={13} /> {quest.location}</p>
                <p><Clock3 size={13} /> {formatPassportDate(questProgress.completedAt, 'Date to be recorded')}</p>
                {questProgress.usedAlternative && questProgress.observation && <blockquote>{questProgress.observation}</blockquote>}
              </div>
              <span className="scrapbook-doodle" aria-hidden="true">✦</span>
            </div>
          </div>
        ),
      }
    }),
  ]

  useEffect(() => {
    if (!turning) return undefined
    const timer = window.setTimeout(() => {
      setPageIndex(turning.target)
      setTurning(null)
    }, 760)
    return () => window.clearTimeout(timer)
  }, [turning])

  function turnPage(direction) {
    if (turning) return
    const target = pageIndex + direction
    if (target < 0 || target >= pages.length) return
    setDrag({ active: false, startX: 0, delta: 0 })
    setTurning({ direction, target })
  }

  function beginSwipe(event) {
    if (turning || event.target.closest('button, input, a')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrag({ active: true, startX: event.clientX, delta: 0 })
  }

  function continueSwipe(event) {
    if (!drag.active) return
    setDrag((current) => ({ ...current, delta: event.clientX - current.startX }))
  }

  function endSwipe(event) {
    if (!drag.active) return
    const delta = event.clientX - drag.startX
    setDrag({ active: false, startX: 0, delta: 0 })
    if (delta < -55) turnPage(1)
    else if (delta > 55) turnPage(-1)
  }

  function renderSheet(index, className, style) {
    return (
      <div className={`passport-sheet ${className}`} style={style} aria-hidden={className.includes('under')} key={`${index}-${className}`}>
        <div className="passport-paper-face passport-paper-front">{pages[index].content}</div>
        <div className="passport-paper-face passport-paper-back"><KababayanMark /><span>KABABAYAN</span></div>
      </div>
    )
  }

  const dragRotation = drag.active && drag.delta < 0 && pageIndex < pages.length - 1
    ? Math.max(-18, drag.delta / 9)
    : 0

  return (
    <main className="passport-page">
      <section className="passport-heading page-width"><p className="kicker dark">Your cultural Passport</p><h1>A journey you can<br /><em>hold onto.</em></h1><p>Swipe through one paper page at a time.</p></section>

      <section className="passport-reader page-width" aria-label="Kababayan Passport">
        <div className="passport-cover-edge" aria-hidden="true" />
        <div
          className={`passport-stage ${drag.active ? 'is-dragging' : ''}`}
          onPointerDown={beginSwipe}
          onPointerMove={continueSwipe}
          onPointerUp={endSwipe}
          onPointerCancel={() => setDrag({ active: false, startX: 0, delta: 0 })}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') turnPage(1)
            if (event.key === 'ArrowLeft') turnPage(-1)
          }}
          tabIndex="0"
        >
          <div className="passport-page-stack passport-stack-three" aria-hidden="true" />
          <div className="passport-page-stack passport-stack-two" aria-hidden="true" />
          {turning?.direction === 1 && renderSheet(turning.target, 'passport-sheet-under')}
          {turning?.direction === -1 && renderSheet(pageIndex, 'passport-sheet-under')}
          {!turning && pageIndex < pages.length - 1 && renderSheet(pageIndex + 1, 'passport-sheet-under')}
          {turning?.direction === -1
            ? renderSheet(turning.target, 'passport-sheet-top is-turning-back')
            : renderSheet(pageIndex, `passport-sheet-top ${turning ? 'is-turning-forward' : ''}`, { '--drag-rotation': `${dragRotation}deg` })}
          <div className="passport-page-curl" aria-hidden="true" />
        </div>

        <div className="passport-reader-controls">
          <button onClick={() => turnPage(-1)} disabled={pageIndex === 0 || Boolean(turning)} aria-label="Previous Passport page"><ArrowLeft size={18} /></button>
          <div className="passport-page-indicator">
            <strong>{pages[pageIndex].label}</strong>
            <span>{pages.map((page, index) => <button className={index === pageIndex ? 'active' : ''} onClick={() => { if (!turning && index !== pageIndex) setTurning({ direction: index > pageIndex ? 1 : -1, target: index }) }} aria-label={`Open ${page.label} page`} key={page.label} />)}</span>
            <small>{pageIndex + 1} / {pages.length} · swipe the paper</small>
          </div>
          <button onClick={() => turnPage(1)} disabled={pageIndex === pages.length - 1 || Boolean(turning)} aria-label="Next Passport page"><ArrowRight size={18} /></button>
        </div>
      </section>
    </main>
  )
}

function PassportPaperHeader({ title, page }) {
  return <header className="passport-paper-header"><span>Republika ng Pilipinas</span><h2>{title}</h2><small>{page}</small></header>
}

function PassportDatum({ label, value }) {
  return <span className="passport-datum"><small>{label}</small><strong>{value}</strong></span>
}

function CityCertificationBadge({ community, date, earned }) {
  return (
    <div className={`city-certification-badge ${earned ? 'earned' : ''}`}>
      <svg viewBox="0 0 200 200" role="img" aria-label={`${earned ? 'Certified' : 'Incomplete'} ${community} badge`}>
        <defs>
          <path id="certified-arc" d="M 32 104 A 68 68 0 0 1 168 104" />
          <path id="date-arc" d="M 29 112 A 73 73 0 0 0 171 112" />
          <path id="kababayan-ring" d="M 100 14 A 86 86 0 1 1 99.9 14" />
        </defs>
        <circle className="stamp-field" cx="100" cy="100" r="80" />
        <text className="badge-baybayin-ring"><textPath href="#kababayan-ring" startOffset="0" textLength="540" lengthAdjust="spacingAndGlyphs">ᜃᜊᜊᜌᜈ᜔ ᜃᜊᜊᜌᜈ᜔ ᜃᜊᜊᜌᜈ᜔ ᜃᜊᜊᜌᜈ᜔ ᜃᜊᜊᜌᜈ᜔ ᜃᜊᜊᜌᜈ᜔ ᜃᜊᜊᜌᜈ᜔</textPath></text>
        <text className="badge-arc-text"><textPath href="#certified-arc" startOffset="50%" textAnchor="middle">CERTIFIED</textPath></text>
        <text className="badge-community-name" x="100" y="109" textAnchor="middle">{community.toUpperCase()}</text>
        <text className="badge-date-text"><textPath href="#date-arc" startOffset="50%" textAnchor="middle">{date.toUpperCase()}</textPath></text>
      </svg>
    </div>
  )
}

function formatPassportDate(value, fallback) {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-PH', { day: '2-digit', month: 'short', year: 'numeric' })
}

function HowItWorksPage({ navigate }) {
  return (
    <main className="about-page">
      <section className="about-hero page-width"><p className="kicker dark">How Kababayan works</p><h1>Community first.<br />Places with purpose.<br /><em>Memories kept private.</em></h1><p>Kababayan separates belonging from sightseeing so neither becomes a generic travel checklist.</p></section>
      <section className="principles page-width"><article><span>01</span><Users /><h2>Discover communities</h2><p>Participate in food, language, livelihood, heritage, and personal stories. Reflect to earn a community badge.</p></article><article><span>02</span><Compass /><h2>Take place quests</h2><p>Visit optional locations with meaningful activities, then keep a private photo or observation.</p></article><article><span>03</span><WalletCards /><h2>Build a Passport</h2><p>Community badges remain the main achievement. Smaller place stamps preserve individual memories.</p></article></section>
      <section className="scope-panel page-width"><div><p className="kicker">Deliberately focused</p><h2>What you won’t find here.</h2></div><div className="scope-list">{['Reservations or deals', 'Ratings and reviews', 'Maps or directions', 'Public photo feeds', 'Points or leaderboards', 'A test of identity'].map((item) => <span key={item}><X size={15} /> {item}</span>)}</div></section>
      <section className="trust-detail page-width"><div className="promise-mark"><KababayanMark /><span>Come as a visitor.<br /><strong>Leave as a kababayan.</strong></span></div><div><p className="kicker dark">The promise</p><h2>Participate without <em>pretending.</em></h2><p>“Being one of the community” means listening, joining respectfully, and understanding more deeply. It never means copying stereotypes or claiming an identity someone has not lived.</p><button className="primary-button fit" onClick={() => navigate('/signup')}>Enter as a guest <ArrowRight size={17} /></button></div></section>
    </main>
  )
}

function NotFound({ navigate }) {
  return <main className="not-found page-width"><Compass size={48} /><h1>That part of the journey could not be found.</h1><button className="primary-button fit" onClick={() => navigate('/app/discover')}>Return to Discover</button></main>
}

function Footer({ navigate, publicPage }) {
  return <footer><div className="footer-inner page-width"><Brand navigate={navigate} /><p>Come as a visitor. Leave as a kababayan.</p><button onClick={() => navigate(publicPage ? '/how-it-works' : '/app/passport')}>{publicPage ? 'How it works' : 'Your Passport'}</button></div></footer>
}

export default App
