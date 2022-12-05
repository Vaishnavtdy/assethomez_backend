"use strict";


module.exports = async () => {
  var io = require('socket.io')(strapi.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      // allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.on('connection', function (socket) {
    strapi.socket = socket;
    console.log("user connected");

    socket.on("disconnect", (reason) => {
      console.log("user disconnect", reason);
    });

  });


  strapi.socketIO = io;
};

