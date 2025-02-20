import { ImPhoneHangUp } from "react-icons/im";
import { IoMdSend } from "react-icons/io";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";
import Peer from "../../services/peer.js";
import axios from "axios";

const Room = () => {
    const { roomCode } = useParams();
    const socket = useSocket();
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const [notes, setNotes] = useState("");
    const [showNotes, setShowNotes] = useState(false);

    const myVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/notes/${roomCode}`);
                setNotes(data.notes || "");
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };
        fetchNotes();
    }, [roomCode]);

    const saveNotes = async () => {
        try {
            await axios.post("http://localhost:3000/notes", { roomCode, text: notes });
        } catch (error) {
            console.error("Error saving notes:", error);
        }
    };

    const getUserMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMyStream(stream);
            if (myVideoRef.current) {
                myVideoRef.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Please allow camera & microphone access.");
            return null;
        }
    };
    

    const handleUserJoin = useCallback(({ username, id }) => {
        console.log(`${username} joined the room`);
        setRemoteSocketId(id);
    }, []);

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketId(from);
        const stream = await getUserMediaStream();
        if (!stream) return; // Prevent undefined stream from being passed
        Peer.addLocalStream(stream);
        const answer = await Peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, answer });
    
        Peer.onRemoteStream((remoteStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
        });
    }, [socket]);
    

    const handleCallAccepted = useCallback(async ({ answer }) => {
        await Peer.setRemoteDescription(answer);
        console.log("Call accepted!");
    }, []);

    useEffect(() => {
        if (!socket) return;
        const randomUsername = username;
        setUsername(randomUsername);
        socket.emit("joinRoom", { username: randomUsername, roomCode });
        socket.on("userJoined", handleUserJoin);
        socket.on("incoming:call", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("receiveMessage", (message) => setMessages((prev) => [...prev, message]));
        return () => {
            socket.off("userJoined", handleUserJoin);
            socket.off("incoming:call", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
        };
    }, [socket, roomCode, handleUserJoin, handleIncomingCall, handleCallAccepted]);

    useEffect(() => {
        if (remoteSocketId) {
            (async () => {
                const stream = await getUserMediaStream();
                if (!stream) return; // Ensure stream exists before proceeding
                Peer.addLocalStream(stream);
                const offer = await Peer.getOffer();
                socket.emit("user:call", { to: remoteSocketId, offer });
    
                Peer.onRemoteStream((remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                });
            })();
        }
    }, [remoteSocketId, socket]);
    

    const sendMessage = () => {
        if (newMessage.trim()) {
            const messageData = { username, text: newMessage };
            socket.emit("sendMessage", { roomCode, messageData });
            setMessages((prev) => [...prev, messageData]);
            setNewMessage("");
        }
    };

    return (
        <div className="text-white flex h-screen">
            <div className="w-2/3 flex flex-col items-center justify-center bg-gray-900 p-4 relative">
                <h1 className="text-xl">Room Code: {roomCode}</h1>
                <div className="flex space-x-4">
                    <video ref={myVideoRef} autoPlay playsInline className="w-1/2 border border-white" />
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border border-white" />
                </div>
                <a className="mt-4 bg-red-500 p-4 rounded-full" href='/'><ImPhoneHangUp /></a>
                <button onClick={() => setShowNotes(!showNotes)} className="absolute bottom-4 left-4 bg-blue-500 px-4 py-2 rounded-md">Notes</button>
                {showNotes && (
                    <div className="absolute bottom-16 left-4 bg-gray-700 p-4 w-1/3 transition-transform transform animate-slide-up">
                        <h2 className="text-lg">Notes</h2>
                        <textarea
                            className="w-full p-2 bg-gray-600 text-white rounded-md"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Write your notes here..."
                        />
                        <button onClick={saveNotes} className="mt-2 bg-green-500 px-4 py-2 rounded-md">Save</button>
                    </div>
                )}
            </div>
            <div className="w-1/3 bg-gray-800 p-4 flex flex-col">
                <h2 className="text-lg">Chat</h2>
                <div className="flex-1 overflow-auto border p-2">
                    {messages.map((msg, index) => (
                        <p key={index}><strong>{msg.username}:</strong> {msg.text}</p>
                    ))}
                </div>
                <div className="flex mt-3">
                    <input
                        type="text"
                        className="flex-1 p-2 rounded-l-md bg-gray-700 text-white outline-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button className="bg-blue-500 px-4 py-2 rounded-r-md" onClick={sendMessage}>
                        <IoMdSend />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Room;






