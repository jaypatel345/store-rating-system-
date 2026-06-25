# Store Rating System

A full-stack web application for managing store ratings with role-based access control.

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: SQLite
- **ORM**: TypeORM
- **Authentication**: JWT with Passport

### Frontend
- **Framework**: React 19
- **Routing**: React Router
- **Styling**: TailwindCSS
- **HTTP Client**: Axios

## Features

### User Roles
1. **System Administrator**
   - Add new stores, normal users, and admin users
   - View dashboard with statistics (total users, stores, ratings)
   - View and filter users by name, email, address, and role
   - View and filter stores by name and address
   - Sort tables by key fields

2. **Normal User**
   - Sign up and login
   - View all registered stores
   - Search stores by name and address
   - Submit ratings (1-5) for stores
   - Modify existing ratings
   - Update password

3. **Store Owner**
   - Login
   - View dashboard with store analytics
   - See average rating of their store
   - View list of users who rated their store
   - Update password

## Form Validations

- **Name**: Min 20 characters, Max 60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, must include at least one uppercase letter and one special character
- **Email**: Standard email validation

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `backend/.env`:
```env
DB_DATABASE=./store-rating-system.db
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3000
```

4. Start the backend server in development mode:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

**Note**: The application uses SQLite for the database. The database file (`store-rating-system.db`) is automatically created on first run.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Running Tests

### Backend Tests

Run all tests:
```bash
cd backend
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:cov
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Users (Admin only)
- `GET /users` - Get all users with filters and sorting
- `GET /users/stats` - Get dashboard statistics
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/password` - Update password

### Stores
- `GET /stores` - Get all stores with filters and sorting
- `GET /stores/:id` - Get store by ID
- `POST /stores` - Create new store (Admin only)

### Ratings
- `POST /ratings` - Create rating (User only)
- `PUT /ratings/:id` - Update rating (User only)
- `GET /ratings/store/:storeId` - Get ratings by store
- `GET /ratings/store/:storeId/average` - Get average rating for store
- `GET /ratings/owner/dashboard` - Get store owner dashboard (Store Owner only)
- `GET /ratings/user` - Get user's ratings (User only)

## Default Test Accounts

The application automatically seeds the following test accounts on first run:

### Admin Account
- **Email**: admin@store-rating.com
- **Password**: Admin123!
- **Role**: ADMIN
- **Access**: Full access to Admin Dashboard (manage users, stores, view statistics)

### Store Owner Account
- **Email**: owner@example.com
- **Password**: Owner123!
- **Role**: STORE_OWNER
- **Access**: Store Owner Dashboard (view store ratings, analytics)

### Sample Stores
The database is seeded with 5 sample stores:
1. Tech Electronics Store
2. Fresh Grocery Market
3. Fashion Boutique
4. Home Furniture Depot
5. Sports Equipment Shop

You can also create additional users via:
- The signup page (for normal users)
- The admin dashboard (for admin users to create other users)

## Project Structure

```
store-rating-system/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   ├── stores/        # Stores module
│   │   ├── ratings/       # Ratings module
│   │   ├── common/        # Common utilities (guards, decorators)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── package.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Development Notes

- The backend uses TypeORM with SQLite for the database
- The database file (`store-rating-system.db`) is automatically created on first run
- All passwords are hashed using bcrypt
- JWT tokens are used for authentication with localStorage persistence
- CORS is enabled for all origins in development mode
- All tables support sorting by key fields
- The application automatically seeds an admin user, store owner, and sample stores on first run

## User Management

### Deleting Users
Currently, there is no UI option to delete users. To delete a user manually:

1. **Via Database**: You can directly interact with the SQLite database:
```bash
cd backend
sqlite3 store-rating-system.db
DELETE FROM users WHERE email = 'user@example.com';
.exit
```

2. **Via Admin Dashboard**: The admin dashboard allows viewing and filtering users, but deletion functionality would need to be added to the backend API and frontend UI.

### Adding User Deletion (Future Enhancement)
To enable user deletion through the UI, you would need to:
1. Add a `DELETE /users/:id` endpoint in `backend/src/users/users.controller.ts`
2. Implement the delete method in `backend/src/users/users.service.ts`
3. Add a delete button in the Admin Dashboard frontend component

## Production Deployment

For production deployment:
1. Disable database synchronization in `backend/src/app.module.ts`
2. Use environment variables for all sensitive data
3. Use a production-grade database
4. Enable HTTPS
5. Set up proper CORS configuration
6. Use a production build of the frontend
