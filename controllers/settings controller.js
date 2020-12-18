const Bird = require('../models/bird');
const Food = require('../models/food');
const Medication = require('../models/medication');
const User = require('../models/user');
var fs = require('fs');
var path = require('path');
var multer = require('multer');

// Main get pages
exports.get_settings = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        res.render('settings/settings', { title: 'Settings' });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

// Create get pages
exports.get_create_bird = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        res.render('settings/birds/birdscreate', { title: 'Create Bird' });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.get_create_food = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        res.render('settings/foods/foodscreate', { title: 'Create Food' });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.get_create_medication = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        res.render('settings/meds/medscreate', { title: 'Create Meds' });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

// Update get pages

exports.get_birds_update = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Bird.findOne({ _id: req.query._id }, function (err, bird) {

            if (err) {
                console.log(err);
            } else {
                res.render('settings/birds/birdsupdate', { data: bird, title: 'Update Bird' });
            }
        });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.get_foods_update = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Food.findOne({ _id: req.query._id }, function (err, food) {

            if (err) {
                console.log(err);
            } else {
                res.render('settings/foods/foodsupdate', { data: food, title: 'Update Food' });
            }
        });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.get_meds_update = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Medication.findOne({ _id: req.query._id }, function (err, med) {

            if (err) {
                console.log(err);
            } else {
                res.render('settings/meds/medsupdate', { data: med, title: 'Update Medication' });
            }
        });
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

//Update post pages
exports.post_birds_update = function (req, res) {
    let enabled = false;
    if (req.body.enabled == 'on') {
        enabled = true;
    }

    const updateData = {
        species: req.body.species,
        nickName: req.body.nickname,
        enabled: enabled
    };
    console.log(updateData);
    Bird.findOneAndUpdate({ _id: req.body.id }, updateData, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            res.redirect('/settings/birds');
        }
    });
};

exports.post_foods_update = function (req, res) {

    const updateData = {
        name: req.body.name
    };
    console.log(updateData);
    Food.findOneAndUpdate({ _id: req.body.id }, updateData, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            res.redirect('/settings/foods');
        }
    });
};

exports.post_meds_update = function (req, res) {

    const updateData = {
        name: req.body.name
    };
    console.log(updateData);
    Medication.findOneAndUpdate({ _id: req.body.id }, updateData, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            res.redirect('/settings/meds');
        }
    });
};

// Exports for data

exports.get_birds = function (req, res) {
    Bird.find({}, function (err, birds) {
        if (err) {
            console.error(err);
        } else {
            res.render('settings/birds/birds', { data: birds });
        }
    })
}

exports.post_create_bird = function (req, res) {
    let enabled = false;
    if (req.body.enabled == 'on') {
        enabled = true;
    }

    let newBird = new Bird({
        species: req.body.species,
        nickName: req.body.nickname,
        enabled: enabled
    });

    newBird.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Bird saved');
            res.redirect('/settings/birds');
        }
    })
}

exports.post_create_food = function (req, res) {

const food = new Food();

food.name = req.body.nameoffood;
food.foodImage.data = "";
food.foodImage.contentType = "";

    console.log(food);

    food.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Food saved');
            res.redirect('/settings/foods');
        }
    })
}

exports.post_create_med = function (req, res) {
    let newMed = new Medication({
        name: req.body.nameofmedication
    });

    newMed.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Medication saved');
            res.redirect('/settings/meds');
        }
    })
}

exports.get_birds = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Bird.find({}, function (err, birds) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/birds/birds', { data: birds });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.get_foods = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Food.find({}, function (err, foods) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/foods/foods', { data: foods });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.get_meds = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Medication.find({}, function (err, meds) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/meds/meds', { data: meds });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

exports.delete_bird = function (req, res) {
    Bird.findOneAndDelete({ _id: req.query._id }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/settings/birds')
        }
    })
}

exports.delete_food = function (req, res) {
    Food.findOneAndDelete({ _id: req.query._id }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/settings/foods')
        }
    })
}

exports.delete_med = function (req, res) {
    Medication.findOneAndDelete({ _id: req.query._id }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/settings/meds')
        }
    })
}

exports.export_birds = async function (req, res) {
    let csv = '';
    const birds = await Bird.find({});
    console.log(birds);

    birds.forEach((bird) => {
        csv += bird.species + ',' +
            bird.nickName + ',' +
            bird.nickName + '\r\n'
    });
    console.log(csv);

    res.header('Content-Type', 'text/csv');
    res.attachment('birds.csv');
    return res.send(csv);
}

exports.export_meds = async function (req, res) {
    let csv = '';
    const meds = await Medication.find({});


    meds.forEach((med) => {
        csv += med.name + '\r\n'
    });
    console.log(csv);
    res.header('Content-Type', 'text/csv');
    res.attachment('meds.csv');
    return res.send(csv);
}

exports.export_foods = async function (req, res) {
    let csv = '';
    const foods = await Food.find({});


    foods.forEach((food) => {
        csv += food.name + '\r\n'
    });
    console.log(csv);
    res.header('Content-Type', 'text/csv');
    res.attachment('foods.csv');
    return res.send(csv);
}

//upload food image function
exports.put_update_food_image = function (req, res) {
    var obj = {
        img: {
            data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    const updateFood = {
        foodImage: obj.img
    };

    console.log(updateUser);
    
    fs.unlinkSync(path.join('./public/uploads/' + req.file.filename));

    User.findOneAndUpdate({ _id: req.body.id }, updateFood, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            console.log("image uploaded successfully");
            res.redirect('/settings/foods');
        }
    });
};

//find addfoodpicture view
exports.get_update_food_image = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        User.findOne({_id: req.query._id}, function (err, food) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/foods/addfoodpicture', { data: food });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}