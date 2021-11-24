var express = require('express');
var router = express.Router();

var Staff = require('../models/staff');
var Complaint = require('../models/complaint');
var Student = require('../models/student');

var auth = require('./auth');
var controller = require('../controllers/controller');

/* GET users listing. */
 router.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

router.get('/login', function(req, res) {
  res.render('login', {title: 'Login'});
});

router.get('/register', function(req, res) {
  res.render('register', {title: 'Registration'});
});

router.get('/student_register', function(req, res) {
  res.render('student_register', {title: 'Student Registration'});
});

router.post('/student_register', controller.student_register);

router.get('/staff_register', function(req, res) {
  res.render('staff_register', {title: 'Staff Registration'});
});

router.post('/staff_register', auth.optional, controller.staff_register);

router.get('/login/staff_login', function(req, res) {
  res.render('staff_login', {title: 'Staff Login'});
});

router.post('/login/staff_login', auth.optional, controller.staff_login);

router.get('/login/student_login', function(req, res) {
  res.render('student_login', {title: 'Student Login'});
});

// router.post('/login/student_login', auth.optional, controller.student_login);


// router.get('/student/:id/', controller.student_page);

// router.get('/staff/:id/', controller.staff_page);

router.get('/about_website', function(req, res) {
  res.render('about_website', { title: 'About Website'});
});

router.get('/staff_list', function(req, res) {

  Staff.find()
      .sort([['emp', 'ascending']])
      .exec(function (err, list_staff) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('staff_list', { title: 'Staff List', staff_list: list_staff });
      });

});

router.get('/complains/student_complains', auth.required, controller.student_complains);

router.get('/complains/staff_complains', auth.required, controller.staff_complains);

router.get('/complains', function(req, res) {
  res.render('complains', { title: 'Complains' });
});

router.get('/complain_list', function(req, res) {

  Complaint.find()
    .sort([['ascending']])
    .exec(function (err, list_complaint) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('complain_list', { title: 'Complaint List', complain_list: list_complaint });
  });

});

router.get('/complain_form', function(req, res) {
  res.render('complain_form', { title: 'Submit your complaint' });
});

router.post('/complain_form', controller.complain_form);


module.exports = router;
