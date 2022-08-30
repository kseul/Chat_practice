const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function addMessage(msg) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = msg;
  ul.appendChild(li);
}

// 3. done()은 프론트엔드에 있는 showRoom()을 실행
function showRoom() {
  console.log('백엔드에서 호출');
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('웰컴', () => {
  addMessage('누군가 들어왔습니다!');
});

socket.on('바이', () => {
  addMessage('누군가 떠났습니다 ㅠㅠ...');
});
