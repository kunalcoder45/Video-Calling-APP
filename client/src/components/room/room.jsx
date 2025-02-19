// import { useEffect, useCallback, useState, useRef } from "react";
// import { useSocket } from "../../context/SocketProvider";
// import Peer from "../../services/peer.js";

// const Room = () => {
//     const socket = useSocket();
//     const [username, setUsername] = useState("");
//     const [remoteSocketId, setRemoteSocketId] = useState(null);
//     const [myStream, setMyStream] = useState(null);
//     const [isCalling, setIsCalling] = useState(false);
//     const myVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);

//     /** ✅ Request Media Permissions & Set Stream */
//     const getUserMediaStream = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             setMyStream(stream);

//             // Wait for the component to render
//             setTimeout(() => {
//                 if (myVideoRef.current) {
//                     myVideoRef.current.srcObject = stream;
//                 } else {
//                     console.error("myVideoRef is null after timeout!");
//                 }
//             }, 100);

//             return stream;
//         } catch (error) {
//             console.error("Error accessing media devices:", error);
//             alert("Please allow camera & microphone access.");
//         }
//     };

//     /** ✅ Handle User Join */
//     const handleUserJoin = useCallback(({ username, id }) => {
//         console.log(`${username} joined the room`);
//         setRemoteSocketId(id);
//     }, []);

//     /** ✅ Handle Incoming Call */
//     /** ✅ Handle Incoming Call */
//     const handleIncomingCall = useCallback(async ({ from, offer }) => {
//         setRemoteSocketId(from);
//         try {
//             const stream = await getUserMediaStream();
//             Peer.addLocalStream(stream);

//             const answer = await Peer.getAnswer(offer);
//             socket.emit("call:accepted", { to: from, answer });

//             // ✅ Jab remote stream aaye toh usko remote video me set karo
//             Peer.onRemoteStream((remoteStream) => {
//                 console.log("Setting remote stream...");
//                 if (remoteVideoRef.current) {
//                     remoteVideoRef.current.srcObject = remoteStream;
//                 } else {
//                     console.error("remoteVideoRef is null!");
//                 }
//             });

//         } catch (error) {
//             console.error("Error handling incoming call:", error);
//         }
//     }, [socket]);


//     /** ✅ Handle Call Accepted */
//     const handleCallAccepted = useCallback(async ({ answer }) => {
//         await Peer.setRemoteDescription(answer);
//         console.log("Call accepted!");
//     }, []);

//     /** ✅ Handle Calling a User */
//     const handleCallUser = useCallback(async () => {
//         try {
//             const stream = await getUserMediaStream();
//             Peer.addLocalStream(stream);

//             const offer = await Peer.getOffer();
//             socket.emit("user:call", { to: remoteSocketId, offer });

//             // ✅ Remote stream ko set karo jab mile
//             Peer.onRemoteStream((remoteStream) => {
//                 console.log("Remote stream received in caller");
//                 if (remoteVideoRef.current) {
//                     remoteVideoRef.current.srcObject = remoteStream;
//                 } else {
//                     console.error("remoteVideoRef is null!");
//                 }
//             });

//             setIsCalling(true);
//         } catch (error) {
//             console.error("Error accessing media devices:", error);
//         }
//     }, [remoteSocketId, socket]);


//     useEffect(() => {
//         if (!socket) return;

//         const randomUsername = "User_" + Math.floor(Math.random() * 1000);
//         setUsername(randomUsername);

//         const roomCode = "room1";
//         socket.emit("joinRoom", { username: randomUsername, roomCode });

//         socket.on("userJoined", handleUserJoin);
//         socket.on("incoming:call", handleIncomingCall);
//         socket.on("call:accepted", handleCallAccepted);

//         console.log("Event listeners set up.");

//         return () => {
//             socket.off("userJoined", handleUserJoin);
//             socket.off("incoming:call", handleIncomingCall);
//             socket.off("call:accepted", handleCallAccepted);
//         };
//     }, [socket, handleUserJoin, handleIncomingCall, handleCallAccepted]);

//     return (
//         <div className="text-white flex flex-col items-center justify-center h-screen">
//             <h1>Room Page</h1>
//             <h4>{remoteSocketId ? "Connected" : "Waiting for another user..."}</h4>

//             {remoteSocketId && !isCalling && (
//                 <div>
//                     <h4>Your friend is: {username}</h4>
//                     <button
//                         className="btn btn-outline-danger bg-blue-300"
//                         onClick={handleCallUser}
//                     >
//                         Call
//                     </button>
//                 </div>
//             )}

//             {myStream && (
//                 <div>
//                     <h1>My Stream</h1>
//                     <video ref={myVideoRef} autoPlay playsInline className="w-64 h-64 border border-white" />
//                 </div>
//             )}

//             <div>
//                 <h1>Remote Stream</h1>
//                 <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-64 border border-white" />
//             </div>
//         </div>
//     );
// };

// export default Room;


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSocket } from "../../context/SocketProvider";

// const Room = () => {
//     const { roomCode } = useParams(); // URL se room code le rahe hain
//     const socket = useSocket();
//     const [username, setUsername] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");

//     useEffect(() => {
//         const randomUsername = "User_" + Math.floor(Math.random() * 1000);
//         setUsername(randomUsername);

//         socket.emit("joinRoom", { username: randomUsername, roomCode });
//     }, [socket, roomCode]);

//     useEffect(() => {
//         socket.on("receiveMessage", (message) => {
//             setMessages((prevMessages) => [...prevMessages, message]);
//         });

//         return () => socket.off("receiveMessage"); // 🛠️ Cleanup event listener
//     }, [socket]);


//     const sendMessage = () => {
//         if (newMessage.trim() !== "") {
//             const messageData = { username, text: newMessage };
//             socket.emit("sendMessage", { roomCode, messageData });
//             setNewMessage("");  // 🛠️ Message clear after sending
//         }
//     };


//     return (
//         <div className="text-white flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
//             <h1 className="text-2xl font-bold">Room Code: {roomCode}</h1>
//             <h4 className="text-lg">Welcome, {username}!</h4>

//             <div className="w-full max-w-md mt-4 p-4 border border-gray-700 rounded-lg">
//                 <div className="messages-container">
//                     {messages.map((msg, index) => (
//                         <p key={index}><strong>{msg.username}:</strong> {msg.text}</p>
//                     ))}
//                 </div>

//                 <div className="flex mt-3">
//                     <input
//                         type="text"
//                         className="flex-1 p-2 rounded-l-md bg-gray-700 text-white"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder="Type a message..."
//                     />
//                     <button
//                         className="bg-blue-500 px-4 py-2 rounded-r-md"
//                         onClick={sendMessage}
//                     >
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Room;



import { ImPhoneHangUp } from "react-icons/im";
import { IoMdSend } from "react-icons/io";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";
import Peer from "../../services/peer.js";
import { Link } from "react-router-dom";

const Room = () => {
    const { roomCode } = useParams();
    const socket = useSocket();
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const myVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

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
        }
    };

    const handleUserJoin = useCallback(({ username, id }) => {
        console.log(`${username} joined the room`);
        setRemoteSocketId(id);
    }, []);

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketId(from);
        const stream = await getUserMediaStream();
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
        // const randomUsername = "User_" + Math.floor(Math.random() * 1000);
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
            <div className="w-2/3 flex flex-col items-center justify-center bg-gray-900 p-4">
                <h1 className="text-xl">Room Code: {roomCode}</h1>
                <div className="flex space-x-4">
                    <video ref={myVideoRef} autoPlay playsInline className="w-1/2 border border-white" />
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border border-white" />
                </div>
                <a className="mt-4 bg-red-500 p-4 rounded-full" href='/'><ImPhoneHangUp /></a>
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
                        className="flex-1 p-2 rounded-l-md bg-gray-700 text-white"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}  // ✅ Send message on Enter
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
