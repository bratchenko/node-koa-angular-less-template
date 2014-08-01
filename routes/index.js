module.exports = function(app) {

    app.get('/', function*() {
        yield this.render('index', {
            user: this.req.user
        });
    });

};
