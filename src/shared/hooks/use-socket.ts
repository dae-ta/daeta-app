import {useState} from 'react';
import io from 'socket.io-client';

export const socketUrl = 'ws://localhost:3030';

export const useSocket = () => {
  const [socket] = useState(
    io(`${socketUrl}/chat`, {
      transports: ['websocket'],
      autoConnect: false,
    }),
  );

  console.log(`user socketId: ${socket.id}`);

  return socket;
};
