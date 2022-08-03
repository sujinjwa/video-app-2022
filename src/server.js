import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("assets"));

// router 앞에서 session 미들웨어 추가
app.use(
  session({
    secret: "Hello!", // secret: 아무도 모르는 문자열
    resave: true,
    saveUninitialized: true,
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
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
