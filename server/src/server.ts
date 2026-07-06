import app from "./app";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "../src/socket/socket";

const PORT = 8000;

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Socket Connection
initializeSocket(io);

// Routes
app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/test", (req, res) => {
  res.json({
    message: "Backend Working",
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});