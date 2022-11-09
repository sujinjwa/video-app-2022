const form = document.querySelector('#commentForm');
const videoContainer = document.getElementById('videoContainer');

const handleSubmit = async (event) => {
  const textarea = form.querySelector('textarea');
  event.preventDefault();

  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === '') {
    return;
  }
  await fetch(`/api/videos/${videoId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: text, rating: '5' }),
  });

  textarea.value = '';
  window.location.reload();
};

form.addEventListener('submit', handleSubmit);
