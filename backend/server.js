const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// 🔌 SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// 🚜 Rover State
let roverState = {
  x: 0,
  y: 0,
  direction: "STOP",
  battery: 100
};

io.on("connection", (socket) => {
  console.log("Rover Control Connected:", socket.id);

  // send initial state
  socket.emit("rover-update", roverState);

  // movement control
  socket.on("move-rover", (dir) => {

    roverState.direction = dir;

    if (dir === "UP") roverState.y += 1;
    if (dir === "DOWN") roverState.y -= 1;
    if (dir === "LEFT") roverState.x -= 1;
    if (dir === "RIGHT") roverState.x += 1;

    // battery drain simulation
    roverState.battery -= 1;

    io.emit("rover-update", roverState);
  });

});

app.get("/", (req, res) => {
  res.send("🚜 BIAGRO Rover Server Running");
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});