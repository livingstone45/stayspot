# 🏠 StaySpot - Property Management Platform

A complete property management and rental system with user authentication, role-based access, and comprehensive property lifecycle management.

**Live Demo:** https://livingstone45.github.io/stayspot/

---

## 🎯 Key Features

✅ **User Management**
- Register/Login with secure JWT authentication
- Role-based access (Tenant, Property Manager, Investor, Admin)
- Email verification and MFA support
- User profile management

✅ **Property Management**
- Complete property CRUD operations
- Property documentation and verification
- Property status tracking
- Lease management

✅ **Tenant Management**
- Tenant registration and verification
- Tenant-property assignments
- Lease agreement management
- Payment history tracking

✅ **Financial Tracking**
- Rent collection management
- Payment history and receipts
- Financial reporting
- Expense tracking

✅ **Maintenance Management**
- Maintenance request submission
- Request tracking and status updates
- Work order management
- Contractor assignment

✅ **Communication**
- Internal messaging system
- Notifications and alerts
- Communication history

✅ **Security**
- JWT token-based authentication
- Role-based access control (RBAC)
- Password encryption (bcryptjs)
- Rate limiting and helmet security

---

## 🚀 Quick Start

### Option 1: Local Development (No Database Setup)

```bash
# Clone repository
git clone https://github.com/livingstone45/stayspot.git
cd stayspot

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start backend (uses SQLite by default)
cd backend && npm run dev
# Backend runs at: http://localhost:5000

# In another terminal, start frontend
cd frontend && npm run dev
# Frontend runs at: http://localhost:3000
```

### Option 2: Deploy to Production

See **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** for detailed deployment instructions.

Quick summary:
1. Deploy backend to Railway (5 minutes)
2. Deploy frontend to GitHub Pages (included)
3. Connect them together
4. Done! 🎉

---

## 📁 Project Structure

```
stayspot/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks (useAuth, etc)
│   │   ├── services/        # API client, authentication
│   │   ├── context/         # Context providers
│   │   └── styles/          # CSS and Tailwind
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API route definitions
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic services
│   │   ├── config/          # Configuration
│   │   └── app.js           # Express app setup
│   ├── package.json
│   └── .env.local
│
├── database/
│   └── schemas/             # Database schema (SQL)
│
└── docs/                    # Built frontend (GitHub Pages)
```

---

## 🔧 Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Sequelize** - ORM
- **PostgreSQL/SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers

### Deployment
- **GitHub Pages** - Frontend hosting
- **Railway** - Backend & database hosting

---

## 📝 Available Scripts

### Backend

```bash
cd backend

npm run dev          # Start development server with hot-reload
npm start           # Start production server
npm run build       # Build for production
npm run migrate     # Run database migrations
npm run seed        # Seed database with sample data
npm run test        # Run tests
npm run lint        # Lint code
```

### Frontend

```bash
cd frontend

npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Lint code
```

---

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:

1. User registers with email/password
2. Password is hashed with bcryptjs (salted)
3. JWT token is generated and sent to frontend
4. Token stored in localStorage
5. Token included in all API requests
6. Token verified on each protected route

Demo credentials:
- Email: `tenant@example.com`
- Password: `password123`

---

## 🗄️ Database Schema

**50+ Tables** organized into sections:

### Core
- Users, Roles, Permissions, User Roles
- User Preferences, Notifications

### Properties
- Properties, Property Units
- Property Documents, Property Features
- Property Images, Property Amenities

### Tenants
- Tenants, Tenant Verification
- Leases, Lease Terms
- Tenant Applications

### Financial
- Payments, Payment Methods
- Invoices, Bills
- Financial Reports

### Maintenance
- Maintenance Requests
- Work Orders
- Maintenance History

### Communication
- Messages, Announcements
- Notifications, Activity Logs

### And more...

See `database/schemas/stayspot_schema.sql` for complete schema.

---

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/login         - Login
POST   /api/auth/register      - Register
POST   /api/auth/logout        - Logout
GET    /api/auth/me            - Get current user
GET    /api/health             - Health check
```

### Properties
```
GET    /api/properties         - List all
GET    /api/properties/:id     - Get one
POST   /api/properties         - Create
PUT    /api/properties/:id     - Update
DELETE /api/properties/:id     - Delete
```

### Tenants
```
GET    /api/tenants            - List all
POST   /api/tenants            - Create
GET    /api/tenants/:id        - Get one
PUT    /api/tenants/:id        - Update
DELETE /api/tenants/:id        - Delete
```

See backend routes for complete API documentation.

---

## 🚀 Deployment

### Frontend (GitHub Pages)
Currently live at: https://livingstone45.github.io/stayspot/

Auto-deploys from the `docs/` folder when you push to GitHub.

### Backend (Railway)
See **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** for step-by-step instructions.

---

## 📚 Documentation

- **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** - Full setup and deployment guide
- **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** - Railway deployment instructions
- **[BACKEND_DEPLOYMENT.md](./BACKEND_DEPLOYMENT.md)** - Backend configuration
- **[database/schemas/stayspot_schema.sql](./database/schemas/stayspot_schema.sql)** - Database schema

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm run dev
```

### Frontend blank page
1. Check browser console for errors
2. Ensure backend is running (or mock auth is working)
3. Check `frontend/src/hooks/useAuth.js` for token issues

### Database connection errors
1. Check `.env.local` configuration
2. Verify database credentials
3. Check Railway dashboard for database status

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

This project is private and not open for public distribution.

---

## 👤 Author

Created by [Your Name]

Repository: https://github.com/livingstone45/stayspot

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Sequelize ORM](https://sequelize.org)
- [Railway Documentation](https://docs.railway.app)
- [GitHub Pages Guide](https://pages.github.com)

---

**Ready to get started? See [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)!** 🚀
