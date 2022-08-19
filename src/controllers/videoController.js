import { Exception } from "sass";
import Video from "../models/Video";
import User from "../models/User";

const handleSearch = (error, videos) => {
  console.log("errors: ", error);
  console.log("videos: ", videos);
};

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }); // home 화면에 보여줄 videos 찾기
  // console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};

export const getEdit = async (req, res) => {
  // form을 화면에 보여주는 함수
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  // 변경 사항 저장해주는 함수
  const { id } = req.params;
  const video = await Video.exists({ _id: id }); // object의 id가 req.params의 id와 같은 경우인지 확인 : true or false 받음
  // console.log(video);
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
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
  console.log(video);
  // const owner = await User.findById(video.owner); // 비디오의 owner 통해 업로드한 유저 찾기
  if (!video) {
    // (!video) 도 가능
    // 존재하지 않는 video에 접근한 경우
    return res.render("404", { pageTitle: "Video Not Found" });
  }
  // video 존재하는 경우
  console.log(video);
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
    await Video.create({
      title: title,
      description: description,
      videoUrl,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
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
  //const video = await Video.findById(id);
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
