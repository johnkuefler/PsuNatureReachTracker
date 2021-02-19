const Instruction = require('../models/instruction');
const excel = require('exceljs');
const Sentry = require("@sentry/node");

exports.get_instructions = function (req, res) {
        Instruction.find({}, function (err, instructions) {
            if (err) {
                Sentry.captureException(err);
            } else {
                res.render('settings/instructions/instructions', { data: instructions, title: 'Instructions' });
            }
        })
    }

exports.get_create_instruction = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        res.render('settings/instructions/instructionscreate', { title: 'Create Instruction' });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.post_create_instruction = function (req, res) {
    let Enabled = false;
    if (req.body.Enabled == 'on') {
        Enabled = true;
    }

    let newInstruction = new Instruction({
        Comment: req.body.Comment,
        Enabled: Enabled,
        Admin: res.locals.user.firstName + ' ' + res.locals.user.lastName,
    });
    
        console.log(newInstruction);
    
        newInstruction.save(function (err) {
            if (err) {
                Sentry.captureException(err);
            } else {
                console.log('Instruction saved');
                res.redirect('/settings/instructions');
            }
        })
}

exports.get_instruction_update = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Instruction.findOne({ _id: req.query._id }, function (err, instruction) {
            if (err) {
                Sentry.captureException(err);
            } else {
                res.render('settings/instructions/instructionsupdate', { data: instruction, title: 'Update Instruction' });
            }
        });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.post_instruction_update = function (req, res) {
    let Enabled = false;
    if (req.body.Enabled == 'on') {
        Enabled = true;
    }
    const updateInstruction = {
        Comment: req.body.Comment,
        Enabled: Enabled,
        Admin: res.locals.user.firstName + ' ' + res.locals.user.lastName,
    };
    
        console.log(updateInstruction);

    Instruction.findOneAndUpdate({ _id: req.body.id }, updateInstruction, function (err, data) {
        if (err) {
            Sentry.captureException(err);
        } else {
            res.redirect('/settings/instructions');
        }
    });
};

exports.delete_instruction = function (req, res) {
    Instruction.findOneAndDelete({ _id: req.query._id }, function (err) {
        if (err) {
            Sentry.captureException(err);
        } else {
            res.redirect('/settings/instructions')
        }
    })
}

exports.get_all_export_instructions = async function(req, res) {
    const instructions = await Instruction.find({}).sort({});
  
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Instructions');

    worksheet.columns = [
        {header: 'Comment', key: 'Comment', width: 45},
        {header: 'Admin', key: 'Admin', width: 20}
      ];
  
    worksheet.addRows(instructions);
  
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'instructions.xlsx',
    );
    return workbook.xlsx.write(res).then(function() {
      res.status(200).end();
    });
  };

