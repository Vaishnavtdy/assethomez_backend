// import io from 'socket.io-client';
import io from 'socket.io-client'
let STRAPI_ENDPOINT;

if (process.env.NODE_ENV !== 'production') {
  STRAPI_ENDPOINT = 'http://localhost:1337';
} else {
  STRAPI_ENDPOINT = process.env.HOST
}


export const socket = new io(STRAPI_ENDPOINT);
