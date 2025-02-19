import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const rooms = {}; // Store rooms and users

// Generate a unique 6-character room code
const generateRoomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Create a new room and return the room code
    socket.on("createRoom", (data, callback) => {  
        const roomCode = generateRoomCode();
        rooms[roomCode] = [];  // ✅ Room ko store karo
    
        console.log(`Room Created: ${roomCode}`);
        
        if (callback) callback({ roomCode });
    });
    
    

    socket.on("joinRoom", ({ username, roomCode }, callback) => {
        if (!rooms[roomCode]) {
            return callback?.({ error: "Invalid room code! Room does not exist." });
        }
    
        const userExists = rooms[roomCode].some(user => user.username === username);
        if (userExists) {
            return callback?.({ error: "Username already taken in this room!" });
        }
    
        rooms[roomCode].push({ id: socket.id, username });
        socket.join(roomCode);
    
        console.log(`${username} joined room ${roomCode}`);
    
        callback?.({ success: true, username, roomCode }); // ✅ Always call callback
    
        // Notify the user who joined
        socket.emit("roomJoined", { username, roomCode });
    
        // Notify other users in the room
        socket.to(roomCode).emit("userJoined", { username, id: socket.id });
    });
    

    socket.on("sendMessage", ({ roomCode, messageData }) => {
        console.log(`${messageData.username} sent message in room ${roomCode}: ${messageData.text}`);
        
        // ✅ Only broadcast to others, not the sender
        socket.to(roomCode).emit("receiveMessage", messageData);
    });
    

    // Handle WebRTC call offer
    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incoming:call", { from: socket.id, offer });
    });

    // Handle WebRTC call answer
    socket.on("call:accepted", ({ to, answer }) => {
        io.to(to).emit("call:accepted", { answer });
    });

    // Handle user disconnect
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
    res.send("Video Call Server Running");
});

server.listen(3000, () => console.log("Server running on port 3000"));
