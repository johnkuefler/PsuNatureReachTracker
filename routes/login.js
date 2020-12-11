let passport = require('passport');
var express = require('express');
var router = express.Router();
let loginController = require('../controllers/login_controller');

router.get('/', function (req, res) {
    res.render('../views/login/login', { message: req.flash('loginMessage') });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/', //redirect to the home page
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

module.exports = router;