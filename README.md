# 2811ICT-Assignment

## Documentation

## Git Repo and version control approach

The node project is in the root of the repo, index.js being the entry point, the data directory stores a JSON representation of the internal data structures and the angular project is in the directory front-end. The angular project can then be built and node can statically serve it

The approach I took to version contorl was to to commit and push my changes frequently, after writing a block of code and testing I would then commit with a meaningful message to myself and then push to GitHub. This ensured that if an issue did happen I would have multiple "recent" points to go back to. I also commit for simple reminders for myself.

### Datastructures

The main datastructures used in the program are for storing user data, super admins, groups and channels. This was achieved by using arrays of javascript objects which were than able to be saved to file everytime a modification was made and loaded into memory when the server would start. Below are the arrays with a sample javascript object (record).

var users = [
  {user_id: 0, username: "super", email:"", group_ids:[0]},
]

var super_admins = [
  {super_id: 0, user_id: 0}
]

var groups = [
  {group_id: 0, name:"first group", channel_ids:[1], admin_ids:[0, 1], user_ids:[0, 1]},
]

var channels = [
  {channel_id: 0, name:"first channel", group_id:0, user_ids:[1]},
]

A few of these datastructures are doubly linked, for example a user knows what groups it is in and the groups know which users are in it. This was used in order to make the adding of users and deleting of users much easier, think of a cascade delete in SQL for example. It also allows 'reverse lookups'. I also decided on making each component uniquely identifiable by using a unique id (auto increment), that way multiple groups could have the same name as well as channels. The usernames are unique however but I would prefer to solely base identification of a user from their ID and not their username.

### Client vs Server responsibilities

The server is responsible for storing all data and serving it to the client. The server REST API does have error checking implemented and will send the client an error message, it is the client's responsibility to deal with this error. The server responds with a success flag, if the request was sucessfull the client continues as normal however if the query is unsuccessful then I made the server do an alert() with the error message recieved from the server.

There is no server-side user authentication at the moment, so that responsibility is up to the client, for example if the client is not logged in you cannot go to the chat/admin page. This is extermely bad as you could just change your username in local storage and access restricted areas, for part 2 I would like to have server side aunethication so the rest API validates if the query should be allowed.

### REST API

GET: /api/users
  * returns all the users objects that are stored server side
  * response {success:"true", value:users}

GET: /api/users/:id
  * returns a specific user object identified by their user_id or username that is stored server side
  * response {success:"true", value:user}

GET: /api/super_admins
  * returns all the super admin objects

GET: /api/super_admins/:id
  * returns the super admin object from a user_id, if not found returns error 

GET: /api/groups
  * returns all the group objects

GET: /api/groups/:id
  * returns a specific group object based of the group_id, if not found returns error

GET: /api/groups_and_channels_from_username
  * returns an object containing all the groups and the channels in those groups the a user was in based off a username, if not found returns error

GET: /api/channels
  * returns all the channel objects

GET: /api/channels/:id
  * returns a specific channel object based off channel_id, if not found returns error

POST: /api/groups/is_admin
  * given a username
  * returns whether or not that user is a group admin in at least one group

POST: /api/users/create
  * given a username, email address, and wether or not they are to be a super admin
  * creates a user
  * returns if successfull or if failed the error

POST: /api/groups/create
  * given a group name
  * creates a group

POST: /api/channels/create
  * given the parent group name and the channel name
  * creates the channel and references the group, group also has a refrence to the channel
  * returns if creation was successfull else returns the error

POST: /api/channels/invite
  * given a username and channel_id
  * adds a user to the channel and parent group
  * if the user does not exist they will be created
  * returns if successfull else the reason why not

POST: /api/users/delete
  * given a user_id
  * deletes the user, also from super admins, from every group they are in and also every channel

POST: /api/channels/delete
  * given a channel_id
  * remove the channel from the group

POST: /api/channels/delete_user/
  * given a user_id
  * removes user from that channels

POST: /api/groups/delete
  * given a group_id
  * deletes group, channels in group, and reference of the group in the users


### Angular Architecture

#### Components

##### admin
  * provides access to the above API endpoints
  * depending on admin level some features are blocked, as stated in task sheet

##### chat
  * where the full chat functionality will be in part 2, multiple groups and channels, broadcast to other users, etc.

##### home
  * the login
  * creates user on the server if does not exist

##### logout
  * just logs out and redirects to home

##### profile
  * shows some information about the logged in user, assumming theremaybe some user modifications in part 2

#### Models

  * Models are used for 2 way bindings between the components html and the components typescript

### Isuees / Notes

Some of the API endpoints are broken, I thought it would be good to have optional arguments for example "/api/groups/:id" however that makes the following route invalid "/api/groups/foo/bar". I have implemented all the endpoints its just they are not all accessible, but you will see them if you look at the index.js file.

I developed a static html page for my own testing early on in the development of the REST api, it can be reached at "/api/test", and allows interaction with the API. Unfourtantely I had issues creating my Admin page, It was working but when I added all the HTML functioanlity I was getting Angular errors. Im quite dissapointed by this so you will have to look at the admin.component.html file to get an idea of its functions. The "/api/test" is a decent substitute for testing though.

I understand the index.js file is very large, as I did not split it into smaller files, if you have any questions please feel free to ask and I am happy to explain.

The vast majority of the functionality is implemented, but due to time constraints and lack of knowledge not all functionality was able to be accomplished. I am looking forward to part 2 where Mongo DB can be used because using databases to handle the data will make some of the 'complicated' tasks I had to perform trivial, and I will be able to focus on the functioanlity.
