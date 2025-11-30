A full-stack Employee Attendance Management System built using React, Node.js, Express, MongoDB/PostgreSQL and Thunder Client.
The system provides 2 user roles: Employee (mark attendance) and Manager (view & manage team attendance).

1.Employee
Register / Login
Check-In / Check-Out
View my attendance history (calendar & table view)
Monthly attendance summary

2.Manager
Login
View attendance of all employees
Filter by employee / date / status
View team calendar view

Folder Structure 
Attendance-System/
 ├── client/  (React frontend)
 ├── server/  (Node + Express backend)
 ├── README.md


Installation & Setup
1.Clone Repository
git clone https://github.com/ashika-y/Attendance-System.git
cd Attendance-System

2.Setup Backend (Server — Port 5000)
cd server
npm install


3.Create .env file inside server/ based on .env.example:
PORT=5000
MONGO_URI=mongodb+srv://....
JWT_SECRET=your_jwt_secret


4.Run backend:
npm run dev


Server runs at: http://localhost:5000

1.Setup Frontend (Client — Port 5173)
Open new terminal:
cd client
npm install


2.Create .env file inside client/:
VITE_API_URL=http://localhost:5000/api


3.Run frontend:
npm run dev


Client runs at: http://localhost:5173

Pull requests are welcome. For major changes, please open an issue first.
