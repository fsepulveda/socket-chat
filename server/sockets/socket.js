const { io } = require("../server");
const { Users } = require("../classes/users");
const { createMessage } = require("../utils/utils");

const users = new Users();

io.on("connection", client => {
  client.on("inChat", (user, callback) => {
    if (!user.name || !user.room) {
      return callback({
        error: true,
        message: `The name/room is required`
      });
    }

    client.join(user.room);

    const connectedUsers = users.addUser(client.id, user.name, user.room);

    client.broadcast
      .to(user.room)
      .emit("listUsers", users.getUsersByRoom(user.room));

    callback(connectedUsers);
  });

  client.on("createMessage", data => {
    const user = users.getUser(client.id);
    const message = createMessage(user.name, data.message);
    client.broadcast.to(user.room).emit("createMessage", message);
  });

  client.on("disconnect", () => {
    const removedUser = users.removeUser(client.id);

    client.broadcast
      .to(removedUser.room)
      .emit(
        "createMessage",
        createMessage("Administrator", `${removedUser.name} left`)
      );
    client.broadcast
      .to(removedUser.room)
      .emit("listUsers", users.getUsersByRoom(removedUser.room));
  });

  // Private messages
  client.on("privateMessage", data => {
    const user = users.getUser(client.id);

    client.broadcast
      .to(data.to)
      .emit("privateMessage", createMessage(user.name, data.message));
  });
});
