import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 80 }, // String 도 가능
  videoUrl: { type: String, required: true },
  description: { type: String, required: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now }, // 자동 생성 가능
  hashtags: [{ type: String, trim: true }], // String형 원소 가지는 array
  meta: {
    // 자동 생성 가능
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) => (word.startsWith("#") ? word : `#${word}`));
//   this.title = "hello";
//   console.log(this);
// });

// video model 생성
const Video = mongoose.model("Video", videoSchema);
export default Video;
