import http from 'http';
import SocketIO from 'socket.io';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log('hello');

//
const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

io.on('connection', (socket) => {
  socket['nickname'] = '익명';
  socket.onAny((e) => {
    console.log(`소켓이벤트: ${e}`);
  });
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit('웰컴', socket.nickname);
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('바이', socket.nickname)
    );
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
});

// wss.on('connection', (socket) => {
//   sockets.push(socket);
//   socket['nickname'] = '없음';
//   console.log('클라이언트 / 브라우저와 연결 🌟');
//   socket.send('hi!!!');
//   socket.on('close', () =>
//     console.log('클라이언트 / 브라우저로부터 연결이 끊김🔥')
//   );
//   socket.on('message', (msg) => {
//     const message = JSON.parse(msg.toString());
//     switch (message.type) {
//       case 'newMessage': {
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         );
//         break;
//       }
//       case 'nickname':
//         {
//           console.log(message.payload);
//           socket['nickname'] = message.payload;
//         }
//         break;
//     }
//   });
// });

httpServer.listen(3000, handleListen);
