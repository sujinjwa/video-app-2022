import express from "express";
import { registerView, createComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView); // form을 사용하지 않는 post 요청
apiRouter.post("/videos/:id([0-9a-f]{24})/comments", createComment);

export default apiRouter;
