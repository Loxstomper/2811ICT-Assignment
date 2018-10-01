
module.exports = function(formidable) {

    this.db = null;

    this.upload = function(req, res) {
        var form = new formidable.IncomingForm({uploadDir: './images/users'});
        form.keepExtensions = true;

        var file_name;
        

        form.on('error', function(err) {
            res.send({ok:"false"});
            throw err;
        });

        form.on('fileBegin', function(name, file) {
            file_name = file.name;
            file.path = form.uploadDir + "/" + file.name;
        });

        form.on('file', function(field, file) {
            res.send({ok:"true"});

            // uddate db, by default all users have the default image
            // i know thihs is a bad way to do it because we need to 
            // do a database lookup/write every upload, but oh well...
            let username = file.name.split('.')[0];

            db.collection("users").updateOne({username: username}, {$set: {image:file.path}}, function(err, re) {
                if (err) throw err;

                // console.log(re);
            })
        });

        // process the image
        form.parse(req);

    }

    this.set_db = function (db){
        this.db = db;
    }

    return this;

}