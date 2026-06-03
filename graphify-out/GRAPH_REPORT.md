# Graph Report - waitlist  (2026-06-03)

## Corpus Check
- 36 files · ~47,841 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 144 nodes · 283 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d10a08b6`
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
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 20 edges
2. `getDb()` - 10 edges
3. `GET()` - 8 edges
4. `Button()` - 8 edges
5. `getAppUrl()` - 8 edges
6. `sendVerificationEmail()` - 8 edges
7. `sendConfirmationEmail()` - 8 edges
8. `sendPriorityUnlockedEmail()` - 8 edges
9. `submitWaitlistEntry()` - 7 edges
10. `findEntryByDashboardToken()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Banner()` --calls--> `cn()`  [EXTRACTED]
  src/app/queue/[dashboardToken]/page.tsx → src/lib/utils.ts
- `XLogo()` --calls--> `cn()`  [EXTRACTED]
  src/components/mortem/x-updates-link.tsx → src/lib/utils.ts
- `HomePage()` --calls--> `findEntryByDashboardToken()`  [EXTRACTED]
  src/app/page.tsx → src/lib/waitlist/service.ts
- `HomePage()` --calls--> `getDb()`  [EXTRACTED]
  src/app/page.tsx → src/db/client.ts
- `GET()` --calls--> `findEntryByDashboardToken()`  [EXTRACTED]
  src/app/verify/[token]/route.ts → src/lib/waitlist/service.ts

## Communities (18 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (18): getDb(), NewWaitlistEntry, waitlistEntries, WaitlistEntry, waitlistEntryRelations, POST(), GET(), mortemDashboardCookieOptions() (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (18): FAILURE_MODE_OPTIONS, ROLE_OPTIONS, TEAM_TYPE_OPTIONS, failureModeValues, roleValues, teamTypeValues, WaitlistFormInput, waitlistFormSchema (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.36
Nodes (12): Database, getAppUrl(), getDatabaseUrl(), getResendApiKey(), getResendFromEmail(), requireEnv(), emailSignOffHtml(), emailWordmarkHeader() (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.21
Nodes (11): Banner(), QueuePage(), QueuePageProps, toVerificationState(), ReferralDashboard(), ReferralDashboardProps, verificationHintLine(), Badge() (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.27
Nodes (7): TiltCard(), cn(), Mark(), MarkProps, Wordmark(), Select, Textarea

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (6): diagnosisSteps, exhibits, HomePage(), LandingPageProps, queueSteps, Reveal()

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (4): instrumentSerif, interTight, jetbrainsMono, metadata

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (4): SubmitSuccessPayload, WaitlistForm(), WaitlistFormProps, Input

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (5): code:bash (pnpm install), Environment, Mortem Early Access Landing, Scripts, Stack

### Community 9 - "Community 9"
Cohesion: 0.47
Nodes (4): WaitlistModal(), WaitlistModalProps, Button(), ButtonProps

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): 1 · Voice, 2 · Color, 3 · Typography, 4 · Layout, Brand — Mortem

### Community 11 - "Community 11"
Cohesion: 0.5
Nodes (4): XLogo(), XUpdatesLink(), XUpdatesLinkProps, buttonVariants

## Knowledge Gaps
- **40 isolated node(s):** `nextConfig`, `interTight`, `instrumentSerif`, `jetbrainsMono`, `metadata` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 4` to `Community 11`, `Community 9`, `Community 3`, `Community 7`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `getDb()` connect `Community 0` to `Community 2`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `getAppUrl()` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `nextConfig`, `interTight`, `instrumentSerif` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._