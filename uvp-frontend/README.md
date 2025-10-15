# Unified Volunteering Portal (Frontend)

A Next.js (App Router) + Tailwind CSS frontend for the Unified Volunteering Portal.

## Tech
- Next.js (App Router)
- React (JavaScript)
- Tailwind CSS v4
- Axios

## Getting Started

1. Install dependencies (Yarn preferred):
```bash
yarn
```

2. Run the dev server:
```bash
yarn dev
```

3. Open the app:
- http://localhost:3000

## Environment Variables

- Configure backend base URL in `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Scripts
- `yarn dev` — start dev server
- `yarn build` — build production artifacts
- `yarn start` — run production server

## Project Structure
- `src/app` — App Router pages
  - `/` — Home
  - `/volunteer` — Volunteer Dashboard
  - `/ngo` — NGO Dashboard
  - `/admin` — Admin Dashboard
  - `/tasks/[taskId]` — Task Details
  - `/tasks/[taskId]/apply` — Apply to Task
  - `/tasks/[taskId]/submit` — Submit Proof
  - `/certificates/[certId]` — Certificate Viewer (QR placeholder)
- `src/components` — Shared UI components
  - `Navbar`, `Footer`, `TaskCard`, `ApplicationForm`, `SubmissionForm`
- `src/lib` — Axios client and sample data

## Notes
- Sample data is used for UI rendering; replace with real API calls via `src/lib/api.js`.
- All pages are responsive using Tailwind.
