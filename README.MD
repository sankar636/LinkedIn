🌐 Mini LinkedIn-like Community Platform
A simple community platform where users can register, log in, create posts, view a public feed, and explore user profiles—built as part of the Full Stack Development Internship challenge for CIAAN Cyber Tech Pvt Ltd.

🚀 Live Demo
Frontend (Vercel): https://linked-in-iota-snowy.vercel.app/

Backend API (Render): https://linkedin-q5gk.onrender.com/

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
Email: sankarshan@sahu.example.com
Password: Sankar@shan

⚙️ Setup Instructions (Local Development)
1 Setup Backend
cd backend
npm install
Create a .env file with:

2 env
PORT=4000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
Run the backend server:
npm run dev

3️ Setup Frontend
cd frontend
npm install

4. Create .env file:
env
VITE_BACKEND_URL=http://localhost:4000
Run the frontend:
npm run dev

🌟 Extra Features (Optional)
User can update bio from profile page
Protected routes for authenticated users
Error handling with toast notifications

📧 Contact
Developed by Sankarshan Sahu
For internship assessment submission at CIAAN Cyber Tech Pvt Ltd
