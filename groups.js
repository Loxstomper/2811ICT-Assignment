module.exports = function() {
    this.db = null;

    this.create_group = function(data, response){
        // check if group exists
        db.collection("groups").findOne({name:data.name}, function(err, res) {
            if (err) throw err;

            if (res) {
                response.send(JSON.stringify({ok:"false", error:"group name: " + data.name + " already exists."}));
            }
            else
            {
                let to_add =    {
                                name: data.name, 
                                users: [],
                                channels: []
                                };

                db.collection("groups").insert(to_add, function(err, res) {
                    if (err) throw err;

                    console.log("INSERTED")
                    console.log(to_add);

                    response.send(JSON.stringify({ok:"true"}));
                    return;
                })
            }
        })
    }

    this.delete_group = function(data, response){
        // get group object
        // iterate through list of channels and delete them
        // delete the channels from the users
        // delete the group fromt he users
        // delete group

        // db.collection("groups").findOne({name:data.name}, function(err, res) {

        db.collection("groups").deleteOne({name:data.name}, function(err, res) {
            if (err) throw err;

            console.log(res);
            response.send(JSON.stringify({ok:"true"}));
            return;

        })
    }

    this.get_groups = function(username, response) {
        let groups = [];
        let group;


        db.collection("groups").find({}).toArray( function(err, res) {
            if (err) throw err;

            for (let i = 0; i < res.length; i ++)
            {
                // check if user is in res[i].users
                groups.push(res[i].name);
            }

            response.send(JSON.stringify({ok:"true", value:groups}));
            return;
        })

    }

// set intersection between groups channels and the clients channels
    this.get_channels = function(data, response) {

        let group_name = data.group_name;
        let username = data.username;
        console.log(group_name);

        // get all the channels in the group
        db.collection("groups").find({name:group_name}).project({_id:0, channels:1}).toArray(function(err, res) {

            console.log(res);
            let channels = res[0]['channels'];
            console.log("THIS IS what im sending", {ok:"true", value:JSON.stringify(channels)});
            // response.send(JSON.stringify({ok:"true", value:res['channels']}));
            // response.send(JSON.stringify({ok:"true", value:JSON.stringify(channels)}));
            response.send(JSON.stringify({ok:"true", value:channels}));

        });

        // let channel_arr = []

        // for (let i = 0; i < 100; i ++)
        // {
        //     channel_arr.push(i);
        // }

        // // response.send(JSON.stringify({ok:"true", value:["channel1", "channel2",]}));
        // response.send(JSON.stringify({ok:"true", value:['one']}));
    }

    this.set_db = function (db){
        this.db = db;
    }

    return this;
}
