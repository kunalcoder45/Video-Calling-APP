# Video Calling App

A real-time **video calling and chat application** built with **React, Node.js, Express, and Socket.io**. It allows users to create or join a room, make video calls, and send messages.

## 🚀 Features

✅ **Create a new meeting** with a unique room code  
✅ **Join an existing meeting** using a room code  
✅ **Real-time video and audio call** using WebRTC  
✅ **Live chat messaging** during the call  
✅ **Automatic video start** when a user joins  
✅ **Disconnect safely** with a leave button  

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, React Router
- **Backend:** Node.js, Express, Socket.io
- **WebRTC** for video calling

---

## 📌 Installation & Setup

### 🔹 1. Clone the Repository
```sh
git clone https://github.com/your-username/video-calling-app.git
cd video-calling-app
```

### 🔹 2. Install Dependencies
```sh
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 🔹 3. Run the Application
```sh
# Start the backend server
cd server
node index.js

# Start the frontend
cd ../client
npm run dev
```

Now, open `http://localhost:5173` in your browser. 🎉

---

## 📸 Screenshots

| Create Room | Video Call | Chat |
|-------------|-----------|------|
| ![Create Room](screenshots/create-room.png) | ![Video Call](screenshots/video-call.png) | ![Chat](screenshots/chat.png) |

---

## 🏗️ Folder Structure
```bash
video-calling-app/
├── client/            # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── server/            # Backend (Node.js & Express)
│   ├── index.js
│   ├── socket.js
│   ├── package.json
│   ├── config/
│   └── ...
│
└── README.md
```

---

## 🌍 Deployment
You can deploy this app on:
- **Frontend:** Vercel, Netlify
- **Backend:** Render, Railway, Heroku

### Deploy on Vercel (Frontend)
```sh
cd client
vercel deploy
```

### Deploy on Render (Backend)
```sh
cd server
git push origin main
```

---

## ✨ Contributing
Contributions are welcome! Feel free to fork this repo and submit a pull request. 😊

---

## 🛡️ License
This project is **open-source** and available under the [MIT License](LICENSE).

