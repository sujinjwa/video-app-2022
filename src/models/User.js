import bcrypt from "bcrypt";
import mongoose from "mongoose";

// schema 만들기 (아직 안 채움.)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false }, // 유저가 깃헙으로 로그인했는지 여부 확인하기 위함
  // postLogin controller에서 유저가 로그인 하는 걸 체크할 때
  // socialOnly가 false인지 확인해서, false라면 유저와 password로만 로그인할 수 있는 유저이고,
  // true라면 password가 없다는 걸 확인해주어야 한다
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  location: String,
});

userSchema.pre("save", async function () {
  // this := create되는 User 의미
  // 5번 해싱 (saltRounds)
  // 코랙 함수 필요 없음. await 쓰고 있으므로
  // console.log("users password:", this.password);
  this.password = await bcrypt.hash(this.password, 5);
  // console.log("hashed pasword:", this.password);
});

// mongo와 mongoose에 스키마 알려준 후
const User = mongoose.model("User", userSchema);

// static만들고 model을 export 하기
export default User;
