# E-commerce Admin Dashboard - Frontend

React-based admin dashboard for managing e-commerce operations.

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client with auto token refresh
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Features

### Implemented Screens

1. **Login** - Email/password authentication with error handling
2. **Dashboard** - Overview with user info and permissions
3. **Permissions** - Create permission groups with actions
4. **Roles** - Create/edit roles with permission grid
5. **Users** - User management with role assignment
6. **Media Library** - File upload with thumbnail generation
7. **Categories** - Coming soon
8. **Brands** - Coming soon
9. **Attributes** - Coming soon
10. **Products** - Coming soon

### Key Features

- ✅ JWT authentication with automatic token refresh
- ✅ Permission-based UI (hides/disables unauthorized actions)
- ✅ Session persistence (survives page refresh)
- ✅ Real logout (revokes refresh token on backend)
- ✅ Loading, empty, and error states
- ✅ API validation error display
- ✅ Responsive design
- ✅ Clean, functional UI

## Setup

### Prerequisites

- Node.js 18+ installed
- Backend API running on http://localhost:3000

### Installation

```bash
# Install dependencies
npm install

# Create .env file (already exists)
# VITE_API_URL=http://localhost:3000

# Start development server
npm run dev
```

The frontend will run on http://localhost:5173

## Default Accounts

### Super Administrator
- **Email**: admin@ecommerce.com
- **Password**: admin123
- **Access**: All modules and permissions

### Catalog Manager
- **Email**: catalog@ecommerce.com
- **Password**: admin123
- **Access**: Limited to catalog modules only

Test permission enforcement by logging in as the catalog manager and attempting to access Users or Roles - you should see a 403 error or hidden menu items.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── DashboardLayout.jsx  # Main layout with sidebar
│   │   └── ProtectedRoute.jsx       # Route guard
│   ├── lib/
│   │   └── axios.js                 # API client with interceptors
│   ├── pages/
│   │   ├── Login.jsx                # Login page
│   │   ├── Dashboard.jsx            # Dashboard home
│   │   ├── Permissions.jsx          # Permission management
│   │   ├── Roles.jsx                # Role management
│   │   ├── Users.jsx                # User management
│   │   ├── Media.jsx                # Media library
│   │   ├── Categories.jsx           # Categories (stub)
│   │   ├── Brands.jsx               # Brands (stub)
│   │   ├── Attributes.jsx           # Attributes (stub)
│   │   └── Products.jsx             # Products (stub)
│   ├── store/
│   │   └── authStore.js             # Auth state management
│   ├── App.jsx                      # Main app with routing
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles + Tailwind
├── .env                              # Environment variables
├── package.json                      # Dependencies
└── README.md                         # This file
```

## API Integration

The frontend communicates with the backend REST API:

- **Base URL**: http://localhost:3000
- **Auth**: Bearer token in Authorization header
- **Token Refresh**: Automatic via Axios interceptor
- **Error Handling**: Centralized with user-friendly messages

### Axios Interceptor

The `src/lib/axios.js` file includes:
- Automatic token attachment
- Auto-refresh on 401 errors
- Queue failed requests during refresh
- Redirect to login if refresh fails
- Prevents parallel refresh requests

## Building for Production

```bash
# Build
npm run build

# Preview production build
npm run preview
```

Build output will be in the `dist` directory.

## Development Notes

- **Permission Check**: Use `hasPermission('module:action')` from auth store
- **Protected Routes**: Wrapped in `<ProtectedRoute>` component
- **API Errors**: Displayed via `alert()` (can be enhanced with toast notifications)
- **Forms**: Controlled components with React state
- **Modals**: Conditional rendering with backdrop

## Status

### Completed
- ✅ Authentication & session management
- ✅ Dashboard layout with sidebar
- ✅ Permission management
- ✅ Role management with permission grid
- ✅ User management with filters
- ✅ Media library with upload

### To Complete
- ⏳ Categories management
- ⏳ Brands management
- ⏳ Attributes management
- ⏳ Products management (most complex)

## Known Issues

None at this time.

## Future Enhancements

- Toast notifications instead of alert()
- Image preview modal in media library
- Drag & drop file upload
- Pagination for all lists
- Advanced filters
- Bulk actions
- Export data
- Dark mode

## License

Part of Trends Bird Limited Backend Intern Assignment.
