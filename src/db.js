import mongoose from "mongoose";

console.log(process.env.COOKIE_SECRET);
console.log(process.env.DB_URL);
// mongoose가 db에 연결되는 connection에 대한 액세스 줌
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
});

// 우리 서버와 db connection에 대한 액세스 줌
const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("💢 DB Error", error);

// error 발생시 발생할 event
db.on("error", handleError);
db.once("open", handleOpen);
// connection 열린다: 우리가 database에 연결된다
