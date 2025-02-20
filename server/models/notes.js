import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  roomCode: { type: String },
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
