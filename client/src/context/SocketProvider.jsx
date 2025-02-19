import { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null); // FIXED: use correct variable name

export const useSocket = () => {
    return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io("http://localhost:3000", { transports: ["websocket"] }), []);

    return (
        <SocketContext.Provider value={socket}>  {/* FIXED: Pass socket instead of null */}
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
