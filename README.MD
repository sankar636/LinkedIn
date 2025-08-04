🌐 Mini LinkedIn-like Community Platform
A simple community platform where users can register, log in, create posts, view a public feed, and explore user profiles—built as part of the Full Stack Development Internship challenge for CIAAN Cyber Tech Pvt Ltd.

🚀 Live Demo
Frontend (Vercel): https://your-frontend-url.vercel.app

Backend API (Render): https://your-backend-url.onrender.com

🛠️ Tech Stack
Frontend:
React.js

React Router

Axios

Tailwind CSS

Backend:
Node.js with Express.js

MongoDB with Mongoose

JWT Authentication

bcrypt for password hashing

Deployment:
Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

🔑 Features
✅ User Registration & Login (JWT-based authentication)
✅ Create and view text-only posts
✅ Public feed with author’s name and timestamp
✅ User profile page with user details and their posts
✅ Responsive design for desktop and mobile

👤 Demo User Credentials
Email: demo@example.com

Password: 123456

⚙️ Setup Instructions (Local Development)
1️⃣ Clone the repository
bash
Copy
Edit
git clone https://github.com/yourusername/mini-linkedin-platform.git
cd mini-linkedin-platform
2️⃣ Setup Backend
bash
Copy
Edit
cd backend
npm install
Create a .env file with:

env
Copy
Edit
PORT=4000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
Run the backend server:

bash
Copy
Edit
npm start
3️⃣ Setup Frontend
bash
Copy
Edit
cd frontend
npm install
Create .env file:

env
Copy
Edit
VITE_BACKEND_URL=http://localhost:4000
Run the frontend:

bash
Copy
Edit
npm run dev
🌟 Extra Features (Optional)
User can update bio from profile page

Protected routes for authenticated users

Error handling with toast notifications

📧 Contact
Developed by Your Name
For internship assessment submission at CIAAN Cyber Tech Pvt Ltd