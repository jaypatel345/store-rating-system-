# Store Rating System

A full-stack web application for managing store ratings with role-based access control.

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
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
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE store_rating_system;
```

2. Update the database configuration in `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=store_rating_system
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=7d
PORT=3000
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server in development mode:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

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

## Default Users

After setting up the database, you can create users via:
1. The signup page (for normal users)
2. The admin dashboard (for admin users to create other users)

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

- The backend uses TypeORM with synchronize: true for auto-migration (not recommended for production)
- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is enabled for the frontend at localhost:5173
- All tables support sorting by key fields

## Production Deployment

For production deployment:
1. Disable database synchronization in `backend/src/app.module.ts`
2. Use environment variables for all sensitive data
3. Use a production-grade database
4. Enable HTTPS
5. Set up proper CORS configuration
6. Use a production build of the frontend
