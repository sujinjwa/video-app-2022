import express from "express";
import {
  getEdit,
  postEdit,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";
import { publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
//userRouter
//  .route("/edit")
//  .get(protectorMiddleware, getEdit)
//  .post(protectorMiddleware, postEdit);
// 위 주석달린 버전처럼 get, post 모두에 middleware 넣는 방식 말고,
// 아래와 같이 .all() 을 통해 한번에 middleware 적용 가능!
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
//"/github/finish" 라는 uri는 github.com 웹사이트에서 "Authorization callback URL"에 해당하도록 만듦
userRouter.get("/:id", see); // 노마드는 슬래시 빼고 ":id" 라고 해놓음

export default userRouter;
