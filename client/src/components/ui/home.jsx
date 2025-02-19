import { LuVideo } from "react-icons/lu";
import { CiCirclePlus } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { FaRegNoteSticky } from "react-icons/fa6";
import { Link } from "react-router-dom";

const home = () => {
  return (
    <div>
      <div className="w-full h-full flex">
        <div className="w-1/2 h-screen flex flex-col justify-center items-center text-white">
          <div className="flex gap-3 mb-3">
            <Link to="/new-metting" className="flex flex-col justify-center items-center gap-2">
              <div className="flex justify-center items-center w-24 h-24 bg-orange-400 rounded-lg cursor-pointer">
                <LuVideo className="w-10 h-10" />
              </div>
              <p>New Metting</p>
            </Link>
            <Link to="/join-metting" className="flex flex-col justify-center items-center gap-2">
              <div className="flex justify-center items-center w-24 h-24 bg-blue-400 rounded-lg cursor-pointer">
                <CiCirclePlus className="w-10 h-10" />
              </div>
              <p>Join Metting</p>
            </Link>
          </div>
          <div className="flex gap-3">
            <Link to="/schedule" className="flex flex-col justify-center items-center gap-2">
              <div className="flex justify-center items-center w-24 h-24 bg-blue-400 rounded-lg cursor-pointer">
                <SlCalender className="w-10 h-10" />
              </div>
              <p>Schedule</p>
            </Link>
            <Link to="/notes" className="flex flex-col justify-center items-center gap-2">
              <div className="flex justify-center items-center w-24 h-24 bg-blue-400 rounded-lg cursor-pointer">
                <FaRegNoteSticky className="w-10 h-10" />
              </div>
              <p>Notes</p>
            </Link>
          </div>
        </div>
        <div className="w-1/2 h-screen flex justify-center items-center z-170 pointer-events-none">
          <div className="pointer-events-auto">
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&title=Chationix"
              style={{ border: "solid 1px #777" }}
              width="400"
              height="350"
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  )
}

export default home