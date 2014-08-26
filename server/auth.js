var
    passport = require('koa-passport'),
    users = require('./users'),
    Q = require('q'),
    LocalStrategy = require('passport-local').Strategy,
    errors = require('./errors');


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    users.findById(id)
        .then(function(user) {
            return done(null, user);
        })
        .then(null, function(err) {
            return done(err);
        });
});

passport.use(new LocalStrategy(
    {
        usernameField: 'phone',
        passwordField: 'pin'
    },
    function(phone, pin, done) {
        users.findByPhone(phone)
            .then(function(user) {
                return done(null, user || false);
            })
            .then(null, function(err) {
                return done(err);
            });
    })
);

module.exports = {
    protectAdminOnlyPath: function(path, exceptPaths) {
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
                if (this.isAuthenticated() && this.req.user && this.req.user.isAdmin) {
                    yield next;
                } else {
                    throw new errors.Unauthorized();
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
            this.redirect('/');
        });

        app.post('/login',
            passport.authenticate('local', {
                failureRedirect: '/login?failure=1'
            }),
            function* () {
                this.redirect('/');
            }
        );

        app.post('/api/login',
            function* () {
                var user, error;

                yield passport.authenticate(
                    'local',
                    {
                        usernameField: 'phone',
                        passwordField: 'pin'
                    },
                    function* (err, result, info) {
                        if (err) {
                            return error = err;
                        }
                        if (result) {
                            return user = result;
                        }
                    }
                );

                if (error) {
                    throw error;
                } else if (user) {
                    yield this.logIn(user);
                    this.body = user;
                } else {
                    throw new errors.BadRequest("User not found");
                }
            }
        );
    }
};
