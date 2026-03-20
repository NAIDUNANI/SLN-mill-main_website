# SLN Rice Mill - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [Admin Dashboard](#admin-dashboard)
7. [User Features](#user-features)
8. [Setup Instructions](#setup-instructions)
9. [Local Backend Setup](#local-backend-setup)
10. [Deployment](#deployment)
11. [Security Best Practices](#security-best-practices)

---

## Project Overview

SLN Rice Mill is a full-stack e-commerce web application for a rice mill business. It provides a public-facing website for customers to browse products and contact the business, along with a comprehensive admin dashboard for managing products, users, and customer queries.

### Key Capabilities
- **Public Website**: Product browsing, shopping cart, contact forms
- **User Authentication**: Email/password signup and login
- **User Profiles**: Manage personal information
- **Shopping Cart**: Persistent cart with localStorage backup
- **Admin Dashboard**: Complete management system for products, users, and queries
- **Product Management**: CRUD operations with image upload support
- **Role-Based Access Control**: Secure admin access using Supabase RLS

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Storage for product images
  - Row-Level Security (RLS)

### State Management
- React Context API (Cart, Auth)
- Local Storage (Cart persistence)

---

## Features

### Public Features
1. **Homepage**: Hero section, about, products showcase, process overview
2. **Product Catalog**: Browse available rice varieties with images and pricing
3. **Shopping Cart**: Add/remove products, update quantities, view totals
4. **Contact Form**: Submit inquiries (stored in database)
5. **Responsive Design**: Mobile-first approach

### User Features
1. **Authentication**: Signup/Login with email and password
2. **Profile Management**: View and update personal information
3. **Cart Persistence**: Cart saved across sessions and after logout
4. **Login-Protected Cart**: Must be logged in to add items to cart

### Admin Features
1. **Dashboard**: Overview of users, products, and queries
2. **Product Management**:
   - Add new products with images
   - View all products
   - Delete products
   - Upload product images to Supabase Storage
3. **User Management**:
   - View all users
   - Delete users
   - View user roles
4. **Query Management**:
   - View customer inquiries
   - Mark queries as resolved
   - Delete queries

---

## Database Schema

### Tables

#### `profiles`
Stores user profile information.
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `user_roles`
Manages user roles (admin, user) separately for security.
```sql
CREATE TYPE app_role AS ENUM ('admin', 'user');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);
```

#### `products`
Stores rice product information.
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'in_stock',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `queries`
Stores customer contact form submissions.
```sql
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage Buckets

#### `product-images`
Public bucket for storing product images.

---

## Authentication & Authorization

### User Registration
1. User signs up with email, password, full name, and phone
2. Trigger automatically creates profile in `profiles` table
3. Default 'user' role assigned in `user_roles` table

### Admin Access
Admin access is controlled through the `user_roles` table.

#### Creating an Admin User

**Option 1: Via SQL (Recommended)**
```sql
-- First, create a user account via signup, then run:
INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
  'admin'::app_role
);
```

**Option 2: Direct Database Access**
1. Go to Supabase Dashboard → Authentication → Users
2. Note the user's UUID
3. Go to SQL Editor and run:
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin'::app_role);
```

#### Changing Admin Candidates

**To Add Admin Role:**
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;
```

**To Remove Admin Role:**
```sql
DELETE FROM user_roles
WHERE user_id = 'user-uuid' AND role = 'admin';
```

**To View All Admins:**
```sql
SELECT u.email, ur.role, ur.created_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

### Row-Level Security (RLS)

The application uses RLS policies to secure data access:

- **Products**: Anyone can view, only admins can manage
- **Profiles**: Users can view/edit own profile, admins can view all
- **Queries**: Anyone can insert, only admins can view/manage
- **User Roles**: Users can view own roles, only admins can manage
- **Storage**: Anyone can view product images, only admins can upload/delete

---

## Admin Dashboard

### Access
Navigate to `/admin/dashboard` after logging in with an admin account.

### Pages

#### Dashboard (`/admin/dashboard`)
- Total users count
- Total products count
- Total queries count
- Quick navigation to management pages

#### Products (`/admin/products`)
- View all products with images
- Add new products with image upload
- Delete products
- Search/filter products

#### Users (`/admin/users`)
- View all registered users
- See user details (name, email, phone, roles)
- Delete users

#### Queries (`/admin/queries`)
- View customer inquiries
- View full message details
- Mark as resolved
- Delete queries

---

## User Features

### Profile Page (`/profile`)
- View email (read-only)
- Update full name
- Update phone number
- Logout button

### Shopping Cart
- **Add to Cart**: Requires login
- **Persistent Storage**: Cart saved to localStorage
- **Survives Logout**: Cart items retained after logout
- **View Cart**: Sidebar showing items, quantities, totals
- **Update Quantity**: Increase/decrease item quantities
- **Remove Items**: Delete individual items
- **Clear Cart**: Remove all items at once

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn/bun
- Supabase account
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd sln-rice-mill
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

4. **Run Database Migrations**
- Navigate to Supabase Dashboard → SQL Editor
- Run all migration files in `supabase/migrations/` in order

5. **Create Admin User**
- Sign up for an account via the app
- Run SQL to grant admin role (see Authentication section)

6. **Start Development Server**
```bash
npm run dev
```

---

## Local Backend Setup

To run Supabase locally instead of using the cloud service:

### Prerequisites
- Docker Desktop installed and running
- Supabase CLI

### Steps

1. **Install Supabase CLI**
```bash
npm install -g supabase
```

2. **Initialize Supabase**
```bash
supabase init
```

3. **Start Local Supabase**
```bash
supabase start
```

This will start:
- PostgreSQL database (port 54322)
- Supabase Studio (port 54323)
- API Gateway (port 54321)
- Auth server
- Storage server

4. **Get Local Credentials**
After starting, you'll see output with:
- API URL: `http://localhost:54321`
- Anon Key: `<local-anon-key>`
- Service Role Key: `<local-service-role-key>`

5. **Update Environment Variables**
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<local-anon-key>
```

6. **Apply Migrations to Local Database**
```bash
supabase db reset
```

7. **Access Local Supabase Studio**
Open `http://localhost:54323` in your browser to manage your local database.

### Syncing with Cloud

**Push local changes to cloud:**
```bash
supabase db push
```

**Pull cloud changes to local:**
```bash
supabase db pull
```

### Stopping Local Supabase
```bash
supabase stop
```

---

## Deployment

### Frontend Deployment
Deployed on your chosen platform:
1. Build with `npm run build`
2. Deploy output (dist) to Vercel/Netlify/Cloudflare/etc.
3. Access via provided URL

### Custom Domain
Configure custom domain in your hosting provider settings.

### Backend (Supabase)
Supabase is already cloud-hosted. No additional deployment needed for backend.

---

## Security Best Practices

### Implemented
✅ Row-Level Security on all tables
✅ Separate user_roles table (prevents privilege escalation)
✅ Security definer functions for role checks
✅ Authentication required for sensitive operations
✅ Input validation on forms
✅ Secure password storage (handled by Supabase Auth)
✅ HTTPS enforced (Supabase)

### Recommended
⚠️ Enable leaked password protection in Supabase Auth settings
⚠️ Configure email verification for production
⚠️ Set up rate limiting for API endpoints
⚠️ Regular security audits
⚠️ Keep dependencies updated

### Admin Security
- Never hardcode admin credentials
- Always use server-side role checks (RLS + has_role function)
- Don't trust client-side localStorage for permissions
- Regularly review admin user list

---

## API Endpoints (Supabase)

All API interactions use Supabase client library:

### Authentication
```typescript
supabase.auth.signUp({ email, password })
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signOut()
supabase.auth.getUser()
```

### Database Operations
```typescript
supabase.from('table_name').select()
supabase.from('table_name').insert(data)
supabase.from('table_name').update(data).eq('id', id)
supabase.from('table_name').delete().eq('id', id)
```

### Storage
```typescript
supabase.storage.from('bucket').upload(path, file)
supabase.storage.from('bucket').getPublicUrl(path)
supabase.storage.from('bucket').remove([path])
```

---

## Troubleshooting

### Common Issues

**1. "Please login to add products to cart" even when logged in**
- Clear browser cache and localStorage
- Check if session is valid: `supabase.auth.getSession()`

**2. Admin dashboard not accessible**
- Verify admin role in database: `SELECT * FROM user_roles WHERE user_id = 'your-id'`
- Clear browser cache
- Check useAuth hook is functioning

**3. Product images not displaying**
- Verify storage bucket is public
- Check image_url in database
- Verify RLS policies on storage.objects

**4. Database errors**
- Check Supabase logs in dashboard
- Verify RLS policies are not blocking operations
- Ensure migrations were applied successfully

---

## Support

For issues or questions:
1. Check this documentation
2. Review Supabase logs in dashboard
3. Check browser console for errors
4. Review network tab for failed requests

---

## License

[Add your license information here]

---

## Credits

Built with:
- React & TypeScript
- Tailwind CSS & Shadcn/ui
- Supabase