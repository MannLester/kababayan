# Kababayan

Kababayan is a web-first cultural tourism prototype that helps international visitors participate respectfully in Filipino community life instead of merely collecting attractions.

## Website structure

### Public layer

- Marketing landing page
- How It Works page
- Login and signup placeholders
- Guest entry without credentials

### Application layer

- **Discover:** browse communities and complete community experiences
- **Journey:** take optional place-based side quests
- **Passport:** manage the guest identity, community badges, place stamps, photos, and reflections

Batangas City is the only functional MVP community.

## Completion model

### Community badge

Complete any five of six Batangas community experiences and submit a typed reflection to earn the **Certified Batangueño** cultural journey badge.

### Place stamps

Complete an optional place quest and add a private location photograph. A written observation is available when photography is prohibited or inaccessible.

The badge is a playful record of participation. It is not an official credential, proof of residency, or literal certification of identity.

## Privacy and persistence

- Progress and text are stored in `localStorage`.
- Private photo blobs are stored in IndexedDB.
- No content is uploaded.
- No account, backend, GPS, or AI verification is used.

See [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) and [SCOPE_BOUNDARIES.md](./SCOPE_BOUNDARIES.md).

## Run locally

```bash
npm install
npm run dev
```

Verify:

```bash
npm run lint
npm run build
```
