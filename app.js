const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", (socket) => {
    console.log("Connection established");

    socket.on("send location", (location) => {
        console.log(`Received location: Latitude - ${location.latitude}, Longitude - ${location.longitude}`);
        
        // broadcast this location to other clients if needed
         io.emit("location update", location);
    });
});

app.get('/', (req, res) => {
    res.render("index");
});


server.listen(3000, () => console.log("Server started on port 3000!"));
