# Frontend Folder Structure

```
frontend/
├── app/                # Next.js app directory (routing, layouts, protected routes)
│   ├── layout.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── (protected)/
│       ├── layout.tsx
│       ├── dashboard/
│       │   └── page.tsx
│       ├── employees/
│       │   ├── page.tsx
│       │   └── loading.tsx
│       └── tasks/
│           ├── page.tsx
│           └── loading.tsx
├── components/         # Reusable UI and feature components
│   ├── delete-confirmation-modal.tsx
│   ├── employee-card.tsx
│   ├── employee-form-modal.tsx
│   ├── search-filter-bar.tsx
│   ├── sidebar.tsx
│   ├── stats-card.tsx
│   ├── task-card.tsx
│   ├── task-form-modal.tsx
│   ├── theme-provider.tsx
│   ├── three-background.tsx
│   └── ui/             # UI primitives (button, input, dialog, etc.)
├── context/            # React context for auth and data
│   ├── auth-context.tsx
│   └── data-context.tsx
├── hooks/              # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                # Utility functions
│   └── utils.ts
├── public/             # Static assets
├── styles/             # Global CSS
│   └── globals.css
├── .env.local          # Frontend environment config
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript config
├── README.md           # Project documentation
```

---

**Notes:**
- All UI components are modular and reusable.
- Context folder manages authentication and data state.
- Hooks folder contains custom React hooks.
- `app/` uses Next.js routing and layouts, including protected routes and loading states.
- `public/` holds images and static assets.
- `.env.local` configures API base URL and other frontend environment variables.
- `tsconfig.json` sets up TypeScript paths and options.
