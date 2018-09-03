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
app.get('/api/test', function(req, res) {
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



// -- creating -- //
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

  console.log("TEST: " + JSON.stringify(channels[channels.length -1]));

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


// GROUP ADMIN CREATE/INVITE USERS TO A CHANNEL
  // - if user exists just put them in the channel
  // - if user doesnt exist, create and put them in the channel


// GROUP ADMIN MAKE USER A GROUP ADMIN OF THE GROUP

// ----- deleting ---- //
app.post('/api/users/delete/', function(req, res) {
  let user_id = req.body.user_id;
  let user_data;

  let super_admin_modified = 0;
  let groups_modified = 0;
  let channels_modified = 0;

  for (let i = 0; i < users.length; i ++)
  {
    if (users[i].user_id == user_id)
    {
      user_data = users[i];
      // remove from user_data
      users.splice(i, 1);

      break;
    }
  }

  // console.log(user_data);

  if (user_data == null)
  {
    res.send("User not found");
  }

  console.log("DELETEING USER: " + user_data);

  // check if was a super admin
  for (let i = 0; i < super_admins.length; i ++)
  {
    if (super_admins[i].user_id == user_id)
    {
      // remove from super_admins
      super_admins.splice(i, 1);
      super_admin_modified = 1;
      console.log("USER was deleted from super_admins");

      break;
    }
  }

  // remove user from groups and channels

  // iterate over the group ids that the user is in
  console.log("USER WAS IN THE FOLLOWING GROUPS: " + user_data.group_ids);
  for (let group_id = 0; group_id < user_data.group_ids.length; group_id ++)
  {
    let group_object_index;
    // get the actual group object index
    for (let i = 0; i < groups.length; i ++)
    {
      if (groups[i].group_id == group_id)
      {
        group_object_index = i; 
        groups_modified = 1;
        break;
      }
    }

    console.log("IN GROUP: " + user_data.group_ids[group_id]);

    // ------- remove from all channels that the user is a member of -------- //
    // iterate over the channel ids that are in the group
    for (let channel_id = 0; channel_id < groups[group_object_index].channel_ids.length; channel_id ++)
    {
      // find the actual channel object
      for (let j = 0; j < channels.length; j ++)
      {
        // this is the channel object
        if (channels[j].channel_id == groups[group_object_index].channel_ids[channel_id])
        {
          console.log("USER WAS IN CHANNEL: " + groups[group_object_index].channel_ids[channel_id]);
          channels_modified = 1;
          // now need to remove the user from the user_id array
          for (let k = 0; k < channels[j].user_ids.length; k ++)
          {
            if (channels[j].user_ids[k] == user_id)
            {
              // remove the user from the user_ids
              channels[j].user_ids[k].splice(k, 1);
              break;
            }
          }

        }
      }

    }

    // remove from admin id in the group
    for (let i = 0; i < groups[group_object_index].admin_ids.length; i ++)
    {
      if (groups[group_object_index].admin_ids[i] == user_id)
      {
        console.log("USER WAS ADMIN IN GROUP: " + groups[group_object_index].admin_ids[i]);
        // remove from admin_ids
        groups[group_object_index].admin_ids.splice(i, 1);
        break;
      }
    }

    // remove from user id in the group
    for (let i = 0; i < groups[group_object_index].user_ids.length; i ++)
    {
      if (groups[group_object_index].user_ids[i] == user_id)
      {
        console.log("USER WAS IN GROUP: " + groups[group_object_index].group_id)
        // remove from user_ids
        groups[group_object_index].user_ids.splice(i, 1);
        break;
      }
    }
  }

  // write users to file
  fs.writeFile(user_file, JSON.stringify(users), function(err) {
    if (err) {
        console.log(err);
    }
  });

  // write super_admins to file
  if (super_admin_modified)
  {
    fs.writeFile(super_admins_file, JSON.stringify(super_admins), function(err) {
      if (err) {
          console.log(err);
      }
    });
  }

  // write super_admins to file
  if (groups_modified)
  {
    fs.writeFile(groups_file, JSON.stringify(groups), function(err) {
      if (err) {
          console.log(err);
      }
    });
  }

  // write channels to file
  if (channels_modified)
  {
    fs.writeFile(channels_file, JSON.stringify(channels), function(err) {
      if (err) {
          console.log(err);
      }
    });
  }

  res.send("USER DELETED");
})

app.post("/api/channels/delete", function(req, res){
  let channel_id = req.body.channel_id;
  let channel_object_index;

  // figure out of valid channel_id
  for (let i = 0; i < channels.length; i ++)
  {
    if (channels[i].channel_id = channel_id)
    {
      channel_object_index = i;
      break;
    }
  }

  if (channel_object_index == null)
  {
    res.send("CHANNEL DOES NOT EXIST");
  }

  // get the group id from the channel object
  let group_id = channels[channel_object_index].group_id;

  // find the group object and remove the channel from it
  for (let i = 0; i < groups.length; i ++)
  {
    if (groups[i].group_id == group_id)
    {
      // find the channel id index
      for (let j = 0; j < groups[i].channel_ids.length; j ++)
      {
        if (groups[i].channel_ids[j] == channel_id)
        {
          // remove the channel id from the group
          groups[i].channel_ids.splice(j, 1);
        }
      }
    }
  }

  // write changes to file
  fs.writeFile(groups_file, JSON.stringify(groups), function(err) {
    if (err) {
        console.log(err);
    }
  });

  // write channels to file
  fs.writeFile(channels_file, JSON.stringify(channels), function(err) {
    if (err) {
        console.log(err);
    }
  });

  res.send("CHANNEL DELETED");
})

app.post("/api/groups/delete", function(req, res){
  let group_id = req.body.group_id;
  let group_object;
  let group_object_index;

  // check it is a real group
  for (let i = 0; i < groups.length; i ++)
  {
    if (groups[i].group_id == group_id)
    {
      group_object_index = i;
      break;
    }
  }

  if (group_object_index == null)
  {
    res.send("GROUP DOES NOT EXIST");
  }


  group_object = groups[group_object_index];

  // remove the group
  groups.splice(group_object_index, 1);

  // have to delete all the channels in the group
  for (let i = 0; i < group_object.channel_ids.length; i ++)
  {
    // find the actual channel object
    for (let j = 0; j < channels.length; j ++)
    {
      if (group_object.channel_ids[i] == channels[j].channel_id)
      {
        // remove the channel
        channels.splice(j, 1);
      }
    }
  }
  // have to update the group_ids in the user objects too
  for (let i = 0; i < group_object.user_ids.length; i ++)
  {
    // find the actual user object
    for (let j = 0; j < users.length; j ++)
    {
      if (users[j].user_id == group_object.user_ids[i])
      {
        // now need to find the group id in the user and remove
        for (let k = 0; k < users[j].group_ids.length; k ++)
        {
          if (users[j].group_ids[k] == group_id)
          {
            // remove the group id from the users group id
            users[j].group_ids.splice(k, 1);
            break;
          }
        }
      }
    }
  }

  res.send("GROUP DELETED");

})





http.listen(3000);
console.log("Listning on port 3000");
