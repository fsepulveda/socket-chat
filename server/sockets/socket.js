const { io } = require("../server");

io.on("connection", client => {
  console.log("User connected");

  client.emit("sendMessage", {
    user: "ADMIN",
    message: "Welcome to application"
  });

  client.on("disconnect", () => {
    console.log("User disconnected");
  });

  client.on("sendMessage", (data, callback) => {
    console.log("🚀 ~ file: socket.js ~ line 16 ~ client.on ~ data", data);

    client.broadcast.emit("sendMessage", data);
  });
});
