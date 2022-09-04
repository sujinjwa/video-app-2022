import { Exception } from "sass";
import Video from "../models/Video";
import User from "../models/User";

const handleSearch = (error, videos) => {
  console.log("errors: ", error);
  console.log("videos: ", videos);
};

export const home = async (req, res) => {
  // const allVideos = await Video.find({}).sort({ createdAt: "desc" }); // home 화면에 보여줄 videos 찾기
  // // console.log(videos);
  // const videos = [];

  // // populate 이용하여 모든 비디오에 user의 데이터도 함께 합쳐서 보내주기
  // for (var i = 0; i < allVideos.length; i++) {
  //   var video = await Video.findById(allVideos[i]._id).populate("owner");
  //   videos.push(video);
  // }

  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");

  // console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};

export const getEdit = async (req, res) => {
  // form을 화면에 보여주는 함수
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }

  if (String(video.owner) !== String(_id)) {
    // 현재 로그인한 유저가 해당 비디오를 업로드한 유저가 아닌 경우
    return res.status(403).redirect("/"); // 홈 화면으로 렌더링
  }
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  // 변경 사항 저장해주는 함수
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.exists({ _id: id }); // object의 id가 req.params의 id와 같은 경우인지 확인 : true or false 받음
  // console.log(video);
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  if (String(video.owner) !== String(_id)) {
    // 현재 로그인한 유저가 해당 비디오를 업로드한 유저가 아닌 경우
    return res.status(403).redirect("/"); // 홈 화면으로 렌더링
  }
  await Video.findByIdAndUpdate(id, {
    title: title, // 그냥 title만 입력해도 가능
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  // video.title = title;
  // video.description = description;
  // video.hashtags = hashtags
  //   .split(",")
  //   .map((word) => (word.startsWith("#") ? word : `#${word}`));
  // await video.save();
  // console.log(req.body);
  // console.log(title, description, hashtags);
  return res.redirect(`/videos/${id}`);
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: `Search`, videos });
};

export const watch = async (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner"); // req.params.id 통해 비디오 찾기
  // populate(relationship)을 통해 video의 owner 부분을 User의 id로 바꿔주기
  // console.log(video);
  // const owner = await User.findById(video.owner); // 비디오의 owner 통해 업로드한 유저 찾기
  if (!video) {
    // (!video) 도 가능
    // 존재하지 않는 video에 접근한 경우
    return res.render("404", { pageTitle: "Video Not Found" });
  }
  // video 존재하는 경우
  // console.log(video);
  return res.render("watch", { pageTitle: video.title, video });
};

export const getUpload = (req, res) => {
  // 비디오 업로드 컨트롤러
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { path: videoUrl } = req.file;
  const { title, description, hashtags } = req.body; // form 통해 사용자로부터 받은 data
  // 새로운 Video Model 생성
  try {
    const newVideo = await Video.create({
      title: title,
      description: description,
      videoUrl,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/"); // go home
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);

  if (!video) {
    // video가 존재하는지 확인
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if (String(video.owner) !== String(_id)) {
    // 로그인한 유저와 해당 비디오 업로드한 유저가 다른 경우
    return res.status(403).redirect("/");
  }
  //await video.delete();
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

// export const postDelete = async (req, res) => {
//   const { id } = req.params;
//   const video = await Video.findById(id);
//   await Video.delete(video);
//   console.log(video);
//   return res.redirect("/");
// };

export const registerView = async (req, res) => {
  const { id } = req.params; // URL로부터 id 가져오기
  // console.log(id);
  console.log(req.params);
  console.log(req.query);
  console.log(req.body);
  const video = await Video.findById(id);
  if (!video) {
    // 비디오 찾지 못한 경우
    return res.sendStatus(404);
  }
  // video가 존재할 경우 조회수 1 증가
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200); // ok 의미로 200 status code 전송
};
