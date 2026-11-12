const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

app.use(cors({
  origin:[ "http://localhost:5173", "http://localhost:5174" ],
  credentials: true
}));
const PORT = 5000;
const http = require("http");
const { Server } = require("socket.io");
const { Socket } = require("dgram");

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

const S_LRoute = require("./routes/S&LRoute");
const roomRoute = require("./routes/roomRoute");
const mRoute = require("./routes/mRoutes");
const authMiddleWare = require("./middleWare/httpAuth");
const socketAuth = require("./middleWare/socketIoAuth");
const mongoDbUrl = "mongodb://localhost:27017/Chat";


app.use("/api", S_LRoute);
app.use(authMiddleWare); // Apply the auth middleware to all routes below this line
app.use("/api", roomRoute);
app.use("/api", mRoute);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:[ "http://localhost:5173", "http://localhost:5174" ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(socketAuth);

const array = [1, 34, 5, 5, 6];
require("./socket/socket")(io);

async function start() {
  try {
    await mongoose.connect(mongoDbUrl);
    await server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
