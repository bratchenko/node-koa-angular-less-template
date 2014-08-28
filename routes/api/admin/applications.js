module.exports = function(app) {

    var errors = require('../../../server/errors');
    var applications = require('../../../server/applications');

    app.get('/api/admin/applications', function* () {
        this.body = yield applications.find(this.request.body);
    });

    app.get('/api/admin/applications/:id', function* () {
        this.body = yield applications.findById(this.params.id);
    });

    app.post('/api/admin/applications/:id', function* () {
        var application = yield applications.findById(this.params.id);

        if (application) {
            this.body = yield applications.update(application, this.request.body);
        } else {
            throw new errors.NotFound();
        }
    });


};
