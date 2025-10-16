# Frontend App

A modern React frontend application with user authentication and a starting numbers feature, built with Vite and TypeScript.

## Features

- User authentication (login/signup) with JWT cookies
- Create, view, and delete starting numbers
- Mathematical operations tree system (add, subtract, multiply, divide)
- Nested operations with parent-child relationships
- User-based ownership and permissions (users can only delete their own numbers)
- Form validation with Zod
- Toast notifications
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Routing**: React Router DOM v7
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── starting-number/ # Starting number specific components
│   │   ├── create-starting-number-form.tsx
│   │   ├── starting-number-card.tsx
│   │   ├── operation-tree.tsx
│   │   └── operation-input.tsx
│   ├── header.tsx      # App header/navigation
│   └── guest-route.tsx # Route protection
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
│   ├── home.tsx        # Home page
│   ├── login.tsx       # Login page
│   ├── signup.tsx      # Signup page
│   └── starting-numbers.tsx # Starting numbers management
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## Setup & Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**
   Create a `.env` file in the frontend directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Development

- The app runs on `http://localhost:5173` by default (Vite dev server)
- Backend API should be running on `http://localhost:5000`
- Authentication state is managed via React Context
- Forms use React Hook Form with Zod schema validation
- UI components follow Radix UI patterns with Tailwind styling

## Available Routes

- `/` - Home page
- `/login` - User login (guest only)
- `/signup` - User registration (guest only)
- `/starting-numbers` - Starting numbers management with operations

## Key Features

- **Authentication**: JWT token-based auth with HTTP-only cookies
- **Route Protection**: Guest routes redirect authenticated users
- **Starting Numbers**: Create starting numbers and build calculation trees
- **Operations System**:
  - Add mathematical operations (+, -, \*, /) to starting numbers
  - Create nested operation chains (operations can have child operations)
  - View operation trees with author information and timestamps
- **User Permissions**: Users can only delete their own starting numbers
- **Form Validation**: Client-side validation with helpful error messages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Code Splitting**: Lazy-loaded pages for better performance
