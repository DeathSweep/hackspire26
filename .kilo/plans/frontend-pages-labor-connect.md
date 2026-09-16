# Frontend Implementation Plan for Hackspire26 (Labor Connect)

## Confirmed Requirements
- Build ALL pages/routes in the app
- Color scheme: White (`#FDFBFA`), Navy (`#0C1A30`), Rust (`#B9523D`)
- Dark mode support
- Sticky/fixed navbar
- New jobs created via `/jobs/new` should appear on `/jobs` list

## Tech Stack & Constraints
- Next.js 16.3.5 (App Router), React 19, Tailwind CSS v4, TypeScript
- Follow `node_modules/next/dist/docs/` guidance (no older conventions)
- `lucide-react` available for icons

## Color System
| Role | Value | Usage |
|------|-------|-------|
| Navy | `#0C1A30` | Primary text, nav background, headers, borders |
| Rust | `#B9523D` | Accent buttons, active states, icons, highlights |
| White | `#FDFBFA` | Page background, cards, form fields |

## Global Changes

### `app/globals.css`
- Replace default theme with custom palette
- Add `--color-navy`, `--color-rust`, `--color-white`
- Add dark mode variant using `prefers-color-scheme: dark` and/or `.dark` class
- Update `@theme inline` to expose colors to Tailwind

### `app/layout.tsx`
- Update `metadata.title` and `description`
- Ensure `className` supports `.dark` class toggling
- Keep Geist fonts

## Shared Components

### `components/navbar.tsx`
- Sticky top (`sticky top-0 z-50`)
- Left: Logo (Layers icon + "LABOR CONNECT" in rust icon + navy text)
- Center/Right: Nav links (Home, Jobs, Dashboard, etc.)
- Right actions: Sign In link, Sign Up button (rust)
- Mobile: Hamburger menu with slide-down nav
- Dark mode aware (navy bg in light, darker navy in dark)

### `components/footer.tsx`
- Simple footer with copyright, links
- Navy background, white text

### `components/button.tsx`
- Variants: `primary` (rust bg), `secondary` (navy bg), `ghost` (transparent)
- Sizes: `sm`, `md`, `lg`
- Full width option

### `components/card.tsx`
- White bg, subtle border/shadow
- Optional rust top border accent

### `components/job-card.tsx`
- Displays job title, company, location, pay tag
- Clickable, selected state (rust border)
- Bookmark icon button

### `components/job-detail.tsx`
- Full job info display
- Apply button (rust), action icons

## Page Specifications

### `/` — Home (`app/page.tsx`)
- Hero section: large heading, subtitle, CTA buttons (Sign Up rust, Sign In ghost)
- Value props row: 3 cards (Verified Workers, Efficient Matching, Secure Payments)
- How it works: 3-step visual
- Footer CTA section
- Dark mode compatible

### `/login` (`app/login/page.tsx`)
- Client component (`"use client"`)
- Split layout: `md:flex-row`
  - Left (`md:w-5/12`): Navy bg, logo, headline, value props
  - Right (`md:w-7/12`): White bg, login form
- Form: Email, Password, "Remember me", Submit button (rust), "Forgot password?" link, Sign up link
- Form validation UI (error states)
- Dark mode aware

### `/signup` (`app/signup/page.tsx`)
- Client component
- Existing form is almost complete; refine:
  - Add error/success states
  - Ensure dark mode classes
  - Link to login
- Keep split layout consistent with login

### `/onboarding` (`app/onboarding/page.tsx`)
- Client component
- Multi-step or single-step profile setup
- Worker: skills, experience, hourly rate
- Client: company name, industry
- Progress indicator
- Save and continue buttons
- Redirect to dashboard on completion

### `/dashboard` (`app/dashboard/page.tsx`)
- Client component
- Overview cards row: Active Jobs, Applications Sent, Earnings (placeholder), Profile Completion
- Recent activity list or job matches
- Quick action buttons (Post Job, Browse Jobs)
- Dark mode cards

### `/jobs` (`app/jobs/page.tsx`)
- Client component
- Convert raw HTML to React components
- Layout: `flex flex-col lg:flex-row`
  - Left sidebar / top bar: Search input, location input, filter chips (Pay, Remote, Job type, Skills, etc.)
  - Right content: Split view on lg screens
    - Left: Job cards list (uses `JobCard` component)
    - Right: Selected job detail pane (uses `JobDetail` component)
- State: `selectedJobId`, `jobs` array
- "Easily apply" badges, bookmark buttons
- Dark mode

### `/jobs/new` (`app/jobs/new/page.tsx`)
- Client component
- Form: Title, Company, Location, Pay range, Job type (select), Skills (tags input), Description (textarea)
- Submit creates new job object, adds to local state, redirects to `/jobs`
- Since no backend, use React context or lift state to shared store

### `/jobs/[id]` (`app/jobs/[id]/page.tsx`)
- Server or client component
- Fetch job by `params.id` from shared data store
- Full detail view with apply button, company info, description, location
- If not found, show not-found UI

## State Management for Jobs (No Backend)
Since there is no backend, implement a lightweight client-side store:
- Create `context/jobs-context.tsx` or similar
- `JobsProvider` wraps app or jobs section
- `jobs` array in context with initial placeholder data
- `addJob` function exposed via context
- `/jobs/new` calls `addJob` then `router.push('/jobs')`
- `/jobs` and `/jobs/[id]` read from context

## Dark Mode Implementation
- Use `.dark` class on `<html>` or `<body>`
- Toggle button in navbar (sun/moon icon)
- Store preference in `localStorage`
- CSS custom properties swap in dark mode
- All components respect dark mode via Tailwind `dark:` variants

## Responsive Behavior
- Mobile-first (`default` = mobile, `md:` = tablet, `lg:` = desktop)
- Navbar collapses to hamburger below `md`
- Jobs page stacks vertically on mobile, side-by-side on `lg`
- Forms full width on mobile, centered on desktop

## Accessibility
- Semantic HTML (`<nav>`, `<main>`, `<header>`)
- Labels for all inputs
- Focus states visible (rust ring)
- ARIA labels for icon-only buttons

## Execution Order
1. Global CSS + layout updates
2. Shared components (navbar, footer, button, card, job-card, job-detail)
3. Jobs context/state
4. Home page
5. Login + Signup pages
6. Onboarding page
7. Dashboard page
8. Jobs pages (list, new, detail)
9. Lint/typecheck
10. Verify dev server

## Questions / Assumptions
- No backend: all data is client-side in-memory (lost on refresh)
- Dark mode preference persisted in localStorage
- No authentication flow beyond UI
- Initial placeholder jobs hardcoded in context
