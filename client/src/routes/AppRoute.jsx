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


import { Routes, Route } from "react-router-dom";
import Home from "../components/ui/home.jsx";
import NewMetting from "../components/newMetting/newMetting.jsx";
import JoinMetting from "../components/joinMetting/joinMetting.jsx";
import Room from "../components/room/room.jsx";
import Notes from "../components/notes/Notes.jsx";
import ScheduleEvent from "../components/ScheduleEvent/ScheduleEvent .jsx";

export default function AppRoutes() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-metting" element={<NewMetting />} />
        <Route path="/join-metting" element={<JoinMetting />} />
        <Route path="/schedule" element={<ScheduleEvent />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="/notes" element={<Notes />}/>
      </Routes>
    </>
  );
}
