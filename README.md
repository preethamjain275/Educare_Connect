# EduCare Connect

A comprehensive school management platform that connects students, parents, teachers, doctors, and administrators through a unified digital ecosystem.

## 🎯 Overview

EduCare Connect is a modern educational management system designed to streamline communication, data management, and collaboration among all stakeholders in an educational institution. The platform offers secure role-based access, intelligent assistance, and real-time data synchronization to improve operational efficiency and student well-being.

## ✨ Features

### Multi-Role Authentication

- **Student Portal** – View grades, attendance, health records, and submit leave requests
- **Parent Portal** – Monitor academic progress, health updates, and school announcements
- **Teacher Portal** – Manage attendance, marks, and student performance
- **Doctor Portal** – Access and update student medical and health records
- **Admin Portal** – Complete system control, user management, and data oversight

### Intelligent Assistant

- **Chat Interface** – Natural language interaction for guidance and information
- **Voice Interaction** – Speech-to-text input for hands-free usage
- **Text-to-Speech** – Audio responses to enhance accessibility
- **Context-Aware Responses** – Tailored assistance based on user role and system data

### Core Modules

- Attendance Management
- Academic Records Management
- Student Health Records (BMI, vaccinations, medical history)
- Digital Leave Management System
- Events & Announcements Calendar
- Real-Time Alerts and Notifications

## 🛠️ Technology Stack

### Frontend

- **React 18** – Component-based UI development
- **TypeScript** – Type-safe application logic
- **Vite** – Fast development and build tooling
- **React Router v6** – Client-side routing

### UI & Styling

- **Tailwind CSS** – Utility-first styling
- **shadcn/ui** – Accessible UI components
- **Radix UI** – Headless UI primitives
- **Framer Motion** – Animations and transitions
- **Lucide React & React Icons** – Iconography

### State & Forms

- **TanStack React Query** – Server state management
- **React Hook Form** – Efficient form handling
- **Zod** – Schema validation

### Backend & Database

- **Supabase**

  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication & role-based authorization
  - Real-time subscriptions
  - Serverless Edge Functions
  - Secure file storage

### AI & Voice Services

- **Generative AI APIs** – Conversational assistance
- **Speech-to-Text API** – Voice input processing
- **Text-to-Speech API** – Audio output generation

### Supporting Libraries

- **date-fns** – Date utilities
- **Recharts** – Data visualization
- **Sonner** – Toast notifications
- **Embla Carousel** – UI carousels
- **Vaul** – Mobile drawer components

## 📊 Database Schema

### Core Tables

| Table      | Description                          |
| ---------- | ------------------------------------ |
| students   | Student profile and academic mapping |
| parents    | Parent details linked to students    |
| teachers   | Teacher profiles and subject mapping |
| doctors    | Medical staff information            |
| profiles   | Extended user profile data           |
| user_roles | Role-based access definitions        |

### Academic Data

| Table         | Description                   |
| ------------- | ----------------------------- |
| attendance    | Daily attendance records      |
| marks         | Examination scores and grades |
| leave_letters | Leave requests and approvals  |

### Health & Communication

| Table          | Description                                |
| -------------- | ------------------------------------------ |
| health_records | Student medical history and health metrics |
| events         | School events and activities               |
| alerts         | Notifications and announcements            |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- Git

### Installation

```bash
git clone <YOUR_GIT_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
npm install
npm run dev
```

The application runs at:
`http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── AIAssistant.tsx
│   └── NavLink.tsx
├── hooks/
├── integrations/
│   └── supabase/
├── pages/
│   ├── dashboards/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── AboutPage.tsx
│   └── FeedbackPage.tsx
├── lib/
└── index.css

supabase/
├── functions/
│   ├── ai-chat/
│   ├── text-to-speech/
│   └── speech-to-text/
└── config.toml
```

## 🔐 Security

- Database-level Row Level Security (RLS)
- Strict role-based access control
- Secure authentication and session handling
- Environment-based secret management

## 🎨 Design System

- Tailwind-based semantic color tokens
- Dark mode support
- Responsive typography and spacing
- Consistent UI patterns and animations

## 📱 Responsive Design

Optimized for:

- Desktop
- Tablet
- Mobile devices

## 📄 License

This project is developed exclusively for educational institution management and academic purposes.

---

### 👨‍💻 Developed By

**Purushotham K | Preetham Jain M**
