var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + "/front-end/dist/front-end/"));


// socket stuff
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

var users = [
  {user_id: 0, username: "super", group_ids:[0]},
  {user_id: 1, username: "bob", group_ids:[0]}
]

var super_admins = [
  {super_id: 0, user_id: 0}
]

var groups = [
  {group_id: 0, name:"first group", channel_ids:[0, 1], admin_ids:[0, 1], user_ids:[0, 1]},
  {group_id: 1, name:"second group", channel_ids:[2], admin_ids:[0, 1], user_ids:[0, 1]}
]

var channels = [
  {channel_id: 0, name:"first channel", group_id:0, user_ids:[1]},
  {channel_id: 1, name:"MEMES", group_id:1, user_ids:[1]}
]
// routes
app.get('/test', function(req, res) {
  res.sendFile("./testing.html", {root: __dirname});
})

// REST API

// ---------- GET METHODS ----------- //
app.get('/api/users', function(req, res) {
  res.send(users);
})

app.get('/api/users/:id', function(req, res) {
  const req_user_id = req.params['id'];

  for (var i = 0; i < users.length; i ++)
  {
    if (users[i].user_id == req_user_id)
    {
      res.send(users[i]);
    }
  }

  res.send("USER DOESNT EXIST");
})

app.get('/api/super_admins', function(req, res) {
  res.send(super_admins);
})

app.get('/api/super_admins/:id', function(req, res) {
  const req_super_id = req.params['id'];

  for (var i = 0; i < super_admins.length; i ++)
  {
    if (super_admins[i].super_id == req_super_id)
    {
      res.send(super_admins[i]);
    }
  }

  res.send("SUPER USER DOESNT EXIST");
})

app.get('/api/groups', function(req, res) {
  res.send(groups);
})

app.get('/api/groups/:id', function(req, res) {
  const req_group_id = req.params['id'];

  for (var i = 0; i < req_group_id.length; i ++)
  {
    if (groups[i].group_id == req_super_id)
    {
      res.send(group_id[i]);
    }
  }

  res.send("GROUP DOESNT EXIST");
})

app.get('/api/channels', function(req, res) {
  res.send(channels);
})

app.get('/api/channels/:id', function(req, res) {
  const req_channel_id = req.params['id'];

  for (var i = 0; i < channels.length; i ++)
  {
    if (channels[i].channel_id == req_channel_id)
    {
      res.send(channels[i]);
    }
  }

  res.send("CHANNEL DOESNT EXIST");
})

// ----------- POST METHODS ----------------- //
app.post("/api/users/create", function(req, res)
{
  // get the username
  let username = req.body.username;
  let super_user = req.body.super_admin;
  let new_id = 0;

  // check if the username is not already in the system
  for (let i = 0; i < users.length; i ++)
  {
    if (users[i].user_id > new_id)
    {
      new_id = users[i].user_id;
    }

    if (users[i].username == username)
    {
      console.log("USERNAME ALREADY EXISTS");
      res.send("USERNAME ALREADY EXISTS");
    }
  }

  new_id ++;

  // username is not present
  let new_user = {user_id: new_id, username:username, group_ids:[]};
  // adds to the user
  users.push(new_user);

  // now lets see if they should be a super user
  if (super_user)
  {
    let sa_id = 0;
    // figure out what the super id would be
    for (let i = 0; i < super_admins.length; i ++)
    {
      if (super_admins.super_id > sa_id)
      {
        sa_id = super_admins.super_id;
      }
    }

    sa_id ++;
    let new_super = {super_id: sa_id, user_id: new_id};
    super_admins.push(new_super);
  }

  res.send("USER CREATED");
})




http.listen(3000);
console.log("Listning on port 3000");
