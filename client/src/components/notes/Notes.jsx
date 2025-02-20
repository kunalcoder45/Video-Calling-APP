import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdEditNote } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { CiSaveDown1 } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch Notes from Backend
  useEffect(() => {
    const fetchNotes = async () => {
      const res = await axios.get("http://localhost:3000/notes");
      setNotes(res.data);
    };
    fetchNotes();
  }, []);

  // Add a new note
  const addNote = async () => {
    if (!newNote.trim()) return;
    const res = await axios.post("http://localhost:3000/notes", { text: newNote });
    setNotes([...notes, res.data]);
    setNewNote("");
  };

  // Delete a note
  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:3000/notes/${id}`);
    setNotes(notes.filter((note) => note._id !== id));
  };

  // Edit a note
  const editNote = async (id) => {
    if (!editText.trim()) return;
    const res = await axios.put(`http://localhost:3000/notes/${id}`, { text: editText });
    setNotes(notes.map((note) => (note._id === id ? res.data : note)));
    setEditingNote(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-2xl bg-black text-green-400 font-mono rounded-lg shadow-lg p-4 border-2 border-gray-700">
        {/* Header */}
        <div className="flex items-center bg-gray-800 p-2 rounded-t-lg">
          <div className="w-3 h-3 bg-red-500 rounded-full mx-1"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full mx-1"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full mx-1"></div>
          <span className="ml-4 text-gray-400 text-sm">notes-terminal</span>
          <Link className="ml-4 text-gray-400 text-sm hover:text-green-400" to="/"><IoHomeOutline /></Link>
        </div>

        {/* Notes List */}
        <div className="p-4 min-h-[300px] max-h-[400px] overflow-auto">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note._id} className="flex justify-between items-center text-green-300 mb-2">
                {editingNote === note._id ? (
                  <input
                    type="text"
                    className="bg-gray-800 text-green-400 border border-gray-700 px-2 py-1 rounded outline-none"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                ) : (
                  <p>➜ {note.text}</p>
                )}

                <div className="flex space-x-2">
                  {editingNote === note._id ? (
                    <button
                      onClick={() => editNote(note._id)}
                      className="bg-blue-500 p-2 text-sm rounded-full text-white"
                    >
                      <CiSaveDown1 />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingNote(note._id);
                        setEditText(note.text);
                      }}
                      className="bg-yellow-500 p-2 text-sm rounded-full text-white"
                    >
                      <MdEditNote />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="bg-red-500 p-2 text-sm rounded-full text-white"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notes found...</p>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-3 flex">
          <span className="text-green-300">➜</span>
          <input
            type="text"
            className="bg-transparent text-green-400 w-full outline-none ml-2"
            placeholder="Write a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addNote()}
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;
