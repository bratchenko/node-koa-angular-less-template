module.exports = function(app) {

    var errors = require('../../server/errors');
    var applications = require('../../server/applications');

    app.use(function*(next) {
        if (this.request.path === '/api/application' && !this.req.user) {
            throw new errors.Unauthorized();
        }

        yield next;
    });

    app.get('/api/application', function* () {
        this.body = yield applications.findByUserId(this.req.user._id);
    });

    app.post('/api/application', function* () {
        var application = yield applications.findByUserId(this.req.user._id);

        if (application) {
            this.body = yield applications.update(application, this.request.body);
        } else {
            this.body = yield applications.create(this.req.user, this.request.body);
        }
    });


};
