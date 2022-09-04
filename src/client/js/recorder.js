const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

// global 변수 선언
let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  // 링크 만들어주자
  const a = document.createElement("a");
  a.href = videoFile; // 해당 비디오 파일로 넘어가는 링크 생성
  a.download = "MyRecording"; // a 태그는 download 가지고 있음

  document.body.appendChild(a); // body에 접근해서 a 태그 추가
  a.click();
};

const handleStop = () => {
  startBtn.innerText = `Download Recording`;
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop(); // 녹화 종료
};

// 녹화 시작 버튼 클릭 시 발생하는 event
const handleStart = () => {
  startBtn.innerText = `Stop Recording`;
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    console.log(event.data);
    videoFile = URL.createObjectURL(event.data);
    // preview video를 금방 녹화한 recorder로 대체
    video.srcObject = null; // ??
    video.src = videoFile; // 금방 녹화된 비디오로 video.src 값 업데이트
    video.loop = true; // 녹화된 영상 무한반복재생
    video.play();
  };
  recorder.start(); // 녹화 시작
};

const init = async () => {
  // global 변수인 stream 값 업데이트
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false, // 소리는 가져오지 않도록 설정
    video: { width: 300, height: 240 },
  });
  video.srcObject = stream;
  video.play();
};

init(); // video preveiw는 upload url에 들어가자마자 보이게 설정

startBtn.addEventListener("click", handleStart);
