import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  Download,
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
  const questMatch = path.match(/^\/app\/journey\/([^/]+)$/)

  if (path === '/login' || path === '/signup') {
    page = <AuthPlaceholder mode={path === '/login' ? 'login' : 'signup'} navigate={go} />
  } else if (path === '/how-it-works') {
    page = <HowItWorksPage navigate={go} />
  } else if (experienceMatch) {
    page = <ExperiencePage experience={experienceById[experienceMatch[2]]} progress={progress} setProgress={setProgress} navigate={go} showToast={showToast} />
  } else if (questMatch) {
    page = <PlaceQuestPage quest={placeQuestById[questMatch[1]]} progress={progress} setProgress={setProgress} navigate={go} showToast={showToast} />
  } else if (path === '/app/journey') {
    page = <JourneyPage progress={progress} navigate={go} />
  } else if (path === '/app/passport') {
    page = <PassportPage progress={progress} setProgress={setProgress} navigate={go} showToast={showToast} />
  } else if (path === '/app/discover') {
    page = <DiscoverPage progress={progress} setProgress={setProgress} navigate={go} showToast={showToast} />
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

function Brand({ navigate }) {
  return (
    <button className="brand" onClick={() => navigate('/')} aria-label="Kababyan home">
      <span className="brand-mark"><span />K</span><span>Kababyan</span>
    </button>
  )
}

function PublicHeader({ navigate }) {
  return (
    <header className="topbar public-header">
      <Brand navigate={navigate} />
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
          <p className="kicker">Experience the Philippines from within</p>
          <h1>Arrive as a visitor.<br /><em>Leave with belonging.</em></h1>
          <p>Kababyan turns food, language, stories, and everyday encounters into respectful invitations to participate in Filipino community life.</p>
          <div className="hero-actions">
            <button className="primary-button fit gold-button" onClick={() => navigate('/signup')}>Start your journey <ArrowRight size={18} /></button>
            <button className="ghost-button light" onClick={() => navigate('/how-it-works')}>See how it works</button>
          </div>
        </div>
        <div className="hero-note"><span>Ka</span><p><strong>From kababayan</strong>Someone welcomed as a person from home—not treated as a passing tourist.</p></div>
      </section>

      <section className="intro-section page-width">
        <div className="intro-heading"><p className="kicker dark">A focused travel companion</p><h2>Places are the setting.<br /><em>People are the experience.</em></h2></div>
        <div className="intro-copy"><p>Discover community experiences, take optional place quests, and keep what you learned in a cultural Passport.</p><p>No reservations, ratings, directions, or tourist leaderboards.</p></div>
      </section>

      <section className="landing-preview">
        <div className="page-width preview-layout">
          <div className="preview-copy"><p className="kicker">Your first community</p><h2>Begin in Batangas City.</h2><p>Taste lomi, speak with warmth, enter the palengke with curiosity, and listen to what makes locals proud.</p><button className="text-arrow light-arrow" onClick={() => navigate('/signup')}>Preview the experience <ArrowRight size={17} /></button></div>
          <div className="preview-passport"><div className="badge-emblem"><span>CB</span><small>BATANGAS CITY</small></div><p>Complete five experiences and reflect</p><h3>Certified Batangueño</h3></div>
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

function DiscoverPage({ progress, setProgress, navigate, showToast }) {
  const activeCommunityId = communities.some((community) => community.id === progress.activeCommunity)
    ? progress.activeCommunity
    : 'batangas'
  const activeCommunity = communities.find((community) => community.id === activeCommunityId)
  const communityProgress = progress.communities.batangas
  const badgeEarned = communityProgress.completed.length >= journey.completionRequired && Boolean(communityProgress.reflection.trim())
  const [reflection, setReflection] = useState(communityProgress.reflection)
  const [reflectionError, setReflectionError] = useState('')

  function selectCommunity(event) {
    setProgress((current) => ({ ...current, activeCommunity: event.target.value }))
  }

  function saveReflection() {
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
          badgeDate: current.communities.batangas.badgeDate || new Date().toISOString(),
        },
      },
    }))
    showToast('Certified Batangueño badge earned!')
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
        <div className="community-switcher">
          <div>
            <span className="eyebrow">Your current community</span>
            <strong>{activeCommunity.city}</strong>
            <small>{activeCommunity.status === 'coming-soon' ? 'Journey in development' : 'Community journey available'}</small>
          </div>
          <label className="community-select">
            <span>Change city</span>
            <div>
              <select value={activeCommunityId} onChange={selectCommunity} aria-label="Choose a community">
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.city}{community.status === 'coming-soon' ? ' — Coming soon' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} aria-hidden="true" />
            </div>
          </label>
        </div>

        {activeCommunityId === 'batangas' ? (
          <>
            <div className="community-intro">
              <div><span className="location-pill dark-pill"><MapPin size={14} /> Batangas City, Philippines</span><p className="kicker dark">Community journey</p><h2>Experience Batangas<br /><em>as a kababayan.</em></h2><p>Move through food, language, livelihood, history, and personal stories. Complete any five, then describe when you felt least like a tourist.</p></div>
              <div className="community-progress-card"><span className="eyebrow">Community progress</span><strong>{communityProgress.completed.length}<small> / 6</small></strong><div className="progress-track"><span style={{ width: `${communityProgress.completed.length / 6 * 100}%` }} /></div><p>{badgeEarned ? 'Certified Batangueño earned' : `${Math.max(0, journey.completionRequired - communityProgress.completed.length)} more before your reflection`}</p></div>
            </div>

            <div className="mission-grid">
              {journey.experiences.map((experience, index) => (
                <ExperienceCard key={experience.id} experience={experience} index={index} done={communityProgress.completed.includes(experience.id)} navigate={navigate} />
              ))}
            </div>
          </>
        ) : (
          <div className="community-coming-soon">
            <span className="coming-soon-mark">CE</span>
            <div>
              <p className="kicker dark">Journey in development</p>
              <h2>{activeCommunity.city} is not ready to welcome travelers yet.</h2>
              <p>Its experiences will only be published after the community journey has been researched and validated. Choose Batangas City to explore the current prototype.</p>
            </div>
          </div>
        )}
      </section>

      {activeCommunityId === 'batangas' && (
        <section className="community-reflection page-width">
          <div className="reflection-intro"><p className="kicker dark">Final community requirement</p><h2>When did you feel least like a tourist?</h2><p>What happened in that moment, and what do you understand differently about Batangas now?</p><div className="badge-definition"><BadgeCheck size={20} /><span><strong>Certified Batangueño</strong>A cultural participation badge—not an official credential or claim of residency.</span></div></div>
          <div className="reflection-form">
            <textarea rows="8" value={reflection} disabled={communityProgress.completed.length < journey.completionRequired} onChange={(event) => { setReflection(event.target.value); setReflectionError('') }} placeholder={communityProgress.completed.length >= journey.completionRequired ? 'Write your honest reflection. It stays on this device.' : 'Complete five community experiences to unlock this reflection.'} />
            {reflectionError && <p className="form-error">{reflectionError}</p>}
            {badgeEarned ? <div className="earned-community"><Sparkles size={18} /><span><strong>{journey.welcome}</strong>Your community badge is now in your Passport.</span><button onClick={() => navigate('/app/passport')}>Open Passport <ArrowRight size={15} /></button></div> : <button className="primary-button" disabled={communityProgress.completed.length < journey.completionRequired} onClick={saveReflection}><Sparkles size={18} /> Complete Batangas journey</button>}
          </div>
        </section>
      )}
    </main>
  )
}

function ExperienceCard({ experience, index, done, navigate }) {
  const Icon = experience.icon
  return (
    <article className={`mission-card ${done ? 'done' : ''}`}>
      <div className="mission-topline"><span className={`mission-icon ${experience.color}`}><Icon size={21} /></span><span className="mission-number">{String(index + 1).padStart(2, '0')}</span></div>
      <div className="mission-type">{experience.category}</div><h3>{experience.title}</h3><p>{experience.summary}</p>
      {experience.place && <div className="place-tag"><MapPin size={13} /> {experience.place}</div>}
      <div className="mission-footer"><span>{experience.duration}</span><button className={done ? 'complete-button completed' : 'complete-button'} onClick={() => navigate(`/app/discover/batangas/experiences/${experience.id}`)}>{done ? <><Check size={15} /> Completed</> : <>Open <ChevronRight size={15} /></>}</button></div>
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
    navigate('/app/discover')
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
    navigate('/app/discover')
  }

  return (
    <main className="experience-page">
      <div className="page-width experience-breadcrumb"><button onClick={() => navigate('/app/discover')}><ArrowLeft size={17} /> Back to Batangas</button><span>Discover <ChevronRight size={13} /> {experience.category}</span></div>
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
        <div className="section-heading"><div><p className="kicker dark">Batangas place quests</p><h2>Side quests with a purpose.</h2><p>These quests are optional and do not affect your Certified Batangueño badge.</p></div><div className="trust-chip"><Camera size={18} /><span><strong>Private photos</strong>Never uploaded</span></div></div>
        <div className="place-quest-grid">
          {placeQuests.map((quest) => {
            const completed = progress.placeQuests[quest.id]?.completed
            return <article className={`place-quest-card ${quest.color}`} key={quest.id}><div className="quest-art"><span>{quest.symbol}</span><div className="landmark-sun" /></div><div className="quest-content"><span className="quest-theme">{quest.theme}</span><h3>{quest.name}</h3><p>{quest.summary}</p><div className="quest-meta"><span><MapPin size={13} /> {quest.location}</span><span><Clock3 size={13} /> {quest.duration}</span></div><button className={completed ? 'quest-completed' : ''} onClick={() => navigate(`/app/journey/${quest.id}`)}>{completed ? <><Stamp size={16} /> Stamp earned</> : <>Open place quest <ArrowRight size={16} /></>}</button></div></article>
          })}
        </div>
        <div className="scope-callout"><Compass size={24} /><div><h3>Not a landmark directory.</h3><p>A place appears only when it offers a meaningful cultural, historical, spiritual, livelihood, or environmental activity.</p></div></div>
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
        <aside className={`quest-detail-aside ${quest.color}`}><div className="quest-symbol">{quest.symbol}</div><p className="kicker">{quest.theme}</p><h1>{quest.name}</h1><p>{quest.context}</p><div className="quest-meta vertical"><span><MapPin size={15} /> {quest.location}</span><span><Clock3 size={15} /> {quest.duration}</span></div></aside>
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

function PassportPage({ progress, setProgress, navigate, showToast }) {
  const communityProgress = progress.communities.batangas
  const badgeEarned = communityProgress.completed.length >= journey.completionRequired && Boolean(communityProgress.reflection)
  const completedQuests = placeQuests.filter((quest) => progress.placeQuests[quest.id]?.completed)
  const [name, setName] = useState(progress.displayName)
  const [photos, setPhotos] = useState({})

  useEffect(() => {
    let urls = []
    const earnedQuests = placeQuests.filter((quest) => progress.placeQuests[quest.id]?.completed)
    Promise.all(earnedQuests.map(async (quest) => {
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
    if (!window.confirm('Reset all Kababyan progress and private photos on this device?')) return
    await clearPlacePhotos(placeQuests.map((quest) => quest.id))
    setProgress(emptyProgress())
    showToast('Local Passport reset.')
  }

  function downloadBadge() {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    const context = canvas.getContext('2d')
    context.fillStyle = '#173f35'
    context.fillRect(0, 0, 1200, 630)
    context.fillStyle = '#e9a62c'
    context.beginPath()
    context.arc(270, 315, 145, 0, Math.PI * 2)
    context.fill()
    context.strokeStyle = '#f7d984'
    context.lineWidth = 10
    context.stroke()
    context.fillStyle = '#173f35'
    context.textAlign = 'center'
    context.font = 'bold 90px Georgia'
    context.fillText('CB', 270, 340)
    context.font = 'bold 17px Arial'
    context.fillText('BATANGAS CITY', 270, 390)
    context.textAlign = 'left'
    context.fillStyle = '#e9a62c'
    context.font = 'bold 20px Arial'
    context.fillText('KABABYAN COMMUNITY JOURNEY', 500, 210)
    context.fillStyle = '#ffffff'
    context.font = '62px Georgia'
    context.fillText('Certified Batangueño', 500, 292)
    context.fillStyle = '#c9d7d2'
    context.font = '25px Arial'
    context.fillText('Tasted. Listened. Asked. Supported. Understood.', 500, 350)
    context.fillStyle = '#ffffff'
    context.font = 'bold 23px Arial'
    context.fillText(progress.displayName, 500, 420)
    const link = document.createElement('a')
    link.download = 'certified-batangueno.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <main className="passport-page page-width">
      <section className="passport-heading"><p className="kicker dark">Your cultural Passport</p><h1>Belonging remembered,<br /><em>not scored.</em></h1><p>Community badges, place stamps, photos, and reflections remain private on this device.</p></section>

      <section className="passport-identity">
        <div className="identity-mark"><UserRound size={25} /></div>
        <div><span className="eyebrow">Passport holder</span><div className="name-editor"><input aria-label="Passport display name" value={name} onChange={(event) => setName(event.target.value)} /><button onClick={saveName}>Save</button></div><small>Guest Passport · Local prototype</small></div>
        <div className="identity-actions"><button onClick={() => navigate('/login')}>Log in</button><button onClick={() => navigate('/signup')}>Sign up</button></div>
      </section>

      <div className="passport-sections">
        <section className="passport-community-section">
          <div className="passport-section-heading"><div><span className="eyebrow">Community badges</span><h2>The deeper achievement.</h2></div><span>{badgeEarned ? '1 earned' : 'In progress'}</span></div>
          {badgeEarned ? <div className="earned-badge-panel"><BadgeVisual earned label="Community journey complete" /><div className="badge-memory"><p className="kicker dark">Your reflection</p><blockquote>{communityProgress.reflection}</blockquote><span>Earned {new Date(communityProgress.badgeDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span><button className="secondary-button" onClick={downloadBadge}><Download size={17} /> Download badge card</button></div></div> : <div className="empty-passport-state"><LockKeyhole size={28} /><div><h3>Your Certified Batangueño badge is taking shape.</h3><p>{communityProgress.completed.length} of 5 required experiences complete.</p></div><button onClick={() => navigate('/app/discover')}>Continue Discover <ArrowRight size={15} /></button></div>}
        </section>

        <section className="passport-stamps-section">
          <div className="passport-section-heading"><div><span className="eyebrow">Place stamps</span><h2>Optional memories from meaningful places.</h2></div><span>{completedQuests.length} earned</span></div>
          {completedQuests.length ? <div className="stamp-grid">{completedQuests.map((quest) => { const questProgress = progress.placeQuests[quest.id]; return <article className="stamp-card" key={quest.id}>{photos[quest.id] ? <img src={photos[quest.id]} alt={`Private memory from ${quest.name}`} /> : <div className="stamp-photo-placeholder"><Stamp size={25} /></div>}<div><span className="stamp-symbol">{quest.symbol}</span><small>{quest.theme}</small><h3>{quest.stamp}</h3><p>{questProgress.usedAlternative ? questProgress.observation : questProgress.photoName}</p></div></article> })}</div> : <div className="empty-passport-state compact-empty"><Stamp size={27} /><div><h3>No place stamps yet.</h3><p>Place quests are optional side journeys and do not affect your community badge.</p></div><button onClick={() => navigate('/app/journey')}>Browse place quests <ArrowRight size={15} /></button></div>}
        </section>
      </div>

      <section className="passport-privacy"><ShieldCheck size={22} /><div><strong>Stored only in this browser</strong><p>There is no account synchronization, public gallery, GPS verification, or AI photo review.</p></div><button onClick={reset}><RotateCcw size={14} /> Reset local Passport</button></section>
    </main>
  )
}

function BadgeVisual({ label, earned }) {
  return <div className={`badge-card ${earned ? 'unlocked' : ''}`}><div className="sun-rays" /><div className="badge-emblem"><span>CB</span><small>BATANGAS CITY</small></div><p>Community journey badge</p><h3>Certified Batangueño</h3><div className="badge-lock"><Sparkles size={14} /> {label}</div></div>
}

function HowItWorksPage({ navigate }) {
  return (
    <main className="about-page">
      <section className="about-hero page-width"><p className="kicker dark">How Kababyan works</p><h1>Community first.<br />Places with purpose.<br /><em>Memories kept private.</em></h1><p>Kababyan separates belonging from sightseeing so neither becomes a generic travel checklist.</p></section>
      <section className="principles page-width"><article><span>01</span><Users /><h2>Discover communities</h2><p>Participate in food, language, livelihood, heritage, and personal stories. Reflect to earn a community badge.</p></article><article><span>02</span><Compass /><h2>Take place quests</h2><p>Visit optional locations with meaningful activities, then keep a private photo or observation.</p></article><article><span>03</span><WalletCards /><h2>Build a Passport</h2><p>Community badges remain the main achievement. Smaller place stamps preserve individual memories.</p></article></section>
      <section className="scope-panel page-width"><div><p className="kicker">Deliberately focused</p><h2>What you won’t find here.</h2></div><div className="scope-list">{['Reservations or deals', 'Ratings and reviews', 'Maps or directions', 'Public photo feeds', 'Points or leaderboards', 'A test of identity'].map((item) => <span key={item}><X size={15} /> {item}</span>)}</div></section>
      <section className="trust-detail page-width"><div className="name-mark">Ka<br />ba<br />byan</div><div><p className="kicker dark">The promise</p><h2>Participate without <em>pretending.</em></h2><p>“Being one of the community” means listening, joining respectfully, and understanding more deeply. It never means copying stereotypes or claiming an identity someone has not lived.</p><button className="primary-button fit" onClick={() => navigate('/signup')}>Enter as a guest <ArrowRight size={17} /></button></div></section>
    </main>
  )
}

function NotFound({ navigate }) {
  return <main className="not-found page-width"><Compass size={48} /><h1>That part of the journey could not be found.</h1><button className="primary-button fit" onClick={() => navigate('/app/discover')}>Return to Discover</button></main>
}

function Footer({ navigate, publicPage }) {
  return <footer><div className="footer-inner page-width"><Brand navigate={navigate} /><p>Travel closer. Listen longer. Leave as kababayan.</p><button onClick={() => navigate(publicPage ? '/how-it-works' : '/app/passport')}>{publicPage ? 'How it works' : 'Your Passport'}</button></div></footer>
}

export default App
