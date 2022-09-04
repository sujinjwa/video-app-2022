const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline"); // range type의 input으로, 비디오의 현재 재생 정도 나타냄
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5; // 볼륨 기본 값으로 0.5 설정, 이때 volumeValue는 global 변수
video.volume = volumeValue; // video.volume에 기본값 적용

const handlePlayClick = () => {
  // if the video is playing, pause it
  // else play the video

  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }

  playBtn.childNodes[0].className = video.paused
    ? "fa-solid fa-play"
    : "fa-solid fa-pause";
};

const playVideoWithSpaceBar = (event) => {
  // 키보드에서 클릭한 게 '스페이스 바'인 경우에만
  // hadnlePlayClick 함수 실행
  if (event.code === "Space") {
    handlePlayClick();
  }
};

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }

  muteBtn.childNodes[0].className = video.muted
    ? "fa-solid fa-volume-xmark"
    : "fa-solid fa-volume-high";
  volume.value = video.muted ? 0 : volumeValue; // mute가 해제될 때 0.5가 아닌 volumeValue로 비디오 볼륨 설정
};

const handleVolumeChange = (event) => {
  // video.volume = volumeRange.value;
  const {
    target: { value },
  } = event;
  volumeValue = value; // 볼륨 range 바뀔때마다 volumeValue도 그 값으로 변경
  video.volume = value;

  // 아래 코드에서 아이콘 바꾸기 이전에 위 코드에서 volumeValue와 video.volume 값을 갱신해주어야
  // 아이콘과 video.muted 값이 제때 갱신됨
  if (video.volume > 0) {
    video.muted = false;
    muteBtn.childNodes[0].className = "fa-solid fa-volume-high";
  } else {
    video.muted = true;
    muteBtn.childNodes[0].className = "fa-solid fa-volume-xmark";
  }
};

// Date() 함수를 이용해 비디오의 currentTime과 totalTime의 포맷을 "00:00"으로 바꿔주는 함수
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

// video의 metadata인 totalTime 등의 값이 로드됐을 때 발생하는 이벤트로
// 해당 video의 duration 값 통해 totalTime의 innerText와 timeline.max 설정하는 함수
const handleLoadedMetaData = () => {
  // console.log(Math.floor(video.duration));
  // console.log(event);
  // totalTime.innerText = Math.floor(video.duration); // 비디오의 전체 길이
  totalTime.innerText = formatTime(Math.floor(video.duration)); // 비디오의 전체 길이 설정

  timeline.max = Math.floor(video.duration); // timeline의 maximum value 설정
};

// timeupdate event 통해 시간이 업데이트될 때마다 currentTime과 timeline 값 설정해주는 함수
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime)); // 비디오의 현재 재생 시간
  timeline.value = Math.floor(video.currentTime); // 비디오 재생 과정(timeline)
};

// timeline의 value값이 변할 때마다 비디오 시간도 변경되도록 하는 함수
const handleTimelineChange = () => {
  video.currentTime = timeline.value;
};

// 비디오 full-screen mode 사용 or 사용하지 않도록 설정
const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement; // 화면이 full screen 상태인지 아닌지 확인
  //const timeline = document.querySelector("input#timeline");
  // 풀스크린 상태가 아닌 경우
  if (!fullscreen) {
    videoContainer.requestFullscreen(); // 주의할 점! video 요소말고, 모든 기본 버튼까지 포함된 videoContainer에 적용해줘야 함
    //timeline.classList.add("fullscreen");
    // console.log(fullScreenBtn.childNodes);
  } else {
    // 풀스크린 상태인 경우
    document.exitFullscreen(); // 풀 스크린 모드 해제
  }

  fullScreenBtn.childNodes[1].className = fullscreen
    ? "fa-solid fa-expand"
    : "fa-solid fa-compress";
  //timeline.classList.remove("fullscreen");
};

// const exitFullScreen = (event) => {
//   console.log(event);
//   console.log(event.key === "Escape");
//   if (event.key === "Escape") {
//     document.exitFullscreen(); // 풀 스크린 모드 해제
//     video.classList.remove("fullscreen");
//     fullScreenBtn.childNodes[0].className = "fa-solid fa-expand";
//   }
// };

let controlsTimeout = null;
let controlsMovementTimeout = null;

const hideControls = () => videoControls.classList.remove("show");

const handleMouseMove = () => {
  if (controlsTimeout) {
    // mouseleave 후 timeout 완료되지 않았을 때 다시 마우스 돌아왔다면
    // timeout 취소 (clearrTimeout) 및 null로 초기화
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    // controlsMovementTimeout이 null이지 않을 때
    // 즉 마우스가 계속해서 움직이고 있다면?! 이 if문이 실행돼서
    // setTimeout으로 인해 3초 뒤 controls가 없어지지 않도록 clearTimeout 실행됨
    // 반면, 마우스가 움직임을 멈춘다면 이 if문은 실행되지 않음
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("show");
  controlsMovementTimeout = setTimeout(hideControls, 2000); // 마우스 움직일 시 setTimeout 재설정
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 2000);
  // mouseleave 시 2초 후 show class remove
  // console.log(controlsTimeout);
  // clearTimeout(id); // timeout이 취소됨
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;

  fetch(`/api/videos/${id}/view`, { method: "POST" }); // 비디오 재생 끝난 경우 해당 URL로 api POST 요청
};

playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("click", handlePlayClick);
window.addEventListener("keydown", playVideoWithSpaceBar, event);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

video.addEventListener("ended", handleEnded);
