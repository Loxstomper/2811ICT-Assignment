module.exports = function() {
    this.db = null;

    this.create_user = function(data, response){
        // check if username exists
        db.collection("users").findOne({username:data.username}, function(err, res) {
            if (err) throw err;

            if (res) {
                response.send(JSON.stringify({ok:"false", error:"username: " + data.username + " already exists."}));
            }
            else
            {
                let to_add =    {
                                username: data.username, 
                                image: "./images/users/default.png",
                                email: data.email,
                                password: data.password,
                                superadmin: data.superadmin,
                                groups: data.groups,
                                group_admin: data.group_admin,
                                channels: data.channels
                                };

                db.collection("users").insertOne(to_add, function(err, res) {
                    if (err) throw err;

                    console.log("INSERTED: ", to_add);

                    response.send(JSON.stringify({ok:"true"}));
                })
            }
        })
    }

    this.delete_user = function(username, response){
        if (username === "super")
        {
            response.send(JSON.stringify({ok:"false", error:"Cannot delete user: super"}));
            return;
        }

        console.log("DELETING: ", username);
    }

    this.get_users = function(response) {
            // db.collection("users").find({}).project({_id: 0, username: 1}).toArray(function(err, res) {
            //     console.log(res);

            //     response.send(JSON.stringify({value:res}));
            // });
            response.send(JSON.stringify({value:[1, 2, 3]}));
    }

    // used to create a super account if not exists
    this.create_super = function()
    {
        db.collection("users").findOne({username:"super"}, function(err, res) {
            if (err) throw err;

            if (!res)
            {
                console.log("CREATING SUPER USER");

                let to_add =    {
                                username: "super", 
                                image: "./images/users/super.png",
                                email: "",
                                password: "pass",
                                superadmin: 1,
                                groups: [],
                                group_admin: 1,
                                channels: []
                                };

                db.collection("users").insert(to_add, function(err, res) {
                    if (err) throw err;
                })
            }
        })
    }

    this.set_db = function (db){
        this.db = db;
    }

    return this;
}
