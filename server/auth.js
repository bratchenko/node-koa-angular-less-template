var
    passport = require('koa-passport'),
    LocalStrategy = require('passport-local').Strategy,
    errors = require('./errors');

// Remove this for production
var user = { id: 1, username: 'admin', password: 'password' };

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
    if (username === user.username && password === user.password) {
        done(null, user);
    } else {
        done(null, false);
    }
}));

module.exports = {
    protectPath: function(path, exceptPaths) {
        return function* (next) {
            var pathNeedsProtection;

            if (path.test) {
                // It's regexp
                pathNeedsProtection = path.test(this.request.path);
            } else {
                pathNeedsProtection = this.request.path.substring(0, path.length) === path;
            }

            if (exceptPaths && exceptPaths.indexOf(this.request.path) !== -1) {
                pathNeedsProtection = false;
            }

            if (pathNeedsProtection) {
                if (this.isAuthenticated()) {
                    yield next;
                } else {
                    if (this.request.path.match(/^\/api/)) {
                        throw new errors.Unauthorized();
                    } else {
                        this.redirect('/login');
                    }
                }
            } else {
                yield next;
            }
        };
    },
    initRoutes: function(app) {
        app.get('/login', function* () {
            yield this.render('login', {
                failure: this.request.query.failure
            });
        });

        app.get('/logout', function* (){
            this.logout();
            this.redirect('/login');
        });

        app.post('/login',
            passport.authenticate('local', {
                failureRedirect: '/login?failure=1'
            }),
            function* () {
                this.redirect('/');
            }
        );
    }
};
