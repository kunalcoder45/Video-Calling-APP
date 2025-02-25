import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import notesRoutes from "./routes/routes.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Notes API Routes
app.use("/notes", notesRoutes);

// WebSocket Server for Video Call
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const rooms = {};

// Generate a unique 6-character room code
const generateRoomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("createRoom", (data, callback) => {  
        const roomCode = generateRoomCode();
        rooms[roomCode] = [{ id: socket.id, username: data.username }]; // Add creator to room
        socket.join(roomCode);
        console.log(`Room Created: ${roomCode} by ${data.username}`);
        callback?.({ roomCode });
    });
    

    socket.on("joinRoom", ({ username, roomCode }, callback) => {
        console.log(`User ${username} trying to join room ${roomCode}`);
        console.log("Existing rooms:", rooms); // Debugging log
    
        if (!rooms[roomCode]) {
            console.log(`Room ${roomCode} not found!`);
            return callback?.({ error: "Invalid room code! Room does not exist." });
        }
    
        const userExists = rooms[roomCode].some(user => user.username === username);
        if (userExists) return callback?.({ error: "Username already taken in this room!" });
    
        rooms[roomCode].push({ id: socket.id, username });
        socket.join(roomCode);
    
        console.log(`${username} joined room ${roomCode}`);
        callback?.({ success: true, username, roomCode });
    
        socket.emit("roomJoined", { username, roomCode });
        socket.to(roomCode).emit("userJoined", { username, id: socket.id });
    });
    

    socket.on("sendMessage", ({ roomCode, messageData }) => {
        console.log(`${messageData.username} sent message in room ${roomCode}: ${messageData.text}`);
        socket.to(roomCode).emit("receiveMessage", messageData);
    });

    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incoming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, answer }) => {
        io.to(to).emit("call:accepted", { answer });
    });

    socket.on("disconnect", () => {
        let roomToDelete = null;
        Object.keys(rooms).forEach((roomCode) => {
            rooms[roomCode] = rooms[roomCode].filter(user => user.id !== socket.id);
            if (rooms[roomCode].length === 0) roomToDelete = roomCode;
        });

        if (roomToDelete) delete rooms[roomToDelete];

        console.log(`User disconnected: ${socket.id}`);
    });
});

app.get("/", (req, res) => {
    res.send("Server Running: Notes API + Video Call WebSocket");
});

// Start the server on port 3000
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
