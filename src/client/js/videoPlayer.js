const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

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

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
