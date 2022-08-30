import http from 'http';
import WebSocket from 'ws';
import express, { application } from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log('hello');

const server = http.createServer(app); // http 서버
const wss = new WebSocket.Server({ server }); // WebSocket 서버

const sockets = [];

wss.on('connection', (socket) => {
  sockets.push(socket);
  socket['nickname'] = '없음';
  console.log('클라이언트 / 브라우저와 연결 🌟');
  socket.send('hi!!!');
  socket.on('close', () =>
    console.log('클라이언트 / 브라우저로부터 연결이 끊김🔥')
  );
  socket.on('message', (msg) => {
    const message = JSON.parse(msg.toString());
    switch (message.type) {
      case 'newMessage': {
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      }
      case 'nickname':
        {
          console.log(message.payload);
          socket['nickname'] = message.payload;
        }
        break;
    }
  });
});

server.listen(3000, handleListen);
