import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {}; // || {} 추가
  // console.log(res.locals);
  // console.log(req.session.user);
  res.locals.isHeroku = isHeroku; // heroku 있는지 없는지 템플릿에서 확인 가능
  next();
  // console.log(res.locals.isHeroku);
};

export const protectorMiddleware = (req, res, next) => {
  // 로그인 돼있지 않은 유저는 로그인 페이지로 리디렉션
  if (req.session.loggedIn) {
    return next(); // 유저가 로그인된 경우 next() 함수 호출
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next(); // loggedIn 돼있지 않다면, next() 함수 호출
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/"); // 로그인된 유저라면 home 화면으로 리디렉션
  }
};

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube-sujin", // AWS bucket 이름 넣기
  Key: "images/",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetube-sujin", // AWS bucket 이름 넣기
  acl: "public-read",
});

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000, // 단위: bytes // 0여섯개
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000, // 0 일곱개
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});
