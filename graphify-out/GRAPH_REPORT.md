# Graph Report - waitlist  (2026-06-07)

## Corpus Check
- 37 files · ~48,290 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 148 nodes · 291 edges · 15 communities (14 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8862252f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 20 edges
2. `sendVerificationEmail()` - 10 edges
3. `getDb()` - 10 edges
4. `GET()` - 8 edges
5. `Button()` - 8 edges
6. `getAppUrl()` - 8 edges
7. `sendConfirmationEmail()` - 8 edges
8. `sendPriorityUnlockedEmail()` - 8 edges
9. `submitWaitlistEntry()` - 7 edges
10. `findEntryByDashboardToken()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Banner()` --calls--> `cn()`  [EXTRACTED]
  src/app/queue/[dashboardToken]/page.tsx → src/lib/utils.ts
- `Mark()` --calls--> `cn()`  [EXTRACTED]
  src/components/mortem/mark.tsx → src/lib/utils.ts
- `HomePage()` --calls--> `getDb()`  [EXTRACTED]
  src/app/page.tsx → src/db/client.ts
- `GET()` --calls--> `findEntryByDashboardToken()`  [EXTRACTED]
  src/app/verify/[token]/route.ts → src/lib/waitlist/service.ts
- `GET()` --calls--> `sendConfirmationEmail()`  [EXTRACTED]
  src/app/verify/[token]/route.ts → src/lib/waitlist/mailer.ts

## Communities (15 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (19): Database, getDb(), NewWaitlistEntry, waitlistEntries, WaitlistEntry, waitlistEntryRelations, getDatabaseUrl(), POST() (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (19): FAILURE_MODE_OPTIONS, ROLE_OPTIONS, TEAM_TYPE_OPTIONS, failureModeValues, roleValues, teamTypeValues, WaitlistFormInput, waitlistFormSchema (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.34
Nodes (13): getAppUrl(), getResendApiKey(), getResendFromEmail(), requireEnv(), emailSignOffHtml(), emailWordmarkHeader(), getResendClient(), ResendTemplateEmailPayload (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.36
Nodes (6): ReferralDashboard(), ReferralDashboardProps, verificationHintLine(), Badge(), BadgeProps, badgeVariants

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (16): TiltCard(), SubmitSuccessPayload, WaitlistForm(), WaitlistFormProps, WaitlistModal(), WaitlistModalProps, cn(), XLogo() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (14): diagnosisSteps, exhibits, HomePage(), LandingPageProps, queueSteps, Banner(), QueuePage(), QueuePageProps (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (4): instrumentSerif, interTight, jetbrainsMono, metadata

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (5): code:bash (pnpm install), Environment, Mortem Early Access Landing, Scripts, Stack

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): 1 · Voice, 2 · Color, 3 · Typography, 4 · Layout, Brand — Mortem

## Knowledge Gaps
- **41 isolated node(s):** `nextConfig`, `interTight`, `instrumentSerif`, `jetbrainsMono`, `metadata` (+36 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 4` to `Community 3`, `Community 5`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `getAppUrl()` connect `Community 2` to `Community 5`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `getDb()` connect `Community 0` to `Community 5`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `nextConfig`, `interTight`, `instrumentSerif` to the rest of the system?**
  _41 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._