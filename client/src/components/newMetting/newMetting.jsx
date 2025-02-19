import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";

const NewMeeting = () => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const socket = useSocket();

    const createRoom = () => {
        setError("");

        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        localStorage.setItem("username", username); // ✅ Store username for later use

        // ✅ Fix: Use callback properly to get roomCode
        socket.emit("createRoom", {}, (data) => {
            if (data?.roomCode) {
                navigate(`/room/${data.roomCode}`);
            } else {
                setError("Failed to create meeting. Try again.");
            }
        });
        
    };

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900">
            <h1 className="text-white text-2xl mb-4">Enter Your Username</h1>

            {error && <p className="text-red-500">{error}</p>}

            <input
                type="text"
                className="w-96 h-12 rounded-full border-2 border-gray-300 px-4 focus:outline-none focus:border-blue-500 mb-4"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <button
                onClick={createRoom}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg"
            >
                Create Meeting
            </button>
        </div>
    );
};

export default NewMeeting;
