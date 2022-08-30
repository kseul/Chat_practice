const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
  console.log('서버와 연결 💫');
});

socket.addEventListener('message', (message) => {
  console.log('서버로부터 받은 메세지 📝 ', message.data);
});

socket.addEventListener('close', () => {
  console.log('서버로부터 연결 끊김 🔥');
});

setTimeout(() => {
  socket.send('브라우저에서 메세지 보내기!');
}, 5000);
