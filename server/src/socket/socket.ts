import { Server } from "socket.io";


export const initializeSocket = (
  io: Server
) => {


io.on("connection",(socket)=>{


console.log(
"User connected:",
socket.id
);



socket.on(
"join-note",
(noteId)=>{


socket.join(noteId);


console.log(
`${socket.id} joined note ${noteId}`
);


});




socket.on(
"send-changes",
(data)=>{


socket
.to(data.noteId)
.emit(
"receive-changes",
data.content
);


});

socket.on(
  "user-typing",
  ({noteId,email})=>{

    socket
      .to(noteId)
      .emit(
        "receive-typing",
        email
      );

  }
);



socket.on(
"disconnect",()=>{


console.log(
"User disconnected:",
socket.id
);


});


});


};