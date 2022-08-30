const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener('open', () => {
  console.log('서버와 연결 💫');
});

socket.addEventListener('message', (message) => {
  console.log('서버로부터 받은 메세지 📝 ', message.data);
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener('close', () => {
  console.log('서버로부터 연결 끊김 🔥');
});

function handleSubmit(e) {
  e.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(makeMessage('newMessage', input.value));
  input.value = '';
}

function handleNickSubmit(e) {
  e.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
}

messageForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
