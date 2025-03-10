import express from "express";
import {Server} from "socket.io";
import {createServer} from "http";
import cors from "cors";

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        method: ["GET", "POST"],
        credentials: true,
    },
});

app.use(cors());
app.get("/", (req,res)=>{
    res.send("Hello world!");
});
io.on("connection", (socket)=>{
    console.log("User Connected",socket.id);
    socket.on("message", ({room, message}) =>{
        console.log({room,message});
        io.to(room).emit("recive",message);
    });
    socket.on("join-room", (room) =>{
        socket.join(room);
        console.log(`user joined room ${room}`);
    })
    socket.on("disconnect", ()=>{
        console.log("User Disconnect",socket.id);
    });
})
server.listen(port, ()=>{
    console.log(`Server is running on port${port}`);
})