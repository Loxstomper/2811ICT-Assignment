var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var formidable = require('formidable');
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
var groups_component = require("./groups.js")();
var channel_commponent = require("./channels.js")();
var upload_component = require("./upload.js")(formidable);

// connect to mongodb
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ass2";

MongoClient.connect(url, {poolSize:10, useNewUrlParser: true}, function(err, client) {
  if (err) throw err;

  const dbName = "ass2";
  const db = client.db(dbName);

  login_component.set_db(db);
  users_component.set_db(db);
  groups_component.set_db(db);
  upload_component.set_db(db);

  users_component.create_super();



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
  users_component.create_user(req.body, res);
});

app.get("/api/users", function(req, res){
  users_component.get_users(res);
});

app.delete("/api/users/delete/:user", function(req, res){
  users_component.delete_user(req.params.user, res);
});

app.get("/test", function(req, res){
  
  // NEED TO MAKE IT SO SUPER USER IS CREATED IF NOT EXISTS ON STARTUP
  let to_add =    {
    username: "test", 
    image: "./images/users/default.png",
    email: "test@mail.com",
    password: "123",
    superadmin: 1,
    groups: [],
    group_admin: [],
    channels: []
    };

  users_component.create_user(to_add, res);
});

app.post("/api/groups/create", function(req, res){
  groups_component.create_group(req.body, res);
});

app.post("/api/groups/delete", function(req, res){
  groups_component.delete_group(req.body, res);
});

// returns all the groups a user is in
app.post("/api/groups/", function(req, res){
  groups_component.get_groups(req.body.username, res);
});

// set intersection between groups channels and the clients channels
app.post("/api/groups/channels", function(req, res){
  groups_component.get_channels(req.body, res);
});

app.get("/api/groups/channels/users/:channel", function(req, res) {
  // console.log("PARAMS: ", req.params);
  channel_commponent.get_users(req.params.channel, res);
});

app.post("/api/groups/channels/add", function(req, res){
  channel_commponent.create_channel(req.body, res);
});

app.get("/api/images/users/:user", function(req, res){
  res.sendFile(__dirname + "/images/users/" + req.params.user);
});

app.post('/api/images/upload', function(req, res) {
  upload_component.upload(req, res);
});


http.listen(3000);
console.log("Listning on port 3000");
