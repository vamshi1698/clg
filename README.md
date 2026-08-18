# College/University Website Platform

A comprehensive, modern web application for educational institutions built with Next.js, React, TypeScript, and Tailwind CSS. This project features a full public-facing website and an authenticated Content Management System (CMS) for managing institutional data.

## 🌟 Key Features

### Public Website
- **Home Page:** A beautiful, responsive landing page for the institution.
  
  ![Home Page](./public/Home%20Page.png)

- **Search Functionality:** Comprehensive search and indexing to easily find courses, news, and resources.
  
  ![SearchBar](./public/SearchBar.png)
  ![SearchBar Indexing](./public/SearchBar%20Indexing.png)

- **User Authentication:** Secure login for students, faculty, and administrators with OTP support.
  
  ![User Authentication](./public/User_Auth.png)
  ![OTP Authentication](./public/OTP_Auth.png)

- **Academics & Courses:** Detailed pages for academic programs, departments, and individual courses.
- **Admissions:** Information and resources for prospective students.
- **Student & Campus Life:** Dedicated sections for current students, campus activities, and visitor information.
- **News & Events:** Dynamic news and events boards.
- **Directories:** Faculty, staff, and alumni directories.
- **Interactive Galleries:** Dynamic image and media galleries.
- **Results Portal:** Dedicated student results section.
- **Targeted Portals:** Specific information tailored for Parents, Visitors, and Alumni.

### Content Management System (CMS)
- **Custom Pages:** Easily create and manage custom pages.
  
  ![CMS Custom Pages](./public/CMS_Custom_pages.png)

- **Custom Navigation Links:** Manage the main navigation menu dynamically.
  
  ![CMS Custom Navigation Links](./public/CMS_Custom%20Navigation%20Links.png)

- **Results Upload:** Dedicated interface for faculty/admins to upload student results.
  
  ![CMS Results Upload](./public/CMS_results%20Upload.png)

- Secure, authenticated `/cms` routes for administrative tasks.
- Integrated with Supabase and Postgres for robust data storage and management.
- Media uploads handling and interactive UI elements.

## 🚀 Technology Stack

- **Framework:** Next.js (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI / shadcn/ui
- **Animations:** GSAP & Framer Motion
- **Database / Backend:** Supabase, PostgreSQL (`pg`)
- **Forms & Validation:** React Hook Form & Zod
- **Drag & Drop:** `@dnd-kit`
- **Charts:** Recharts
- **Icons:** Lucide React

## 📂 Project Structure

```text
├── app/                  # Next.js App Router root
│   ├── (site)/           # Public-facing website pages (about, academics, alumni, etc.)
│   ├── api/              # API routes
│   ├── cms/              # Authenticated Content Management System
│   └── ...
├── components/           # Reusable React components grouped by feature (gallery, students, ui, etc.)
├── deploy/               # Deployment scripts (e.g., restore.sh)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and shared logic
├── public/               # Static assets
├── scripts/              # Project maintenance scripts
└── types/                # TypeScript type definitions
```

## 🛠️ Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm
- PostgreSQL / Supabase account (for database operations)

## 🚦 Getting Started

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd clg
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the `.env.example` file to `.env` and fill in the required values (e.g., database connection strings, Supabase keys):
   ```bash
   cp .env.example .env
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📦 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality.
- `npm run typecheck`: Runs TypeScript type checking without emitting files.

## 🌍 Deployment

This project includes configuration files for various deployment strategies:
- **Docker:** Use the provided `Dockerfile` and `.dockerignore` for containerized deployment.
- **Nginx:** An `nginx.conf` is provided for reverse proxy and static asset serving.
- **Netlify:** Contains a `netlify.toml` and Next.js plugin for easy deployment on Netlify.

## 📄 License

This project is proprietary or licensed as per the institutional requirements.
