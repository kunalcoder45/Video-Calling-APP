import { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const ScheduleEvent = () => {
    const [eventData, setEventData] = useState({
        title: "",
        startDate: "",
        endDate: "",
        details: "",
        location: "",
    });

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const formatDate = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return "";
        return parsedDate.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const start = formatDate(eventData.startDate);
    const end = formatDate(eventData.endDate);

    const googleCalendarUrl =
        start && end
            ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                eventData.title
            )}&dates=${start}/${end}&details=${encodeURIComponent(
                eventData.details
            )}&location=${encodeURIComponent(eventData.location)}`
            : "";

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
            <div className="flex">
                <Link to='/' className='mr-2 text-2xl mt-1 cursor-pointer'><IoHomeOutline /></Link>
                <h1 className="text-2xl mb-4">Schedule a Meeting</h1>
            </div>

            <div className="flex flex-col space-y-3 w-full max-w-md">
                <input
                    type="text"
                    name="title"
                    placeholder="Meeting Title"
                    value={eventData.title}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 text-white w-full"
                />
                <input
                    type="datetime-local"
                    name="startDate"
                    value={eventData.startDate}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 text-white w-full"
                />
                <input
                    type="datetime-local"
                    name="endDate"
                    value={eventData.endDate}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 text-white w-full"
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Meeting Location (Google Meet, Zoom, etc.)"
                    value={eventData.location}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 text-white w-full"
                />
                <textarea
                    name="details"
                    placeholder="Meeting Details"
                    value={eventData.details}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 text-white w-full h-24"
                />
            </div>

            <div className="mt-4">
                {googleCalendarUrl ? (
                    <a
                        href={googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Add to Google Calendar
                    </a>
                ) : (
                    <p className="text-red-500 mt-2">Please enter valid dates.</p>
                )}
            </div>
        </div>
    );
};

export default ScheduleEvent;
