# AirBnB Capstone Project

## Live Demo
- **Backend (Heroku):** https://airbnb-capstone-salie-9582fe1bcad7.herokuapp.com
- **Frontend (Render):** https://airbnb-frontend-salie.onrender.com

## GitHub Repository
https://github.com/Salie21/Capstone_project

---

## Project Overview
A full-stack Airbnb clone application built with React.js, Node.js, Express.js, and MongoDB Atlas. The application allows users to browse property listings, view listing details, make reservations, and manage listings through an admin dashboard.

---

## Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM v7
- Material UI (MUI) v9
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv

---

## Features

### Frontend (Airbnb Clone)
- Home Page with Hero Banner
- Inspiration Section with location cards
- Future Getaways Section with tabs
- Location Page showing listings filtered by location
- Location Details Page with:
  - Image gallery
  - Dynamic cost calculator
  - Date picker calendar
  - Reservation functionality
- Login Page with JWT authentication
- Static Footer with links

### Admin Dashboard
- Login with role-based access (host/admin)
- Create Listing with full form validation
- View Listings with image display
- Update Listing with pre-filled form
- Delete Listing
- View Reservations

### Backend API
- User authentication with JWT and bcrypt password hashing
- Accommodation CRUD operations
- Reservation management
- Protected routes with middleware
- Input validation

---

## Environment Configuration

### Development
Create a `.env` file in the `Backend` folder:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/airbnb-clone?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
PORT=5000

Create a `.env` file in the `Frontend` folder:
VITE_API_URL=http://localhost:5000

### Production
**Backend (Heroku Config Vars):**
- `MONGO_URI` - MongoDB Atlas direct connection string
- `JWT_SECRET` - JWT secret key
- `PORT` - 5000

**Frontend (Render Environment Variables):**
- `VITE_API_URL` - Heroku backend URL

---

## Local Setup

### Prerequisites
- Node.js v20.x or higher
- MongoDB Atlas account
- Git

### Backend Setup
```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## API Endpoints

### Users
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/users/signup` | Register a new user | No |
| POST | `/api/users/login` | Login user | No |

### Accommodations
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/accommodations` | Get all accommodations | No |
| GET | `/api/accommodations/:id` | Get single accommodation | No |
| GET | `/api/accommodations/host` | Get host accommodations | Yes |
| POST | `/api/accommodations` | Create accommodation | Yes (host) |
| PUT | `/api/accommodations/:id` | Update accommodation | Yes (host) |
| DELETE | `/api/accommodations/:id` | Delete accommodation | Yes (host) |

### Reservations
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/reservations` | Create reservation | Yes |
| GET | `/api/reservations/host` | Get host reservations | Yes (host) |
| GET | `/api/reservations/user` | Get user reservations | Yes |
| DELETE | `/api/reservations/:id` | Delete reservation | Yes |

---

## Project Structure
capstone_airbnb_project/
├── Backend/
│   ├── Controllers/
│   │   ├── accommodationController.js
│   │   ├── reservationController.js
│   │   └── userController.js
│   ├── Models/
│   │   ├── Accommodation.js
│   │   ├── Reservation.js
│   │   └── User.js
│   ├── Routes/
│   │   ├── accommodationRoutes.js
│   │   ├── reservationRoutes.js
│   │   └── userRoutes.js
│   ├── Middleware/
│   │   └── auth.js
│   ├── .env
│   └── server.js
└── Frontend/
├── public/
│   └── assets/
│       └── accommodation/
├── src/
│   ├── assets/
│   │   └── accommodation/
├── Components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── AdminHeader.jsx
│   ├── Banner.jsx
│   ├── Inspiration.jsx
│   ├── FutureGetaways.jsx
│   └── LocationCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── LocationPage.jsx
│   │   ├── ListingDetails.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── CreateListing.jsx
│   │       ├── UpdateListing.jsx
│   │       ├── ViewListings.jsx
│   │       └── Reservations.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json

---

## Deployment

### Backend — Heroku
1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Add remote: `heroku git:remote -a airbnb-capstone-salie`
4. Set environment variables in Heroku Dashboard → Settings → Config Vars
5. Deploy: `git push heroku main`

### Frontend — Render
1. Go to [render.com](https://render.com)
2. Click New → Static Site
3. Connect GitHub repository
4. Set Root Directory to `Frontend`
5. Set Build Command to `npm install && npm run build`
6. Set Publish Directory to `dist`
7. Add environment variable `VITE_API_URL`
8. Click Deploy

---

## Demo Users
| Username | Password | Role |
|---|---|---|
| John Doe | password123 | user |
| Jane Doe | password321 | host |
| Ridwaan Salie | password123 | host |

---

## Author
**Ridwaan Salie**
- GitHub: [Salie21](https://github.com/Salie21)

---
- **Deployed App:** https://airbnb-frontend-salie.onrender.com
- **GitHub:** https://github.com/Salie21/Capstone_project
       
 !     Push rejected, failed to compile Node.js app.
 !     Push failed
