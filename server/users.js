module.exports = {
    findById: findUserById,
    findByPhone: findUserByPhone,
    update: updateUser,
    create: createUser
};

var
    mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    phone: String,

    isAdmin: Boolean
});

var User = mongoose.connection.model('User', UserSchema);

_createDefaultUserIfNoUsersExist();

function findUserById(id) {
    return User.findById(id).exec();
}

function findUserByPhone(phone) {
    return User.findOne({
        phone: phone
    }).exec();
}

function createUser(userData) {
    var user = new User(_validateUserData(userData));
    return user.save();
}

function updateUser(user, userData) {
    user.set(_validateUserData(userData));
    return user.save();
}

function _validateUserData(data) {
    var result = {};
    if (typeof data.phone !== 'undefined') {
        result.phone = data.phone;
    }
    if (typeof data.isAdmin !== 'undefined') {
        result.isAdmin = data.isAdmin;
    }
    return result;
}

function _createDefaultUserIfNoUsersExist() {
    User.count().exec()
        .then(function(count) {
            if (count === 0) {
                return createUser({
                        phone: '1',
                        isAdmin: true
                    });
            }
        })
        .then(null, function(err) {
            console.log(err);
        });
}

