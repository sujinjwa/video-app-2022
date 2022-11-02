const form = document.querySelector("#commentForm");
const videoContainer = document.getElementById("videoContainer");

const handleSubmit = (event) => {
  const textarea = form.querySelector("textarea");
  event.preventDefault();

  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text, rating: "5" }),
  });
};

form.addEventListener("submit", handleSubmit);
