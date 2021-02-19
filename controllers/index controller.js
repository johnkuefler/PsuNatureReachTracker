const Instruction = require('../models/instruction');
const User = require('../models/user');
const Sentry = require("@sentry/node");

exports.get_index = function (req, res) {
    Instruction.find({}, function (err, instructions) {
        if (res.locals.user.passwordIsExpired) {
            res.redirect('/reset');
        } else {
            res.render('index', { data: instructions});
        }
    })
}

exports.get_reset = function (req, res) {
    res.render('login/reset')
}

exports.post_reset = function (req, res) {
    const user = new User();
    const updateData = {
        password: user.generateHash(req.body.confirmPassword),
        passwordIsExpired: false
    };

    console.log(updateData);

    User.findOneAndUpdate({ _id: res.locals.user._id }, updateData, function (err, data) {
        if (err) {
            Sentry.captureException(err);
        } else {
            res.redirect('/login');
        }
    });
}