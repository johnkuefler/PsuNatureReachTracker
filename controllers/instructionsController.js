const Instruction = require('../models/instruction');

exports.get_instructions = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Instruction.find({}, function (err, instructions) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/instructions/instructions', { data: instructions });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}