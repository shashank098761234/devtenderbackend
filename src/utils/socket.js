const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetuserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetuserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const socket = require("socket.io");

  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetuserId, text }) => {
      const roomId = getSecretRoomId(userId, targetuserId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetuserId, newMessage }) => {
        //Save message to database
        try {
          const roomId = getSecretRoomId(userId, targetuserId);
          console.log(firstName + " " + newMessage);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetuserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetuserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            newMessage,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            newMessage,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
