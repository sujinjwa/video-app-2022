import express from "express";
// import multer from "multer";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
// const multer = require("multer");
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

// console.log(process.env.COOKIE_SECRET);
// router 앞에서 session 미들웨어 추가
app.use(
  session({
    secret: process.env.COOKIE_SECRET, // secret: 아무도 모르는 문자열
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

// cookie 확인하기 위한 미들웨어
// app.use((req, res, next) => {
//   console.log(req.headers);
//   next(); // 이게 뭐더라?
// });

// 쿠키의 텍스트 의미 이해하기 위한 미들웨어
// app.use((req, res, next) => {
//   // console.log(res);
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

// "/add-one" 이라는 url 접속 시 req.session.id 가 출력
// app.get("/add-one", (req, res, next) => {
//   req.session.potato += 1;
//   return res.send(`${req.session.id}\n${req.session.potato}`);
// });

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
