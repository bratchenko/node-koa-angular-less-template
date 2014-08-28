module.exports = function(app) {

    function* renderAdmin() {
        yield this.render('admin', {
            user: this.req.user
        });
    }

    app.get(/^\/admin/, renderAdmin);

};
