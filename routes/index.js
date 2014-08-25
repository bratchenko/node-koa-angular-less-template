module.exports = function(app) {

    function* renderIndex() {
        yield this.render('index', {
            user: this.req.user
        });
    }

    app.get('/', renderIndex);
    app.get('/application', renderIndex);
    app.get('/application/payment', renderIndex);
    app.get('/application/next-action', renderIndex);
    app.get('/status', renderIndex);

};
