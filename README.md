# Portfolio Website

A full-stack portfolio website with a public-facing site and secure admin dashboard for content management.

## Features

### Public Site
- Hero Section with animated introduction
- About Me section with personal bio
- Projects Showcase with filterable gallery
- Skills Display with technology stack
- Contact Form with validation
- Dark Mode support
- Fully responsive design

### Admin Dashboard
- Secure JWT authentication with IP whitelisting
- Project Management (create, edit, delete with image galleries)
- Skills Management
- About Me Editor
- Social Media Links Manager
- Contributors tracking
- Message Inbox
- User Management

### Technical Features
- GraphQL API
- Cloudinary image management
- Rate limiting
- Input sanitization (XSS protection)
- PostgreSQL + MongoDB databases
- Full TypeScript implementation

## Tech Stack

### Frontend
- React 19, TypeScript, Vite
- TailwindCSS, Framer Motion
- React Router, Apollo Client
- React Hook Form

### Backend
- NestJS, TypeScript, GraphQL
- TypeORM (PostgreSQL), Mongoose (MongoDB)
- Passport JWT, Argon2
- Cloudinary

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL 14+
- MongoDB 6+
- Cloudinary account

## Installation

### 1. Clone repository
```bash
git clone <your-repo-url>
cd my-portfolio
```

### 2. Backend Setup
```bash
cd backend
pnpm install
cp .env.example .env
```

Configure `.env`:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=portfolio_db

MONGODB_URI=mongodb://localhost:27017/portfolio

JWT_SECRET=your_generated_secret_here
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_WHITELIST_IPS=127.0.0.1
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Frontend Setup
```bash
cd frontend
pnpm install
cp .env.example .env
```

Configure `.env`:
```env
VITE_API_URL=http://localhost:3000/graphql
```

## Running the Application

### Development Mode

Backend:
```bash
cd backend
pnpm run start:dev
```
Runs on http://localhost:3000
GraphQL Playground: http://localhost:3000/graphql

Frontend:
```bash
cd frontend
pnpm run dev
```
Runs on http://localhost:5173

### Production Build

Backend:
```bash
cd backend
pnpm run build
pnpm run start:prod
```

Frontend:
```bash
cd frontend
pnpm run build
pnpm run preview
```

## Creating Admin User

After starting the backend, create an admin user via GraphQL:

```graphql
mutation {
  register(input: {
    name: "Admin"
    email: "admin@example.com"
    password: "YourSecurePassword123!"
    role: ADMIN
  }) {
    id
    name
    email
    role
  }
}
```

Then login at: http://localhost:5173/admin/login

## Project Structure

```
my-portfolio/
├── backend/
│   ├── src/
│   │   ├── aboutMe/
│   │   ├── auth/
│   │   ├── cloudinary/
│   │   ├── contributors/
│   │   ├── images/
│   │   ├── messages/
│   │   ├── projects/
│   │   ├── security/
│   │   ├── skills/
│   │   ├── socialMedia/
│   │   ├── upload/
│   │   └── users/
│   └── uploads/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── public/
│   │   ├── lib/
│   │   └── store/
│   └── public/
└── README.md
```

## Security Features

- JWT authentication with secure token storage
- Password hashing with Argon2
- Rate limiting on all endpoints
- Input sanitization against XSS
- CORS configuration
- Admin IP whitelisting (optional)
- SQL injection protection via TypeORM
- Secure file upload validation

## Deployment

### Environment Variables for Production

Backend:
- Update `FRONTEND_URL` to your production domain
- Generate strong `JWT_SECRET`
- Set `NODE_ENV=production`
- Configure production database URLs
- Set up Cloudinary credentials
- Configure `ADMIN_WHITELIST_IPS` with your IP

Frontend:
- Update `VITE_API_URL` to your backend domain

### Recommended Hosting

- Frontend: Vercel, Netlify, or Cloudflare Pages
- Backend: Railway, Render, or Heroku
- Database: Railway (PostgreSQL), MongoDB Atlas

## API Documentation

GraphQL API is self-documenting. Access the GraphQL Playground at:
http://localhost:3000/graphql

## Troubleshooting

**Database connection issues:**
- Ensure PostgreSQL and MongoDB are running
- Check credentials in `.env`
- Verify database exists

**Image upload not working:**
- Verify Cloudinary credentials
- Check upload folder permissions

**CORS errors:**
- Ensure `FRONTEND_URL` matches your frontend URL
- Check both are running on correct ports

## License

See LICENSE file for details.
