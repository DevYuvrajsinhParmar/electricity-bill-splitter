<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Electricity Bill Splitter

## Product contract

- This is a personal electricity-bill tool for one administrator and a joint family living across three floors.
- Bills cover two-month periods (Jan-Feb, Mar-Apr, and so on).
- The public dashboard and individual bill pages are read-only and may be shared with family members.
- Only the administrator may create, edit, or delete bills. Do not add public registration or family-member accounts.
- Never expose original bill photos, consumer numbers, meter numbers, addresses, or QR codes on public pages.
- There are exactly three submeters/floors in the initial product.
- A floor's consumption is `currentReading - previousReading`.
- Split the entire final bill proportionally by the three floors' submeter consumption.
- Store and calculate money as integer paise. Allocations must always sum exactly to the bill total; distribute leftover paise by largest fractional remainder, with floor order as the deterministic tie-breaker.
- The sum of submeter units is the allocation basis even if it differs from the main meter's billed units.

## Access model and routes

- `/` is the public, read-only family dashboard.
- `/bills/[id]` is a public, read-only bill breakdown.
- `/admin/*` is private and requires the single administrator session.
- Authorization must be checked inside every write operation; hiding admin UI is not authorization.

## Technical direction

- Before choosing a UI component, check the current official docs at https://ui.shadcn.com/ for the Base UI variant configured in this project. Prefer suitable shadcn/ui components, check what is already in `src/components/ui`, and tell the user which missing components the current step needs and why.
- Next.js App Router, React, strict TypeScript, Tailwind CSS, and shadcn/ui.
- Use Server Components by default. Add narrow Client Component boundaries only for browser APIs or interactivity.
- Use native `fetch`, Server Actions for mutations, Zod for validation, React Hook Form for interactive forms, Drizzle ORM, and PostgreSQL (planned hosting: Neon).
- Use Recharts for historical charts only after database-backed dashboard queries exist.
- Use `next-themes` with system preference and the existing class-based dark theme.
- Prefer pure domain functions under `src/lib/billing` and keep them independent of React, Next.js, and the database.
- Do not add Axios, Redux, React Router, Formik, Yup, Prisma, a separate Express API, or WhatsApp Cloud API unless the product requirements materially change.

## Domain conventions

- `totalAmountPaise` and `allocatedAmountPaise` are positive safe integers.
- Meter readings and consumed units are non-negative safe integers.
- A current reading cannot be lower than its previous reading.
- A calculation requires exactly one reading for floors 1, 2, and 3, and total consumption must be greater than zero.
- Convert user-entered rupees to paise at the input boundary. Never perform allocation with floating-point rupee values.
- Use `BigInt(...)` constructors rather than BigInt literal syntax because the project currently targets ES2017.
- Recalculate allocations on the server before persistence; never trust totals calculated by the browser.

## Planned persistence

- `bills`: billing period, total amount in paise, optional notes, and timestamps.
- `floor_readings`: bill reference, floor number, previous/current readings, consumed units, and allocated amount in paise.
- Save a bill and all three readings in one database transaction.
- The latest current reading for each floor becomes the suggested previous reading for the next bill.

## Verification expectations

- Read the relevant installed Next.js documentation before changing Next.js APIs or conventions.
- Run formatting, lint, domain tests, and a production build in proportion to the change.
- Keep testing proportional to this personal app. Automated tests are optional and should focus only on the billing calculation if added later.
- No test runner is installed. Before persistence, verify the known ₹4,342.25 / 780-unit example plus invalid and rounding edge cases; do not claim automated tests pass.

## Current implementation status

- The Add Bill preview starts with `previewBill` in `src/features/bills/preview-bill.ts`. It accepts rupee text and numeric readings.
- `/admin/bills/new` renders `BillForm` for local use. It previews the split in memory and clears stale feedback on edit. Next learning step: verify the sample bill in the browser. Admin authentication is pending and must protect the route before public deployment.

- Project foundation, Tailwind/shadcn styling, Prettier Tailwind sorting, and system-only `next-themes` configuration exist.
- `src/lib/billing` contains the dependency-free calculation and money boundary utilities.
- The production build passes after the billing foundation was added.
- The next milestone is the in-memory Add Bill form and result preview. Do not add database persistence before the calculation flow is verified against known examples.

## Maintenance rule

Proceed one application function in one source file per learning step. Explain what it does and why using a concrete billing example.

When a dependency or registry component is missing, tell the user what to install and wait for them to install it themselves.

Update this file with every implementation change. Keep the product contract, architectural decisions, verification state, current implementation status, and next milestone accurate for the next AI agent.
