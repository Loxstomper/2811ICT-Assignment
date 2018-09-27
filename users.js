module.exports = function() {
    this.db = null;

    this.create_user = function(username, email, response){
        // check if username exists
        db.collection("users").findOne({username:username}, function(err, res) {
            if (err) throw err;

            if (res) {
                response.send(JSON.stringify({ok:"false", error:"username: " + username + " already exists."}));
            }
            else
            {
                let to_add = {username:username, email:email, password:"123"};

                db.collection("users").insert(to_add, function(err, res) {
                    if (err) throw err;

                    console.log("INSERTED")

                    response.send(JSON.stringify({ok:"true"}));
                })
            }
        })
    }

    this.set_db = function (db){
        this.db = db;
    }

    return this;
}
