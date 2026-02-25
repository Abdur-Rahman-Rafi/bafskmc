# BAFSK Math Club Management System

A premium web application for BAFSK Math Club — BAF Shaheen College Kurmitola.

## 🚀 Getting Started

### 1. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

### 2. Manage the Database
We use **Prisma** to manage the database. To view and edit your data (Users, News, Exams, Results) in a visual interface:

```bash
npm run prisma:studio
```
This will open [http://localhost:5555](http://localhost:5555) in your browser.

## 🛠️ Tech Stack
- **Frontend**: Next.js 16+ (App Router), Tailwind CSS 4, Framer Motion
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MySQL (Hosted on Aiven)
- **ORM**: Prisma

## 🛡️ Role-Based Access
- **Students**: Can view news, resources, and take exams.
- **Admins**: Can manage all content, users, and branding.

---
© 2026 BAFSK Math Club. Built with mathematical precision.
