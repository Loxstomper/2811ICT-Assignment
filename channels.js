module.exports = function() {
    this.db = null;

    // having site wide unique channel names
    // i know this function is ugly AF - but i have to have a lot of else statements because of the async and cannot just return from the main 
    // function after sending response
    this.create_channel = function(data, response){
        console.log(data);
        // check if group exists
        db.collection("groups").findOne({name:data.group}, function(err, res) {
            if (err) throw err;

            if (!res) 
            {
                response.send(JSON.stringify({ok:"false", error:"group : " + data.group + " does not exist."}));
            }
            else 
            {

                // check if channel exists
                db.collection("channels").findOne({name:data.name}, function(err, res) {
                    if (err) throw err;

                    if (res) 
                    {
                        response.send(JSON.stringify({ok:"false", error:"channel name: " + data.name + " already exists."}));
                        return;
                    }
                    else 
                    {

                        // it doesnt so create it
                        let to_add =    {
                                        name: data.name, 
                                        group: data.group,
                                        users: []
                                        };

                        db.collection("channels").insert(to_add, function(err, res) 
                        {
                            if (err) throw err;

                            console.log("INSERTED")
                            console.log(to_add);

                        })
                    }

                    // now got to update the group
                    db.collection("groups").update({name: data.group}, {$push: {channels:data.name}}, function(err, res) {
                        if (err) throw err;

                        response.send(JSON.stringify({ok:"true"}));
                        return;


                    })
                })
            }
        });


    }

    this.delete_group = function(data, response){
        // check if group exists
        db.collection("groups").deleteOne({name:data.name}, function(err, res) {
            if (err) throw err;

            console.log(res);
            response.send(JSON.stringify({ok:"true"}));

        })
    }

    this.get_users = function(channel, response) {
        // console.log("THE CHANNEL IS: ", channel);
        // console.log("response: ", response);
        // get all the channels in the group
        db.collection("channels").find({name:channel}).project({_id:0, users:1}).toArray(function(err, res) {
            if (err) throw err;

            console.log("DB RES: ", res);
            if (res)
            {
                response.send(JSON.stringify({ok:"true", value:res[0].users}));
            }
            else 
            {
                response.send(JSON.stringify({ok:"true", value:[]}));
            }
        });
    }

    this.set_db = function (db){
        this.db = db;
    }

    return this;
}
