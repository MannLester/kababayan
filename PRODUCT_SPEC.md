# Kababayan MVP Product Specification

## Promise

Kababayan helps international visitors participate respectfully in Filipino community life through food, language, people, livelihood, heritage, and reflection.

The website has two layers:

1. A public landing and placeholder authentication flow.
2. A focused application with Discover, Journey, and Passport.

## Locked navigation

### Public

- `/` — marketing landing page
- `/login` — login placeholder
- `/signup` — signup placeholder
- `/how-it-works` — product approach and boundaries

### Application

- `/app/discover` — searchable community selection
- `/app/discover/:communityId` — selected community journey and experiences
- `/app/discover/:communityId/experiences/:experienceId` — experience detail
- `/app/journey` — optional place quests
- `/app/journey/:placeId` — place-quest detail and completion
- `/app/passport` — guest identity, community badges, place stamps, and reflections

## Discover

Discover is organized by community. The MVP contains one functional community, Batangas City, while the interface demonstrates how future community tabs will work.

The Batangas community badge requires:

- Any five of six community experiences
- A typed closing reflection

The Certified Batangueño badge is a playful cultural-journey badge. It is not a government credential, proof of residency, or literal certification of identity.

## Journey

Journey contains optional place quests. A place belongs only when it offers a meaningful cultural, historical, spiritual, livelihood, or environmental activity.

Place quests:

- Do not affect community-badge eligibility
- End with a private location photograph by default
- Permit a written observation when photography is prohibited or inaccessible
- Award a small place stamp rather than a community badge
- Do not use GPS, AI, or public uploads

## Passport

Passport combines:

- Guest identity
- Account-entry placeholders
- Community badges
- Place stamps
- Private reflections
- Private place photos
- Local-storage and reset controls

Community badges remain visually more important than place stamps.

## Persistence

- Text progress is stored in `localStorage`.
- Private photo blobs are stored in IndexedDB.
- Nothing is uploaded or synchronized.

## Success criteria

- Visitors understand the product promise from the landing page within ten seconds.
- Discover is clearly about communities, not generic destinations.
- Journey is clearly about meaningful place activities, not directions or attraction listings.
- The badge and stamp hierarchy is understandable.
- Users understand that progress is trust-based and private.
- Desktop supports planning; mobile supports use during the visit.
