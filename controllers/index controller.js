const Instruction = require('../models/instruction');
const User = require('../models/user');

exports.get_index = function (req, res) {
    Instruction.find({}, function (err, instructions) {
        if (res.locals.user.passwordIsExpired) {
            res.redirect('/reset');
        } else {
            console.log("this works");
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
        password: req.body.confirmPassword,
        passwordIsExpired: false
    };

    if (req.body.newPassword === req.body.confirmPassword) {
        updateData.password = user.generateHash(req.body.confirmPassword);
    }
    console.log(updateData);

    User.findOneAndUpdate({ _id: res.locals.user._id }, updateData, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
}