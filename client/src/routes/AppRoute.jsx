// import { Routes, Route } from "react-router-dom";
// import Home from "../components/ui/home.jsx";
// import Navbar from "../components/ui/navbar.jsx";
// import NewMetting from "../components/newMetting/newMetting.jsx";
// import JoinMetting from "../components/joinMetting/joinMetting.jsx"
// import Room from "../components/room/room.jsx";

// export default function AppRoutes() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <>
//               <Navbar />
//               <Home />
//             </>
//           }
//         />,
//         <Route
//           path="/new-metting"
//           element={
//             <>
//               <Navbar />
//               <NewMetting />
//             </>
//           }
//         />,
//         <Route
//           path="/join-metting"
//           element={
//             <>
//               <Navbar />
//               <JoinMetting />
//             </>
//           }
//         />,
//         <Route
//           path="/schedule"
//           element={
//             <>
//               <Navbar />
//             </>
//           }
//         />,
//         <Route
//           path="/notes"
//           element={
//             <>
//               <Navbar />
//             </>
//           }
//         />
//         <Route
//           path="/room/:roomCode"
//           element={
//             <>
//               <Room />
//             </>
//           }
//         />
//       </Routes>
//     </>
//   );
// }


import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../components/ui/home.jsx";
import Navbar from "../components/ui/navbar.jsx";
import NewMetting from "../components/newMetting/newMetting.jsx";
import JoinMetting from "../components/joinMetting/joinMetting.jsx";
import Room from "../components/room/room.jsx";

export default function AppRoutes() {
  const location = useLocation();
  const hideNavbarRoutes = ["/room", "/new-metting"]; // Yaha specify karo jaha navbar nahi chahiye
  const shouldShowNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-metting" element={<NewMetting />} />
        <Route path="/join-metting" element={<JoinMetting />} />
        <Route path="/schedule" element={<></>} />
        <Route path="/notes" element={<></>} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </>
  );
}
