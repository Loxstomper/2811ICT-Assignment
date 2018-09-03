var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
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

// data structures files location
var user_file         = __dirname + "/data/users.json";
var super_admins_file = __dirname + "/data/super_admins.json";
var groups_file       = __dirname + "/data/groups_file.json";
var channels_file     = __dirname + "/data/channels_file.json";

// load these in json serialize

// data structures
var users = [
  {user_id: 0, username: "super", email:"", group_ids:[0]},
  {user_id: 1, username: "bob", email:"bob@cat.com", group_ids:[0]}
]

var super_admins = [
  {super_id: 0, user_id: 0}
]

var groups = [
  {group_id: 0, name:"first group", channel_ids:[1], admin_ids:[0, 1], user_ids:[0, 1]},
  {group_id: 1, name:"second group", channel_ids:[], admin_ids:[0, 1], user_ids:[0, 1]}
]

var channels = [
  {channel_id: 0, name:"first channel", group_id:0, user_ids:[1]},
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
  let email_addr = req.body.email;
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
  let new_user = {user_id: new_id, username:username, email:email_addr, group_ids:[]};
  // adds to the user
  users.push(new_user);

  fs.writeFile(user_file, JSON.stringify(users), function(err) {
    if (err) {
        console.log(err);
    }
  });

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


    fs.writeFile(super_admins_file, JSON.stringify(super_admins), function(err) {
      if (err) {
          console.log(err);
      }
    });
  }

  res.send("USER CREATED");
})

app.post("/api/groups/create", function(req, res){
  let group_name = req.body.group_name;
  let new_id = 0;
  //basing this of id, so there can be duplicate group names
  for (let i = 0; i < groups.length; i ++)
  {
    if (groups[i].group_id > new_id)
    {
      new_id = groups[i].group_id;
    }
  }

  let new_group = {group_id:new_id, name:group_name, channel_ids:[], admin_ids:[], user_ids:[]};
  groups.push(new_group);

  res.send("CREATED GROUP");
})

app.post("/api/channels/create", function(req, res){
  let group_name = req.body.group_name;
  let group_id = 0;
  let group_exists = 0;
  let channel_name = req.body.channel_name;
  let new_id = 0;

  //basing this of id, so there can be duplicate group names
  for (let i = 0; i < channels.length; i ++)
  {
    if (channels[i].channel_id > new_id)
    {
      new_id = channels[i].channel_id;
    }
  }

  // now got to figure out what the group id is based of the name given
  for (let i = 0; i < groups.length; i ++)
  {
    if (groups[i].name == group_name)
    {
      group_id = groups[i].group_id;
      group_exists = 1;
    }
  }

  if (!group_exists)
  {
    res.send("GROUP DOES NOT EXIST");
  }

  new_id ++;
  let new_channel = {channel_id:new_id, name:channel_name, group_id:group_id, user_ids:[]};
  channels.push(new_channel);

  console.log(channels);

  // also need to update the channel_ids in the group
  groups[group_id].channel_ids.push(new_id);

  fs.writeFile(channels_file, JSON.stringify(channels), function(err) {
    if (err) {
        console.log(err);
    }
  });

  fs.writeFile(groups_file, JSON.stringify(groups), function(err) {
    if (err) {
        console.log(err);
    }
  });

  res.send("CREATED CHANNEL");
})


http.listen(3000);
console.log("Listning on port 3000");
