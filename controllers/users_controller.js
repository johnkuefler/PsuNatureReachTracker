const User = require('../models/user');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const excel = require('exceljs');

exports.get_users = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        User.find({}, function (err, users) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/users/users', { data: users });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.get_create_user = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        res.render('settings/users/userscreate');
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.get_update_user = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        User.findOne({ _id: req.query._id }, function (err, user) {

            if (err) {
                console.log(err);
            } else {
                res.render('settings/users/usersupdate', { data: user, title: 'Update User' });
            }
        });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.post_update_user = function (req, res) {
    let Enabled = false;
    if (req.body.Enabled == 'on') {
        Enabled = true;
    }
    const user = new User();
    const updateData = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        Enabled: Enabled,
        role: req.body.role
    };

    if (req.body.password) {
        updateData.password = user.generateHash(req.body.password);
        updateData.passwordIsExpired = true
    }

    console.log(updateData);
    User.findOneAndUpdate({ _id: req.body.id }, updateData, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            res.redirect('/settings/users');
        }
    });
}

exports.post_create_user = function (req, res) {
    let enabled = false;
    if (req.body.Enabled == 'on') {
        enabled = true;
    }

    const user = new User();

    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.password = user.generateHash(req.body.password);
    user.role = req.body.role;
    user.passwordIsExpired = true;
    user.Enabled = enabled;
    user.profileImage.data = "";
    user.profileImage.contentType = "";

    user.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('User saved!');
            res.redirect('/settings/users');
        }
    })

}

exports.get_all_export_users = async function(req, res) {
    const users = await User.find({}).sort({});
  
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
        {header: 'Email', key: 'email', width: 15},
        {header: 'First Name', key: 'firstName', width: 20},
        {header: 'Last Name', key: 'lastName', width: 16},
        {header: 'Register Date', key: 'registerDate', width: 16},
        {header: 'Role', key: 'role', width: 16},
      ];
  
    worksheet.addRows(users);
  
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'users.xlsx',
    );
    return workbook.xlsx.write(res).then(function() {
      res.status(200).end();
    });
  };

exports.delete_user = function (req, res) {
    User.findOneAndDelete({ _id: req.query._id }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/settings/users')
        }
    })
}

exports.put_update_user_image = function (req, res) {
    var obj = {
        img: {
            data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    const updateUser = {
        profileImage: obj.img
    };

    console.log(updateUser);
    
    fs.unlinkSync(path.join('./public/uploads/' + req.file.filename));

    User.findOneAndUpdate({ _id: req.body.id }, updateUser, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            console.log("image uploaded successfully");
            res.redirect('/settings/users');
        }
    });
};

exports.get_update_user_image = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        User.findOne({_id: req.query._id}, function (err, user) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/users/addprofilepicture', { data: user });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

