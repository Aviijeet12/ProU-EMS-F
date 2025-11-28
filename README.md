
# Employee Task Tracker

This is a single-page responsive web application for tracking employees and their assigned tasks. The backend is under development, so this project uses mock JSON data and is frontend-only.

## Features
- View a list of employees and their assigned tasks
- Filter tasks by status (Pending / In Progress / Completed)
- Add new tasks (frontend-only)
- View a dashboard summary (total tasks, completed %, etc.)
- Clean, modern UI with responsive design

## Framework & Libraries Used
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **State Management:** React useState/useEffect

## Project Structure
- `frontend/` - Main application source code
   - `app/` - Pages and layouts
   - `components/` - Reusable UI components
   - `context/` - React context providers
   - `hooks/` - Custom hooks
   - `lib/` - Utility functions

## Setup Instructions
1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    pnpm install
    ```
3. Start the development server:
    ```sh
    pnpm dev
    ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Assumptions
- All data is stored locally (no backend or database connection)
- Mock data is stored in a `.json` file or hardcoded in code
- Task addition and status changes are frontend-only
- Local storage persistence is implemented for bonus challenge

## Deliverables
1. Source code in this repository
2. This README file with setup instructions, framework/libraries, and assumptions
3. Short screen recording (max 2 minutes) demonstrating the app

## Example Mock Data
```json
{
   "employees": [
      {
         "id": 1,
         "name": "Alice Johnson",
         "role": "Frontend Developer",
         "tasks": [
            { "id": 101, "title": "Build login page", "status": "Completed" },
            { "id": 102, "title": "Implement dashboard", "status": "In Progress" }
         ]
      },
      {
         "id": 2,
         "name": "Bob Smith",
         "role": "Backend Developer",
         "tasks": [
            { "id": 103, "title": "API integration", "status": "Pending" }
         ]
      }
   ]
}
```

## License
MIT
