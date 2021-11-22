const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Staff = mongoose.model('Staff');
const Student = mongoose.model('Student');

passport.use(new LocalStrategy({
  usernameField: 'user[emp]',
  passwordField: 'user[password]',
}, (emp, password, done) => {
  Staff.findOne({ emp })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'id or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done);
}));

passport.use(new LocalStrategy({
  usernameField: 'user[roll]',
  passwordField: 'user[password]',
}, (roll, password, done) => {
  Student.findOne({ roll })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'roll or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done);
}));