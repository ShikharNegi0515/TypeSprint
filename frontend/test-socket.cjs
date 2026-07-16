const io = require('socket.io-client');
const socket = io('http://localhost:3000/rooms', { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('Connected! ID:', socket.id);
  socket.emit('room:join', {
    roomCode: '4AGZEP',
    userId: '916cb44a-7563-4614-af26-857182a92ac0',
    username: 'roomuser'
  });
});

socket.on('room:joined', (data) => {
  console.log('room:joined', data);
  process.exit(0);
});

socket.on('room:error', (err) => {
  console.error('room:error', err);
  process.exit(1);
});

socket.on('connect_error', (err) => {
  console.error('connect_error', err);
  process.exit(1);
});

setTimeout(() => {
  console.log('Timeout');
  process.exit(1);
}, 3000);
