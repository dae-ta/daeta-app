import {io} from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
export const socketUrl = 'ws://localhost:3030';

export const socket = io(`${socketUrl}/chat`, {
  transports: ['websocket'],
});
