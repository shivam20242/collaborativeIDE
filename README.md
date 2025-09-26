# Collaborative Real-Time Code Editor (Web IDE)

**Collaborative IDE** is a powerful real-time web-based code editor that allows multiple users to write, edit, and run code together seamlessly.  
It includes a built-in chat feature, live terminal output, secure authentication, and private coding rooms for teams or individuals.  

With support for multiple languages and real-time collaboration powered by WebSockets, it’s designed for learning, interviews, and collaborative programming.  

---

## ✨ Features

- 🔗 **Real-Time Collaboration** – Multiple users can edit code simultaneously  
- 💬 **Integrated Chat** – Communicate with collaborators while coding  
- 🖥 **Live Code Execution** – Run code directly in the terminal with real-time output  
- 🔒 **Secure Authentication** – Users can log in and create secure sessions  
- 🏠 **Private & Personal Rooms** – Create and join secure rooms for collaborative or private coding  
- 🌍 **Multi-Language Support** – Execute code in various programming languages via Piston API  
- 🎨 **Monaco Editor Integration** – VS Code-like editing experience with syntax highlighting and autocompletion  

---

## 🛠 Tech Stack

- **Frontend:** React.js, Socket.IO, Monaco Editor  
- **Backend:** Node.js, Express.js, Socket.IO  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Code Execution:** Piston API  

---

## 🚀 Getting Started

### ✅ Prerequisites
- [Node.js](https://nodejs.org/) installed  
- [MongoDB](https://www.mongodb.com/) running locally or via MongoDB Atlas  

---

### ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shivam20242/collaborativeIDE.git
   cd collaborativeIDE
2.Install Dependencies
   npm install
3.Set up environment variables:
Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PISTON_API_URL=https://emkc.org/api/v2/piston


4.Start the development server:

npm run dev

💻 Usage

Register or log in to your account

Create or join a room (public or private)

Start coding in the collaborative editor with your teammates

Use the chat feature to communicate in real-time

Run code and see the terminal output instantly

📂 Project Structure
collaborativeIDE/
│── client/         # React frontend with Monaco Editor
│── server/         # Node.js + Express.js backend
│── models/         # MongoDB schemas
│── routes/         # API endpoints
│── sockets/        # Socket.IO handlers for real-time collaboration
│── .env            # Environment variables
│── package.json

🔮 Future Enhancements

📊 Code history and versioning

📱 Mobile-friendly editor support

🧑‍🤝‍🧑 Pair-programming interview mode
🌐 Live Demo & GitHub

Live: Collaborative IDE(https://colllaborativeide.onrender.com)
