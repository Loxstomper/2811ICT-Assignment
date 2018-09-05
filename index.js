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

// data structures
var users;
var super_admins;
var groups;
var channels;

// load these in json serialize
fs.readFile(user_file, function(err, data){
  if (err){
    throw err;
  }
  users = JSON.parse(data);
})

fs.readFile(super_admins_file, function(err, data){
  if (err){
    throw err;
  }
  super_admins = JSON.parse(data);
})

fs.readFile(groups_file, function(err, data){
  if (err){
    throw err;
  }
  groups = JSON.parse(data);
})

fs.readFile(channels_file, function(err, data){
  if (err){
    throw err;
  }
  channels = JSON.parse(data);
})

// routes
app.get('/api/test', function(req, res) {
  res.sendFile("./testing.html", {root: __dirname});
})

// REST API

// ---------- GET METHODS ----------- //
app.get('/api/users', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  // res.send(users);
  res.send(JSON.stringify({success:"true", value:users}));
})

app.get('/api/users/:id', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  const req_user_id = req.params['id'];
  is_username = 0;

  if (isNaN(req_user_id))
  {
    is_username = 1;
  }

  for (let i = 0; i < users.length; i ++)
  {
    if (!is_username && users[i].user_id == req_user_id)
    {
      res.send(JSON.stringify({success:"true", value:users[i]}));
      return;
    }
    else if (users[i].username == req_user_id)
    {
      // res.send(users[i]);
      res.send(JSON.stringify({success:"true", value:users[i]}));
      return;
    }
  }

  res.send(JSON.stringify({success:"false", error:"user does not exist"}));
})

app.get('/api/super_admins', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  // res.send(super_admins);
  res.send(JSON.stringify({success:"true", value:super_admins}));
})

app.get('/api/super_admins/:id', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  const req_super_id = req.params['id'];

  for (let i = 0; i < super_admins.length; i ++)
  {
    if (super_admins[i].super_id == req_super_id)
    {
      // res.send(super_admins[i]);
      res.send(JSON.stringify({success:"yes", value:super_admins[i]}));
      return;
    }
  }

  res.send(JSON.stringify({success:"false", error:"super user does not exist"}));
})

app.get('/api/super_admins/is_super_admin/:id', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  const req_username = req.params['id'];
  let user_id;

  // figure out the users id
  for (let i = 0; users.length; i++)
  {
    if (users[i].username == req_username)
    {
      user_id = users[i].user_id;
      break;
    }
  }

  if (user_id == null)
  {
    res.send(JSON.stringify({success:"false", error:"user does not exist"}));
    return;
  }


  console.log("CHECKING IF: " + req_username + " is super")

  for (let i = 0; i < super_admins.length; i ++)
  {
    if (super_admins[i].user_id == user_id)
    {
      // res.send(super_admins[i]);
      res.send(JSON.stringify({success:"true", value:"true"}));
      return;
    }
  }

  res.send(JSON.stringify({success:"false", error:"user is not a super admin"}));
})


app.get('/api/groups', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({success:"true", value:groups}));
})

app.get('/api/groups/:id', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  const req_group_id = req.params['id'];

  for (let i = 0; i < groups.length; i ++)
  {
    if (groups[i].group_id == req_group_id)
    {
      // res.send(group_id[i]);
      res.send(JSON.stringify({success:"true", value:groups[i]}));
      return;
    }
  }

  res.send(JSON.stringify({success:"false", error:"group does not exist"}));
})

// check if the user is at least a group admin in one of the groups
app.get('/api/groups/is_admin/:id', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  // this really should be ID
  const req_username = req.params['id'];
  let user_id = null;

  console.log("CHECKING IF " + req_username + " is group admin");

  // do a lookup for the ID
  for (let i = 0; i < users.length; i ++)
  {
    if (users[i].username == req_username)
    {
      user_id = users[i].user_id;
      break;
    }
  }

  if (user_id == null)
  {
    res.send(JSON.stringify({success:"false", error:"user does not exist"}));
    return;
  }

  // go through every group
  for (let i = 0; i < groups.length; i ++)
  {
    for (let j = 0; j < groups[i].admin_ids.length; j ++)
    {
      if (groups[i].admin_ids[j] == user_id)
      {
        res.send(JSON.stringify({success:"true", value:"true"}));
        return;
      }
    }

  }

  res.send(JSON.stringify({success:"false", value:"false"}));
})

app.post("/api/groups_and_channels_from_username", function(req, res){
  res.setHeader("Content-Type", "application/json");
  let username = req.body.username;
  let result = {values:[]};

  // {[group: [channel, channel]], [group:]}

  // need to find out what groups the user is in
  // need to find out what channels in those groups the use is in

  // find the user object
  for (let i = 0; i < users.length; i ++)
  {
    if (users[i].username == username)
    {
      let user_id = users[i].user_id;
      // found the user object now iterate over the groups
      for (let j = 0; j < users[i].group_ids.length; j ++)
      {
        // find the acctual group objects
        for (let k = 0; k < groups.length; k ++)
        {
          if (groups[k].group_id == users[i].group_ids[j])
          {
            let group_name = groups[k].group_name;
            let group_json = {group_name:group_name, channels:[]}
            // add to JSON here

            // now iterate over the channels in the group
            for (let l = 0; l < groups[k].channel_ids.length; l ++)
            {
              // find the actual channel object
              for (let m = 0; m < channels.length; m ++)
              {
                if (channels[m].channel_id == groups[k].channel_ids[l])
                {
                  // found the actual channel object
                  // now need to see if the user is in that channel
                  for (let n = 0; n < channels[m].user_ids.length; n ++)
                  {
                    if (channels[m].user_ids[n] == user_id)
                    {
                      // the user is in this channel add to the json
                      console.log(channels[m].channel_name);
                      group_json['group_name'].push(channels[m].channel_name);
                    }
                  }

                }
              }

            }

          }
          result['values'].push(group_json);
        }

          continue;
        }
      }
      break;
    }
    console.log(result);    
    res.send(JSON.stringify({success:"true", value:result}));
})

app.get('/api/channels', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  // res.send(channels);
  res.send(JSON.stringify({success:"true", value:channels}));
})

app.get('/api/channels/:id', function(req, res) {
  res.setHeader("Content-Type", "application/json");
  const req_channel_id = req.params['id'];

  for (var i = 0; i < channels.length; i ++)
  {
    if (channels[i].channel_id == req_channel_id)
    {
      // res.send(channels[i]);
      res.send(JSON.stringify({success:"true", value:challens[i]}));
      return;
    }
  }

  res.send(JSON.stringify({success:"false", error:"channel does not exist"}));
})

// ----------- POST METHODS ----------------- //

app.post("/api/groups/make_admin", function(req, res){
  res.setHeader("Content-Type", "application/json");
  let username = req.body.username;
  let user_id;
  let group_id = req.body.group_id;
  let group_object_index = -1;

  // find the actual user object
  for (let i = 0; i < users.length; i ++)
  {
    // found the user object
    if (users[i].username == username)
    {
      user_id = users[i].user_id;
      break;
    }
  }

  if (user_id == null)
  {
    res.send(JSON.stringify({success:"false", error:"user does not exist"}));
    return;
  }

  // find the actual group object
  for (let i = 0; i < groups.length; i ++)
  {
    // found the group object
    if (groups[i].group_id == group_id)
    {
      group_object_index = i;
      // check if the user is not already a group admin
      for (let j = 0; j < groups[i].admin_ids.length; j ++)
      {
        if (group[i].admin_ids[j] == user_id)
        {
          res.send(JSON.stringify({success:"false", error:"user is already a group admin"}));
          return;
        }
      }
    }
  }

  if (group_object_index < 0)
  {
    res.send(JSON.stringify({success:"false", error:"group not found"}));
    return;
  }

  groups[group_object_index].admin_ids.push(user_id);
  res.send(JSON.stringify({success:"true"}));


})

app.post("./api/groups/is_admin", function(req, res){
  res.setHeader("Content-Type", "application/json");
  let username = req.body.username;
  let user_id;

  // find the actual user object
  for (let i = 0; i < users.length; i ++)
  {
    // found the user object
    if (users[i].username == username)
    {
      // iterate over groups
      for (let j = 0; j < users[i].group_ids.length; j ++)
      {
        // find the group object
        for (let k = 0; k < groups.length; k ++)
        {
          // found the group object
          if (groups[k].group_id == users[i].group_ids[j])
          {
            // now check if the user in admins
            for (let l = 0; l < groups[k].admin_ids.length; l ++)
            {
              for (let m = 0; m < groups[k].admin_ids.length; m ++)
              {
                if (groups[k].admin_ids[m] == user_id)
                {
                  res.send(JSON.stringify({success:"true"}));
                  return;
                }
              }
            }

          }
        }
      }
    }
  }

  res.send(JSON.stringify({success:"false"}));

})



// -- creating -- //
app.post("/api/users/create", function(req, res)
{
  res.setHeader("Content-Type", "application/json");
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
      // res.send("USERNAME ALREADY EXISTS");
      res.send(JSON.stringify({success:"false", error:"username already exists"}));
      return;
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

  // res.send("USER CREATED");
  res.send(JSON.stringify({success:"true"}));
})

app.post("/api/groups/create", function(req, res){
  res.setHeader("Content-Type", "application/json");
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

  new_id ++;

  let new_group = {group_id:new_id, name:group_name, channel_ids:[], admin_ids:[], user_ids:[]};
  groups.push(new_group);

  fs.writeFile(groups_file, JSON.stringify(groups), function(err) {
    if (err) {
        console.log(err);
    }
  });

  res.send(JSON.stringify({success:"true"}));
})

app.post("/api/channels/create", function(req, res){
  res.setHeader("Content-Type", "application/json");
  let group_name = req.body.group_name;
  let group_id = 0;
  let group_object_index = 0;
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
      group_object_index = i;
      group_exists = 1;
    }
  }

  if (!group_exists)
  {
    res.send(JSON.stringify({success:"false", error:"group does not exist"}));
    return;
  }

  new_id ++;
  let new_channel = {channel_id:new_id, name:channel_name, group_id:group_id, user_ids:[]};
  channels.push(new_channel);

  // also need to update the channel_ids in the group
  console.log("IS IT HERE? THIS IS THE VALUE OF groups[group_id]: " + groups[group_id])
  groups[group_object_index].channel_ids.push(new_id);

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

  res.send(JSON.stringify({success:"true"}));
})


// GROUP ADMIN CREATE/INVITE USERS TO A CHANNEL
  // - if user exists just put them in the channel
  // - if user doesnt exist, create and put them in the channel

app.post("/api/channels/invite", function(req, res){
  res.setHeader("Content-Type", "application/json");
  let username = req.body.username;
  let channel_id = req.body.channel_id;
  let user_id;
  let group_id;
  let user_object_index;
  let user_exists;

  console.log("USERNAME: " + username);

  // check if user exists
  for (let i = 0; i < users.length; i ++)
  {
    if (users[i].username == username)
    {
      user_exists = 1;
      user_object_index = i;
      user_id = users[i].user_id;
      break;
    }
  }


  if (!user_exists)
  {
    console.log("NEED TO CREATE USER: " + username);

    let new_id = 0;

    // getting the user_id
    for (let i = 0; i < users.length; i ++)
    {
      if (users[i].user_id > new_id)
      {
        new_id = users[i].user_id;
      }
    }

    new_id ++;

    user_id = new_id;

    let new_user = {user_id: new_id, username:username, email:"", group_ids:[]};
    // adds to the user
    users.push(new_user);
    user_object_index = users.length - 1;
  }

  // find out what the group is that the channel is in

  // find the channel and do a lookup
  for (let i = 0; i < channels.length; i ++)
  {
    if (channels[i].channel_id == channel_id)
    {
      // add the user id to the channel

      // check that the user is not already in the channel
      for (let j = 0; j < channels[i].user_ids.length; j ++)
      {
        if (channels[i].user_ids[j] == user_id)
        {
          res.send(JSON.stringify({success:"false", error:"user already in channel"}));
          return;
        }
      }

      channels[i].user_ids.push(user_id);
      group_id = channels[i].group_id;

    }
  }

  // add the user to the group
  // find out the group object
  for (let i = 0; i < groups.length; i ++)
  {
    if (groups[i].group_id == group_id)
    {
      // add the user to the group
      // check if the user already in the group
      for (let j = 0; j < groups[i].user_ids.length; j ++)
      {
        if (groups[i].user_ids[j] == user_id)
        {
          res.send(JSON.stringify({success:"true"}));
          return;
        }
      }
      groups[i].user_ids.push(user_id);
    } 
  }

  // add that group id to the user
  users[user_object_index].group_ids.push(group_id);


  // save changes to files
  // write users to file
  fs.writeFile(user_file, JSON.stringify(users), function(err) {
    if (err) {
        console.log(err);
    }
  });


  // write groups to file
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

  res.send(JSON.stringify({success:"true"}));
})


// GROUP ADMIN MAKE USER A GROUP ADMIN OF THE GROUP

// ----- deleting ---- //
app.post('/api/users/delete/', function(req, res) {
  res.setHeader("Content-Type", "application/json");
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
    res.send(JSON.stringify({success:"false", error:"user not found"}));
    return;
  }

  console.log("DELETEING USER: ");
  console.log(user_data);

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

  let group_object_index;
  // iterate over the group ids that the user is in
  console.log("USER WAS IN THE FOLLOWING GROUPS: " + user_data.group_ids);
  for (let group_id = 0; group_id < user_data.group_ids.length; group_id ++)
  {
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

  res.send(JSON.stringify({success:"true"}));
})

app.post("/api/channels/delete", function(req, res){
  res.setHeader("Content-Type", "application/json");
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
    res.send(JSON.stringify({success:"false", error:"channel does not exist"}));
    return;
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

  // delete the channel
  // doesnt look like it works when it is the last index
  channels.splice(channel_object_index, 1);

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

  res.send(JSON.stringify({success:"true"}));
})

app.post("/api/channels/delete_user", function(req, res){
  res.setHeader("Content-Type", "application/json");
  let channel_id = req.body.channel_id;
  let username = req.body.username;
  let channel_object_index;
  let user_object_index;

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
    res.send(JSON.stringify({success:"false", error:"channel does not exist"}));
    return;
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

  res.send(JSON.stringify({success:"true"}));
})

app.post("/api/groups/delete", function(req, res){
  res.setHeader("Content-Type", "application/json");
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
    res.send(JSON.stringify({success:"false", error:"group does not exist"}));
    return;
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

  res.send(JSON.stringify({success: "true"}));
})

http.listen(3000);
console.log("Listning on port 3000");
