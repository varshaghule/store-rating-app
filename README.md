# RateStore — Store Rating Platform

A full-stack web application where users can submit and manage ratings for registered stores.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Backend | Express.js (Node.js) |
| Database | PostgreSQL via Sequelize ORM |
| Auth | JWT (JSON Web Tokens) |
| Styling | Custom CSS (no UI library) |

---

## Project Structure

```
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Sequelize connection
│   │   ├── models/
│   │   │   ├── User.js              # User model (bcrypt hashing)
│   │   │   ├── Store.js             # Store model
│   │   │   ├── Rating.js            # Rating model (unique user+store)
│   │   │   └── index.js             # Associations
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, updatePassword
│   │   │   ├── adminController.js   # Admin CRUD + dashboard stats
│   │   │   ├── storeController.js   # Store listing + rating submit
│   │   │   └── ownerController.js   # Store owner dashboard
│   │   ├── routes/
│   │   │   ├── auth.js              # /api/auth/*
│   │   │   ├── admin.js             # /api/admin/*
│   │   │   ├── stores.js            # /api/stores/*
│   │   │   └── owner.js             # /api/owner/*
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT auth + role guard
│   │   │   └── validation.js        # express-validator rules
│   │   └── index.js                 # App entry point + DB sync
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js             # Axios client + per-module API funcs
│   │   ├── context/
│   │   │   └── AuthContext.js       # Global auth state
│   │   ├── components/
│   │   │   ├── Layout.js            # Sidebar + topbar shell
│   │   │   └── UI.js                # Shared: Modal, Badge, Stars, etc.
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── AdminDashboard.js    # Stats: users, stores, ratings
│   │   │   ├── AdminUsers.js        # Filterable, sortable user table
│   │   │   ├── AdminStores.js       # Filterable, sortable store table
│   │   │   ├── UserStores.js        # Store cards with star rating UI
│   │   │   ├── OwnerDashboard.js    # Rating list + average
│   │   │   └── UpdatePassword.js    # Shared password change page
│   │   ├── App.js                   # Routes + role-based guards
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml


