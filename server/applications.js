module.exports = {
    find: findApplications,
    findById: findApplicationById,
    findByUserId: findApplicationByUserId,
    update: updateApplication,
    create: createApplication
};

var
    mongoose = require('mongoose');

var ApplicationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true
    },

    general: {
        firstName: String,
        middleName: String,
        lastName: String,
        gender: String,
        hasMilitaryId: Boolean,
        hasPrevPassport: Boolean
    },

    passport: {
        firstPage: String,
        secondPage: String,
        registrationPage: String
    },

    taxId: {
        image: String,
        value: String
    },

    photo: {
        image: String
    },

    militaryId: {
        image: String
    },

    militaryRegistration: {
        registration: String,
        certificate: String
    },

    prevPassport: {
        image: String,
        value: String
    }
});

var Application = mongoose.connection.model('Application', ApplicationSchema);

function findApplications(params) {
    return Application.find(params).exec();
}

function findApplicationById(id) {
    return Application.findById(id).exec();
}

function findApplicationByUserId(userId) {
    return Application.findOne({
        userId: userId
    }).exec();
}

function createApplication(user, applicationData) {
    applicationData = _validateApplicationData(applicationData);
    applicationData.userId = user._id;
    var application = new Application(applicationData);
    return application.save();
}

function updateApplication(application, applicationData) {
    application.set(_validateApplicationData(applicationData));
    return application.save();
}

function _validateApplicationData(data) {
    return data;
}
