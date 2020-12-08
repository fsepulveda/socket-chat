const params = new URLSearchParams(window.location.search);

const name = params.get("name");
const room = params.get("room");

const divUsuarios = $("#divUsuarios");
const formSend = $("#formSend");
const txtMessage = $("#txtMessage");
const divChatbox = $("#divChatbox");

function renderUsers(users) {
  let html = "";
  html += "<li>";
  html +=
    '   <a href="javascript:void(0)" class="active">Chat de <span> ' +
    params.get("room") +
    "</span></a>";
  html += "</li>";

  for (let index = 0; index < users.length; index++) {
    html += "<li>";
    html +=
      '    <a data-id="' +
      users[index].id +
      '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"/>';
    html +=
      "        <span>" +
      users[index].name +
      '<small class="text-success">online</small></span>';
    html += "    </a>";
    html += "</li>";
  }

  divUsuarios.html(html);
}

function renderMessages(data, me) {
  let html = "";
  const date = new Date(data.date);
  const hour = date.getHours() + ":" + date.getMinutes();

  let adminClass = "info";

  if (data.name === "Administrator") {
    adminClass = "danger";
  }

  if (me) {
    html += '<li class="reverse">';
    html += '                        <div class="chat-content">';
    html += "                          <h5>" + data.name + "</h5>";
    html += '<div class="box bg-light-inverse">' + data.message + "</div>";
    html += "                        </div>";
    html += '                        <div class="chat-img">';
    html += '<img src="assets/images/users/5.jpg" alt="user" />';
    html += "                        </div>";
    html += '                        <div class="chat-time">' + hour + "</div>";
    html += "                      </li>";
  } else {
    html += '<li class="animated fadeIn">';
    if (data.name !== "Administrator") {
      html += '  <div class="chat-img">';
      html += '    <img src="assets/images/users/1.jpg" alt="user" />';
      html += "  </div>";
    }
    html += '  <div class="chat-content">';
    html += "    <h5>" + data.name + "</h5>";
    html +=
      '    <div class="box bg-light-' +
      adminClass +
      '">' +
      data.message +
      "</div>";
    html += "  </div>";
    html += '  <div class="chat-time">' + hour + "</div>";
    html += "</li>";
  }

  divChatbox.append(html);
}

function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children("li:last-child");

  // heights
  var clientHeight = divChatbox.prop("clientHeight");
  var scrollTop = divChatbox.prop("scrollTop");
  var scrollHeight = divChatbox.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight);
  }
}

divUsuarios.on("click", "a", function () {
  const id = $(this).data("id");

  if (id) {
    console.log("🚀 ~ file: socket-chat-jquery.js ~ line 35 ~ id", id);
  }
});

formSend.on("submit", function (e) {
  e.preventDefault();
  console.log(txtMessage.val());

  if (txtMessage.val().trim().length === 0) {
    return;
  }

  socket.emit(
    "createMessage",
    { name, message: txtMessage.val() },
    function (message) {
      txtMessage.val("").focus();
      renderMessages(message, true);
      scrollBottom();
    }
  );
});
