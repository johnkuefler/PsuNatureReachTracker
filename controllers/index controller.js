const User = require('../models/user');

exports.get_index = function (req, res) {

    if (res.locals.user.passwordIsExpired) {
        res.redirect('/reset');

    } else {
        res.render('index', { title: 'Express' });
    }
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