// checks the see if the user exists

module.exports = function() {
    this.db = null;

    this.login = function(username, password, response){
        // database query to check if username is there and the passwords match
        db.collection("users").findOne({username:username}, function(err, res) {
            if (err) throw err;

            if (res) {
                // now check the passwords match
                if (password !== res['password'])
                {
                    response.send(JSON.stringify({ok:"false", error:"passwords dont match."}));
                }
                else
                {
                    response.send(JSON.stringify({ok:"true"}));
                }
            }
            else
            {
                response.send(JSON.stringify({ok:"false", error:"username: " + username + " does not exist."}));
            }
        })


    }

    this.set_db = function (db){
        this.db = db;
    }

    return this;
}

