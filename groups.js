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

    this.get_groups = function(username, response) {
        let groups = [];

        response.send(JSON.stringify({ok:"true", value:["group1", "group2"]}));

    }

    this.get_channels = function(data, response) {

        let group_name = data.group_name;
        let username = data.username;

        response.send(JSON.stringify({ok:"true", value:["channel1", "channel2"]}));
    }

    this.set_db = function (db){
        this.db = db;
    }

    return this;
}
