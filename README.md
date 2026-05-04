# Mortem Early Access Landing

Standalone Next.js landing page and referral waitlist for Mortem.

## Stack

- Next.js 15 App Router
- Tailwind CSS v4
- Drizzle ORM
- Neon Postgres
- Resend

## Scripts

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm db:generate
pnpm db:push
```

## Environment

Copy `.env.example` to `.env.local` and provide:

- `DATABASE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_APP_URL`
