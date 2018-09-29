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
                })
            }
        })
    }

    this.delete_group = function(data, response){
        // check if group exists
        db.collection("groups").deleteOne({name:data.name}, function(err, res) {
            if (err) throw err;

            console.log(res);
            response.send(JSON.stringify({ok:"true"}));

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
        })

    }

    this.get_channels = function(data, response) {

        let group_name = data.group_name;
        let username = data.username;

        let channel_arr = []

        for (let i = 0; i < 100; i ++)
        {
            channel_arr.push(i);
        }

        // response.send(JSON.stringify({ok:"true", value:["channel1", "channel2",]}));
        response.send(JSON.stringify({ok:"true", value:channel_arr}));
    }

    this.set_db = function (db){
        this.db = db;
    }

    return this;
}
