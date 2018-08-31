var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + "/front-end/dist/front-end/"));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', function(){
      console.log('a user disconnected');
    });

    socket.on('disconnect', function(){
      console.log('a user disconnected');
    });

    socket.on('add-message', (message) => {
        // broadcast to all other clients
        console.log(message);
        io.emit('message', {type:'message', text:message});
    });
});


http.listen(3000);
console.log("Listning on port 3000");
