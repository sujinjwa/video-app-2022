const form = document.querySelector('#commentForm');
const videoContainer = document.getElementById('videoContainer');

const addComment = (text) => {
  const commentList = document.querySelector('.video__comments ul');
  const newComment = document.createElement('li');
  // 댓글 아이콘 만들기
  const icon = document.createElement('i');
  icon.className = 'fas fa-comment';
  // 새로운 span element에 text 내용 추가하기
  const span = document.createElement('span');
  span.innerText = ` ${text}`;
  // 새로운 li element에 위의 icon과 span 추가하기
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.className = 'video__comment';
  // ul 태그 하위요소로 li 넣기
  // commentList.insertAdjacentHTML('afterbegin', newComment);
  // commentList.appendChild(newComment);
  commentList.prepend(newComment);
};

const handleSubmit = async (event) => {
  const textarea = form.querySelector('textarea');
  event.preventDefault();

  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === '') {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: text, rating: '5' }),
  });
  textarea.value = '';
  //window.location.reload();

  if (status === 200) {
    addComment(text);
  }
};

form.addEventListener('submit', handleSubmit);
