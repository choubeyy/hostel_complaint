var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var StudentSchema = new Schema({
    name: {type: String, required: true, minlength: 1},
    roll: {type: Number, required: true, length: 7, unique: true},
    room_no: {type: String, required: true, length: 4},
    hash: {type: String, required: true, minlength: 5},
    salt: {type: String}
});

StudentSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

StudentSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

StudentSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        roll: this.roll,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

StudentSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        roll: this.roll,
        token: this.generateJWT(),
    };
}

StudentSchema.virtual('url').get(function() {
    return '/student/' + this._id;
});

StudentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Student', StudentSchema);