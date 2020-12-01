const socket = io();

socket.on("connect", function () {
  console.log("Socket");
});

socket.on("disconnect", function () {
  console.log("Disconnect");
});

socket.emit("sendMessage", { user: "John", message: "Hello, world" }, data =>
  console.log("Response:", data)
);

socket.on("sendMessage", function (data) {
  console.log(data);
});
