import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  // 댓글의 properties
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, requird: true, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
