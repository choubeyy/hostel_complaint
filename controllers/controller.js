var Complaint = require('../models/complaint');
var Student = require('../models/student');
var Staff = require('../models/staff');

const { body, validationResult } = require('express-validator');

var async = require('async');

exports.student_register = function(req, res, next) {
    var student = new Student({
        name: req.body.name,
        roll: req.body.roll,
        hash: req.body.hash,
        room_no: req.body.room_no
    });

    student.save(function (err, results) {
        if (err) { return next(err); }
        
        res.redirect('/users/student_login');
    });
};

exports.staff_register =  (req, res) => {


    if(!req.body.emp) {
    return res.status(422).json({
        errors: {
        emp: 'is required',
        },
    });
    }

    if(!req.body.hash) {
    return res.status(422).json({
        errors: {
        password: 'is required',
        },
    });
    }

    if(!req.body.name) {
    return res.status(422).json({
        errors: {
        name: 'is required',
        },
    });
    }

    if(!req.body.mobile) {
    return res.status(422).json({
        errors: {
        mobile: 'is required',
        },
    });
    }

    const finalStaff = new Staff(req.body);

    finalStaff.setPassword(req.body.hash);

    return finalStaff.save()
    .then(() => res.json({ staff: finalStaff.toAuthJSON() }));
};

exports.staff_login = (req, res) => {
    const { body: { staff } } = req;

    if(!staff.emp) {
      return res.status(422).json({
        errors: {
          emp: 'is required',
        },
      });
    }
  
    if(!staff.hash) {
      return res.status(422).json({
        errors: {
          hash: 'is required',
        },
      });
    }
  
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }
  
      if(passportUser) {
        const staff = passportUser;
        staff.token = passportUser.generateJWT();
  
        return res.json({ staff: staff.toAuthJSON() });
      }
  
      return status(400).info;
    })(req, res, next);
};

exports.staff_complains = (req, res, next) => {
  const { payload: { id } } = req;

  return Staff.findById(id)
    .then((staff) => {
      if(!staff) {
        return res.sendStatus(400);
      }

      return res.json({ staff: staff.toAuthJSON() });
    });
};

exports.student_complains = (req, res, next) => {

};

exports.complain_form = (req, res, next) => {
    var st = Student.find(Number(req.body.roll));
    var complaint = new Complaint({
      query: req.body.query,
      student: st
    });

    complaint.save();
    // Successful, so render.
    res.redirect('/users/complain_list');
};