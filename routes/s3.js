module.exports = function(app) {

    var crypto = require("crypto");
    var moment = require("moment");

    function createS3Policy() {
        var date = new Date(Date.now() + 60 * 1000);

        var s3Policy = {
            "expiration": moment.utc(date).toISOString(),
            "conditions": [
                ["starts-with", "$key", "uploads/"],
                {"bucket": global.config.s3.bucket},
                {"acl": "public-read"},
                ["starts-with", "$Content-Type", "image/"],
                //{"success_action_redirect": "http://example.com/uploadsuccess"},
            ]
        };

        var stringPolicy = JSON.stringify(s3Policy);
        var base64Policy = new Buffer(stringPolicy, "utf-8").toString("base64");

          // sign the base64 encoded policy
        var signature = crypto.createHmac("sha1", global.config.s3.secret)
            .update(new Buffer(base64Policy, "utf-8")).digest("base64");

          // build the results object
        return {
            key: global.config.s3.key,
            policy: base64Policy,
            signature: signature
        };
    }


    app.get('/s3/policy', function* (){
        this.body = createS3Policy();
    });

};
