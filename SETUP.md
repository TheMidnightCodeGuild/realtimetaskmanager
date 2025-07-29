# Task Manager Setup Guide

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Firebase project

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings

## Environment Variables

Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firestore Security Rules

Set up the following security rules in your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Firestore Indexes (Optional)

The application uses a simple query that doesn't require composite indexes. However, if you want to use more complex queries in the future, you may need to create indexes in the Firebase Console.

For the current implementation, no additional indexes are required.

## Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Create an account or sign in to start managing your tasks

## Features

- ✅ User authentication (sign up/sign in)
- ✅ Create, edit, and delete tasks
- ✅ Task status management (pending, in-progress, completed)
- ✅ Task filtering by status, category, and priority
- ✅ Search functionality
- ✅ Due date tracking with overdue indicators
- ✅ Responsive design
- ✅ Real-time updates with Firestore

## Project Structure

```
task-manager/
├── components/          # React components
│   ├── Layout.jsx      # Main layout with navigation
│   ├── TaskList.jsx    # Task list display
│   ├── TaskForm.jsx    # Task creation/editing form
│   ├── FilterBar.jsx   # Search and filter controls
│   └── Taskitem.jsx    # Individual task item
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── hooks/              # Custom React hooks
│   └── useTasks.js     # Task management hook
├── lib/                # Utility libraries
│   └── firebase.js     # Firebase configuration
├── pages/              # Next.js pages
│   ├── _app.js         # App wrapper
│   ├── index.js        # Dashboard page
│   └── login.js        # Authentication page
└── styles/             # CSS styles
    └── globals.css     # Global styles
```
