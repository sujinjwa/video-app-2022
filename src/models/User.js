import bcrypt from "bcrypt";
import mongoose from "mongoose";

// schema 만들기 (아직 안 채움.)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: String,
});

userSchema.pre("save", async function () {
  // this := create되는 User 의미
  // 5번 해싱 (saltRounds)
  // 코랙 함수 필요 없음. await 쓰고 있으므로
  console.log("users password:", this.password);
  this.password = await bcrypt.hash(this.password, 5);
  console.log("hashed pasword:", this.password);
});

// mongo와 mongoose에 스키마 알려준 후
const User = mongoose.model("User", userSchema);

// static만들고 model을 export 하기
export default User;
