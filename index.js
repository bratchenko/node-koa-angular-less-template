global.config = require('./config');

var koa = require('koa'),
    router = require('koa-router'),
    koaStatic = require('koa-static'),
    bodyParser = require('koa-bodyparser'),
    ejs = require('koa-ejs'),
    session = require('koa-session'),
    passport = require('koa-passport'),
    auth = require('./server/auth'),
    _ = require('lodash'),
    fs = require('fs');

var app = koa();

app.use(function *(next) {
    try {
        yield next;
    } catch (err) {
        this.status = err.status || 500;
        this.body = {
            error: err.status ? err.message : "Unexpected error"
        };

        console.log(err.stack || err);
    }
});

if (global.config.environment === 'development') {
    app.use(koaStatic(__dirname + '/client'));
    app.use(koaStatic(__dirname + '/.tmp'));
} else if (global.config.environment === 'production') {
    app.use(koaStatic(__dirname + '/client-build'));
} else {
    throw new Error("Unknown config.environment: " + global.config.environment);
}

app.use(bodyParser());

app.keys = [global.config.sessionSecret];
app.use(session());

app.use(passport.initialize());
app.use(passport.session());

ejs(app, {
    root: require('path').join(__dirname, global.config.environment === 'production' ? 'client-build' : 'client'),
    viewExt: 'ejs',
    cache: global.config.environment === 'production',
    debug: global.config.environment !== 'production',
    layout: false
});

app.use(auth.protectPath('/admin', ['/admin/login', '/admin/logout']));

app.use(router(app));

auth.initRoutes(app);

function loadRoutes(path) {
    var files = fs.readdirSync(path);
    files.forEach(function(file) {
        var curPath = path + "/" + file;
        if (fs.statSync(curPath).isDirectory()) {
            loadRoutes(curPath);
        } else {
            if (curPath.match(/\.js/)) {
                require(curPath)(app);
            }
        }
    });
}
loadRoutes(__dirname + "/routes");

app.listen(global.config.port);
console.log("Listening at port " + global.config.port);
