# JIRA-like Task Management Application

A modern, responsive task management web application built with React, TypeScript, TanStack Query, shadcn/ui, and dnd-kit. This application provides a JIRA-like experience with role-based permissions and drag-and-drop functionality.

## Features

### 🎯 Core Functionality
- **Kanban Board**: Visual task management with 4 status columns (Pending, In Progress, In Review, Done)
- **Drag & Drop**: Intuitive task movement between columns using dnd-kit
- **Role-based Access Control**: Different permissions for Admin, Manager, and Employee roles
- **Real-time Updates**: TanStack Query for efficient data fetching and caching

### 👥 User Roles & Permissions

#### Admin
- ✅ View all tasks and employees
- ✅ Create, edit, and delete tasks
- ✅ Add, edit, and delete employees
- ✅ Assign roles to employees
- ✅ Full system access

#### Manager
- ✅ View all tasks and employees
- ✅ Create, edit, and delete tasks
- ✅ Assign tasks to employees
- ❌ Cannot manage employees

#### Employee
- ✅ View only assigned tasks
- ✅ Update task status via drag & drop
- ❌ Cannot create, edit, or delete tasks
- ❌ Cannot view other employees' tasks

### 🎨 UI Components
- **Modern Design**: Built with shadcn/ui components
- **Responsive Layout**: Works on desktop and mobile devices
- **Interactive Modals**: Task details, create task, and add employee forms
- **Visual Feedback**: Loading states, success notifications, and hover effects

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui + Tailwind CSS
- **Drag & Drop**: dnd-kit
- **Build Tool**: Vite
- **Notifications**: Sonner
- **Backend API**: [MockAPI](https://6881dc8866a7eb81224c5612.mockapi.io/)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd secondchance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MockAPI data (optional)**
   ```bash
   node setup-mockapi.js
   ```
   This will populate your MockAPI with sample employees and tasks.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/                 # API service layer
│   └── index.ts        # API functions using lib/api
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── KanbanBoard.tsx
│   ├── KanbanColumn.tsx
│   ├── TaskCard.tsx
│   ├── TaskModal.tsx
│   ├── EmployeeModal.tsx
│   └── CreateTaskModal.tsx
├── hooks/             # TanStack Query hooks
│   ├── useAuth.ts
│   ├── useEmployees.ts
│   └── useTasks.ts
├── lib/               # Utility libraries
│   └── api.ts         # Centralized API configuration and client
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main application component
└── main.tsx         # Application entry point
```

## Key Components

### KanbanBoard
The main component that orchestrates the drag-and-drop functionality and renders the four status columns.

### TaskCard
Individual task cards that can be dragged between columns. Shows task title, description, assignee, and status.

### TaskModal
Modal for viewing and editing task details. Role-based editing permissions are enforced here.

### EmployeeModal
Form for adding new employees (Admin only).

### CreateTaskModal
Form for creating new tasks (Admin and Manager only).

### API Architecture
The application uses a centralized API configuration in `lib/api.ts` that provides:
- **ApiClient class**: Generic HTTP client with error handling
- **API configuration**: Centralized endpoints and headers
- **Type-safe API functions**: Properly typed for all CRUD operations

## Data Flow

1. **Authentication**: Mock authentication returns current user (Admin by default)
2. **Data Fetching**: TanStack Query hooks fetch employees and tasks
3. **Role Filtering**: Tasks are filtered based on user role
4. **State Updates**: Mutations update data and invalidate queries
5. **UI Updates**: Components re-render with fresh data

## API Integration

The application is now integrated with [MockAPI](https://6881dc8866a7eb81224c5612.mockapi.io/) for real backend functionality:

### Endpoints
- **Employees**: `https://6881dc8866a7eb81224c5612.mockapi.io/employees`
- **Tasks**: `https://6881dc8866a7eb81224c5612.mockapi.io/tasks`

### Sample Data
The setup script (`setup-mockapi.js`) creates:
- **3 Employees**: John Admin, Sarah Manager, Mike Employee
- **4 Tasks**: Various tasks in different statuses assigned to different employees

### Features
- ✅ Real CRUD operations
- ✅ Error handling and retry logic
- ✅ Loading states and user feedback
- ✅ Optimistic updates with TanStack Query
- ✅ Toast notifications for success/error states

## Customization

### Adding New Status Columns
1. Update the `TaskStatus` type in `types/index.ts`
2. Add the new status to the `STATUSES` array in `KanbanBoard.tsx`
3. Update the status color mapping in `TaskCard.tsx` and `KanbanColumn.tsx`

### Modifying Permissions
Update the permission checks in the respective components:
- `App.tsx` for button visibility
- `TaskModal.tsx` for edit/delete permissions

### Styling
The application uses Tailwind CSS with shadcn/ui components. Custom styles can be added to `index.css`.

## Future Enhancements

- [ ] Real backend API integration
- [ ] User authentication system
- [ ] Task comments and attachments
- [ ] Task priority levels
- [ ] Due dates and reminders
- [ ] Task search and filtering
- [ ] Activity timeline
- [ ] Email notifications
- [ ] Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.
