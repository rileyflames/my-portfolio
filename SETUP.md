# Setup Guide for New Users

This guide will help you set up and customize this portfolio website for your own use.

## Quick Start

### 1. Prerequisites
- Node.js 18+ and pnpm installed
- PostgreSQL 14+ running locally or remotely
- MongoDB 6+ running locally or remotely
- Cloudinary account (free tier works fine)

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd my-portfolio

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 3. Configure Backend

Create `backend/.env` from the example:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your details:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=portfolio_db

MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Secret (IMPORTANT: Generate a strong secret)
# Run this command to generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=paste_your_generated_secret_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
# Sign up at https://cloudinary.com and get these from your dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security (Optional)
# Add your IP address to restrict admin access
ADMIN_WHITELIST_IPS=127.0.0.1
```

### 4. Configure Frontend

Create `frontend/.env`:
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/graphql
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
pnpm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm run dev
```

### 6. Create Your Admin Account

1. Open http://localhost:3000/graphql in your browser
2. Run this mutation (replace with your details):

```graphql
mutation {
  register(input: {
    name: "Your Name"
    email: "your@email.com"
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

3. Login at http://localhost:5173/admin/login

## Customization Guide

### Update Personal Information

1. **Hero Section** - Edit `frontend/src/components/Hero.tsx`
   - Change the name in the greeting
   - Update the description text
   - Modify call-to-action buttons

2. **Footer** - Edit `frontend/src/components/Footer.tsx`
   - Update copyright name
   - Change year if needed

3. **About Me** - Use the admin dashboard at `/admin/projects` → About tab
   - Add your bio
   - Upload your photo
   - Set your details

4. **Social Media Links** - Use admin dashboard → Social Media tab
   - Add your GitHub, LinkedIn, Twitter, etc.

5. **Skills** - Use admin dashboard → Technologies tab
   - Add your tech stack
   - Set proficiency levels

6. **Projects** - Use admin dashboard → Projects tab
   - Add your projects
   - Upload project images
   - Link to GitHub repos and live demos

### Styling Customization

The project uses TailwindCSS. Main colors are defined in:
- `frontend/src/index.css` - Global styles
- Purple accent color is used throughout (change to your preference)

### Database Setup

The application will automatically create tables on first run. If you need to reset:

```bash
# Drop and recreate the database
psql -U postgres
DROP DATABASE portfolio_db;
CREATE DATABASE portfolio_db;
\q
```

## Deployment

See the main README.md for deployment instructions to:
- Vercel/Netlify (Frontend)
- Railway/Render (Backend)
- Railway/MongoDB Atlas (Databases)

## Troubleshooting

**Can't connect to database:**
- Ensure PostgreSQL and MongoDB are running
- Check credentials in `.env`
- Verify database exists

**Cloudinary uploads not working:**
- Double-check your Cloudinary credentials
- Ensure you're using the correct cloud name

**CORS errors:**
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check both servers are running

**Can't login to admin:**
- Verify you created an admin user with `role: ADMIN`
- Check JWT_SECRET is set in backend `.env`
- Clear browser cookies and try again

## Getting Help

- Check the main README.md for detailed documentation
- Review the GraphQL Playground at http://localhost:3000/graphql
- Check browser console for frontend errors
- Check terminal output for backend errors

## Security Checklist Before Deployment

- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Change all default passwords
- [ ] Set NODE_ENV=production
- [ ] Configure ADMIN_WHITELIST_IPS with your IP
- [ ] Use HTTPS in production
- [ ] Set strong admin password
- [ ] Review CORS settings
- [ ] Enable rate limiting (already configured)
- [ ] Backup your database regularly

Enjoy your new portfolio website!
