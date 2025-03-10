import React, { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { Box, Button, Container, Typography, TextField, Stack, Paper } from "@mui/material";

function App() {
  const socket = useMemo(() => io("http://localhost:3000", { withCredentials: true }), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected to server", socket.id);
    });

    socket.on("recive", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: "#121212", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Chat App
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Your ID: {socketID}
        </Typography>
        
        <form onSubmit={joinRoomHandler} style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            label="Room Name" 
            value={roomName} 
            onChange={(e) => setRoomName(e.target.value)} 
            sx={{ input: { color: "#fff" }, label: { color: "#bbb" }, fieldset: { borderColor: "#bbb" } }}
          />
          <Button type="submit" variant="contained" color="primary">Join</Button>
        </form>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            label="Message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            sx={{ input: { color: "#fff" }, label: { color: "#bbb" }, fieldset: { borderColor: "#bbb" } }}
          />
          <TextField 
            variant="outlined" 
            label="Room" 
            value={room} 
            onChange={(e) => setRoom(e.target.value)} 
            sx={{ input: { color: "#fff" }, label: { color: "#bbb" }, fieldset: { borderColor: "#bbb" } }}
          />
          <Button type="submit" variant="contained" color="primary">Send</Button>
        </form>

        <Stack spacing={2} marginTop={2} sx={{ maxHeight: 200, overflowY: "auto", padding: 1 }}>
          {messages.map((m, i) => (
            <Typography key={i} variant="body1" sx={{ background: "#333", padding: 1, borderRadius: 1, color: "#fff" }}>
              {m}
            </Typography>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}

export default App;
