import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// CORS Configuration
const io = new Server(server, {
    cors: {
        origin: "*", // Update this to match your frontend URL in production
        methods: ["GET", "POST"]
    }
});

// Store active rooms and users
const rooms = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    /** Handle User Joining a Room */
    socket.on("joinRoom", ({ username, roomCode }) => {
        // If room does not exist, create it
        if (!rooms[roomCode]) {
            rooms[roomCode] = [];
        }

        // Add user to the room
        rooms[roomCode].push({ id: socket.id, username });
        socket.join(roomCode);

        console.log(`${username} joined room: ${roomCode}`);

        // Notify the user that they joined successfully
        socket.emit("roomJoined", { username, roomCode });

        // Notify others in the room
        socket.to(roomCode).emit("userJoined", { username, roomCode, id: socket.id });

        // Log active users in the room (for debugging)
        console.log(`Users in room ${roomCode}:`, rooms[roomCode]);
    });

    /** Handle Incoming Call */
    socket.on("user:call", ({ to, offer }) => {
        // Emit the offer to the target user
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    /** Handle Call Accepted */
    socket.on("call:accepted", ({ to, answer }) => {
        // Emit the answer to the target user
        io.to(to).emit("call:accepted", { answer });
    });

    /** Handle User Disconnecting */
    socket.on("disconnect", () => {
        Object.keys(rooms).forEach((roomCode) => {
            // Remove the user from all rooms
            rooms[roomCode] = rooms[roomCode].filter(user => user.id !== socket.id);
            if (rooms[roomCode].length === 0) {
                // If the room is empty, delete it
                delete rooms[roomCode];
            }
        });

        console.log(`User disconnected: ${socket.id}`);
    });
});

// Basic API Endpoint
app.get("/", (req, res) => {
    res.send("Peer-to-Peer Meeting Backend Running...");
});

// Start Server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
