# 🎯 PartTime Job Portal

A full-stack web application connecting students and job seekers with flexible online part-time remote job opportunities.

## 📋 Features

### For Students
- Browse and search jobs without login
- Advanced filtering (category, location, salary, job type)
- Save/bookmark jobs
- Upload resume (PDF)
- Apply for jobs with cover letter
- Track application status
- Manage profile

### For Employers
- Post and manage jobs
- View applicants with skill matching
- Filter applicants by skills and status
- Shortlist candidates
- Approve/reject applications
- Company profile management

### For Admins
- User management
- Job oversight
- Platform statistics

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- bcryptjs

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

4. Start server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:4000
```

4. Start development server:
```bash
npm run dev
```

## 🌐 Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000

## 👥 Default Credentials

### Student
- Email: `student@test.com`
- Password: `Student123!`

### Employer
- Email: `employer@jobportal.com`
- Password: `employer123`

## 📁 Project Structure

```
fullstack/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded files
│   └── server.js        # Entry point
│
└── frontend/
    ├── public/          # Static assets
    └── src/
        ├── components/  # Reusable components
        ├── context/     # React context
        ├── pages/       # Page components
        ├── utils/       # Utilities
        └── App.jsx      # Main component
```

## 🔑 Key Features

### Skill Matching
- Automatic calculation of skill match percentage
- Visual indicators for match quality
- Highlighted matched skills

### Smart Filtering
- Filter by status, skills, location
- Real-time search
- Shortlist functionality

### Resume Management
- PDF upload support
- 5MB file size limit
- Secure local storage
- Direct download for employers

## 📝 API Endpoints

### Public
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Student (Protected)
- `GET /api/student/my-profile` - Get profile
- `POST /api/student/upload-resume` - Upload resume
- `POST /api/student/apply/:jobId` - Apply for job
- `GET /api/student/my-applications` - Get applications

### Employer (Protected)
- `POST /api/employer/jobs` - Post job
- `GET /api/employer/my-jobs` - Get my jobs
- `GET /api/employer/jobs/:jobId/applicants` - Get applicants
- `PUT /api/employer/applications/:id` - Update application status

## 🎨 Design Features

- Responsive design (mobile, tablet, desktop)
- Modern UI with Tailwind CSS
- Smooth animations and transitions
- Toast notifications
- Loading states
- Error handling

## 📄 License

This project is for educational and portfolio purposes.

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your needs.

---

**Built with ❤️ for connecting job seekers with opportunities**
