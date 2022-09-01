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

function publicRooms() {
  // const sids = io.sockets.adapter.sids;
  // const rooms = io.sockets.adapter.rooms;
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on('connection', (socket) => {
  socket['nickname'] = '익명';

  socket.onAny((e) => {
    console.log(io.sockets.adapter);
    console.log(`소켓이벤트: ${e}`);
  });

  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit('웰컴', socket.nickname, countRoom(roomName));
    io.sockets.emit('room_change', publicRooms());
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('바이', socket.nickname, countRoom(room) - 1)
    );
  });

  socket.on('disconnect', () => {
    io.sockets.emit('room_change', publicRooms());
  });

  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
});

httpServer.listen(3000, handleListen);
