const socket = io();

// const params = new URLSearchParams(window.location.search);

if (!params.has("name") || !params.has("room")) {
  window.location = "index.html";
  throw new Error("Name and Room are required");
}

const user = {
  name: params.get("name"),
  room: params.get("room")
};

socket.on("connect", function () {
  console.log("Socket");

  socket.emit("inChat", user, function (response) {
    // console.log("Connected users", response);
    renderUsers(response);
  });
});

socket.on("disconnect", function () {
  console.log("Disconnect");
});

socket.emit("createMessage", { user: "John", message: "Hello, world" }, data =>
  console.log("Response:", data)
);

socket.on("createMessage", function (data) {
  console.log(data);
  renderMessages(data, false);
  scrollBottom();
});
socket.on("listUsers", function (users) {
  renderUsers(users);
});

// Provate messages
socket.on("privateMessage", function (message) {
  console.log(message);
});
