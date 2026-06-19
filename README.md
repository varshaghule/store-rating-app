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
```

---

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | auto-increment |
| name | VARCHAR(60) | 20–60 chars |
| email | VARCHAR | unique |
| password | VARCHAR | bcrypt hashed |
| address | VARCHAR(400) | |
| role | ENUM | admin / user / store_owner |
| createdAt, updatedAt | TIMESTAMP | |

### `stores`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| name | VARCHAR(60) | 20–60 chars |
| email | VARCHAR | unique |
| address | VARCHAR(400) | |
| ownerId | INTEGER FK | → users.id (nullable) |
| createdAt, updatedAt | TIMESTAMP | |

### `ratings`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| userId | INTEGER FK | → users.id |
| storeId | INTEGER FK | → stores.id |
| rating | INTEGER | 1–5, CHECK constraint |
| createdAt, updatedAt | TIMESTAMP | |

**Unique constraint:** `(userId, storeId)` — one rating per user per store

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /register | — | Normal user registration |
| POST | /login | — | Login (all roles) |
| GET | /me | Any | Get current user |
| PUT | /password | Any | Update password |

### Admin (`/api/admin`)
| Method | Path | Description |
|---|---|---|
| GET | /dashboard | Stats: users, stores, ratings count |
| GET | /users | List users (filter: name/email/address/role, sort) |
| GET | /users/:id | User detail (includes store rating if owner) |
| POST | /users | Create user (any role) |
| GET | /stores | List stores (filter + sort, includes avg rating) |
| POST | /stores | Create store (with optional ownerId) |

### Stores (`/api/stores`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | / | user | List stores with user's rating |
| POST | /:storeId/ratings | user | Submit or update rating (1–5) |

### Owner (`/api/owner`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /dashboard | store_owner | My store + raters list + avg rating |

---

## Form Validations

| Field | Rule |
|---|---|
| Name | 20–60 characters |
| Email | Standard email format |
| Address | Max 400 characters |
| Password | 8–16 chars + 1 uppercase + 1 special character |
| Rating | Integer 1–5 |

App available at: http://localhost:3000  
API at: http://localhost:5000


