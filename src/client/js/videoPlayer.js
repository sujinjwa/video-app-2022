const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");

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

  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }

  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volume.value = video.muted ? 0 : volumeValue; // mute가 해제될 때 0.5가 아닌 volumeValue로 비디오 볼륨 설정
};

const handleVolumeChange = (event) => {
  // video.volume = volumeRange.value;
  const {
    target: { value },
  } = event;

  if (video.volume > 0) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  // else {
  //   video.muted = true;
  //   muteBtn.innerText = "Unmute";
  // }

  volumeValue = value; // 볼륨 range 바뀔때마다 volumeValue도 그 값으로 변경
  video.volume = value;
};

// Date() 함수를 이용해 비디오의 currentTime과 totalTime의 포맷을 "00:00"으로 바꿔주는 함수
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetaData = () => {
  // console.log(event);
  // totalTime.innerText = Math.floor(video.duration); // 비디오의 전체 길이
  totalTime.innerText = formatTime(Math.floor(video.duration));

  // timeline의 maximum value 설정해주기
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime)); // 비디오의 현재 재생 시간
  timeline.value = Math.floor(video.currentTime);
};

// timeline의 value값이 변할 때마다 비디오 시간도 변경되도록 하는 함수
const handleTimelineChange = () => {
  video.currentTime = timeline.value;
};

// 비디오 full-screen mode 사용 or 사용하지 않도록 설정
const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement; // 화면이 full screen 상태인지 아닌지 확인

  // 풀스크린 상태가 아닌 경우
  if (!fullscreen) {
    videoContainer.requestFullscreen(); // 주의할 점! video 요소말고, 모든 기본 버튼까지 포함된 videoContainer에 적용해줘야 함
    fullScreenBtn.innerText = "Exit Full Screen";
  } else {
    // 풀스크린 상태인 경우
    document.exitFullscreen(); // 풀 스크린 모드 해제
    fullScreenBtn.innerText = "Enter Full Screen";
  }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
