import { useState, useCallback, useEffect } from "react";
import { useSocket } from "../../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const JoinMeeting = () => {
    const [roomCode, setRoomCode] = useState("");
    const [username, setUserName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const socket = useSocket();

    /** Handle Form Submission */
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setError("");
    
        if (!username.trim() || !roomCode.trim()) {
            setError("Both fields are required.");
            return;
        }
    
        localStorage.setItem("username", username); // ✅ Store username
    
        if (socket) {
            socket.emit("joinRoom", { username, roomCode }, (response) => {
                if (response.error) {
                    setError(response.error); // ❌ Room not found or username taken
                    return;
                }
    
                console.log("✅ Room joined successfully:", response.username, response.roomCode);
                navigate(`/room/${response.roomCode}`);
            });
        }
    }, [username, roomCode, socket, navigate]);
    
    

    /** Handle Room Join Event */
    const handleJoin = useCallback((data) => {
        console.log("User Joined:", data.username, "Room:", data.roomCode);
        navigate(`/room/${data.roomCode}`);
    }, [navigate]);

    /** Listen for Room Join Event */
    useEffect(() => {
        if (!socket) return;

        socket.on("roomJoined", (data) => {
            console.log("✅ User Joined:", data.username, "Room:", data.roomCode);
            navigate(`/room/${data.roomCode}`);
        });

        return () => {
            socket.off("roomJoined");
        };
    }, [socket, navigate]);



    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-900">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-gray-800 text-center">
                    Enter Username and Room Code
                </h1>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <input
                    type="text"
                    placeholder="Enter Username"
                    className="w-96 h-12 rounded-full border-2 border-gray-300 px-4 focus:outline-none focus:border-blue-500"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter Room Code"
                    className="w-96 h-12 rounded-full border-2 border-gray-300 px-4 focus:outline-none focus:border-blue-500"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-96 h-12 bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600 transition-all"
                >
                    Join
                </button>
            </form>
        </div>
    );
}

export default JoinMeeting;
