var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + "/front-end/dist/front-end/"));

var cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:4200',
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

var login_component = require("./login.js")();
var users_component = require("./users.js")();

// connect to mongodb
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ass2";

MongoClient.connect(url, {poolSize:10}, function(err, client) {
  if (err) throw err;

  const dbName = "ass2";
  const db = client.db(dbName);

  login_component.set_db(db);
  users_component.set_db(db);



  // db.close();
});

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

app.post("/api/login", function(req, res){
  login_component.login(req.body.username, req.body.password, res);
});

app.post("/api/users/create", function(req, res){
  users_component.create_user("bob", "bob@gmail.com", res);
});



http.listen(3000);
console.log("Listning on port 3000");
