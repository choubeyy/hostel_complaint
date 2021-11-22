var mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;


var StaffSchema = new Schema({
    name: { type: String, maxLength: 100, required: true},
    emp: {type: Number, length: 3, required: true, unique: true},
    salt: {type: String},
    hash: {type: String, required: true, minlength: 5},
    mobile: {type: Number, length: 10}
});

StaffSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

StaffSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

StaffSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        emp: this.emp,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

StaffSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        emp: this.emp,
        token: this.generateJWT(),
    };
}

StaffSchema.virtual('url').get(function() {
    return '/staff/' + this._id;
});

module.exports = mongoose.model('Staff', StaffSchema);