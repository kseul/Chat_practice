const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', { payload: input.value }, (msg) => {
    console.log('백엔드에서 보낸 메세지: ', msg);
  });
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);
