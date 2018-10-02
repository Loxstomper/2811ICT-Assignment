# 2811ICT-Assignment

## Documentation

## Git Repo and version control approach

Assignment 1 is on the master branch, assignment 2 is on the branch "ASS-2", in order to maintain seperation between assignments without having to create a new Repo.
The node project is in the root of the repo (including modules), index.js being the entry point, the image directory stores all images on the site and the angular project is in the directory front-end. The angular project can then be built and node can statically serve it

The approach I took to version contorl was to to commit and push my changes frequently, after writing a block of code and testing I would then commit with a meaningful message to myself and then push to GitHub. This ensured that if an issue did happen I would have multiple "recent" points to go back to. I also commit for simple reminders for myself.

### Datastructures

Below are the Documents that were stored in the mongodb collections


users = {username: "name",
         image: "path",
         email: "a@email.com",
         password: "password",
         superadmin: 1/0,
         groups: ["g1", "g2"],
         group_admin: 1/0,
         channels: ["c1", "c2"]
        }

groups = {name: "name",
          users: ["u1", "u2", ...],
          channels: ["c1", "c2", ...],
        }

channels = {name: "name",
            group: "name",
            users: ["u1", "u2"]
            }

A few of these datastructures are doubly linked, for example a user knows what groups it is in and the groups know which users are in it. This was used in order to make the adding of users and deleting of users much easier, think of a cascade delete in SQL for example. Unique usernames, Unique channel and groups names. The user object contains if they are a superadmin or group_admin purely for client side rendering and some basic 'authentication'

### Client vs Server responsibilities

The server is responsible for storing all data and serving it to the client. The server REST API does have error checking implemented and will send the client an error message, it is the client's responsibility to deal with this error. The server responds with a success flag, if the request was sucessfull the client continues as normal however if the query is unsuccessful then I made the server do an alert() with the error message recieved from the server.

There is no server-side user authentication at the moment, so that responsibility is up to the client, for example if the client is not logged in you cannot go to the chat/admin page. This is extermely bad as you could just change your username in local storage and access restricted areas, for part 2 I would like to have server side aunethication so the rest API validates if the query should be allowed.

### REST API

The general response pattern is
{ok:"true"} OR {ok:"true", value:""} OR {ok:"false", error:""}

POST "/api/login"
* takes username/password
* returns if successful login and if not the reason

POST "/api/users/create"
* create a user
* returns if successful and if not why

GET "/api/users"
* gets all users

DELETE "/api/users/delete/:user"
* deletes a specific user by username

POST "/api/groups/create"
* creates a group
* returns if successful and if not why

POST "/api/groups/delete"
* deletes a group based of group name

POST "/api/groups/"
* returns all the groups a user is in

POST "/api/groups/channels"
* gets the channels in a group a user is in

GET "/api/groups/channels/users/:channel"
* gets the users in a channel

POST "/api/groups/channels/add"
* creates a channel 

GET "/api/images/users/:user"
* gets a users image from username

POST '/api/images/upload'
* uploads an image




### Angular Architecture

#### Components

##### channels
  * Panel that displays a list of channels (embedded in home component)

##### chat
  * The component that handles the chat (embedded in home component)

##### home
  * The main page, also has administration and modifications at the bottom of the page

##### login
  * loging screen, when successfully login redirects to home page

#### Models

  * Models are used for 2 way bindings between the components html and the components typescript

#### Services

#### Groups
  * all group functionality

#### Upload
  * handles  uploading the images

#### User
  * handles a lot of the user functionality regarding API calls