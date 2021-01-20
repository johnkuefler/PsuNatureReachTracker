const Bird = require('../models/bird');
const Food = require('../models/food');
const Medication = require('../models/medication');
const excel = require('exceljs');
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
        res.render('settings/meds/medscreate', { title: 'Create Medication' });
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

    const bird = new Bird();

bird.species = req.body.species;
bird.nickName = req.body.nickname;
bird.enabled = enabled;
bird.animalImage.data = "";
bird.animalImage.contentType = "";

    bird.save(function (err) {
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


const medication = new Medication();

medication.name = req.body.nameofmedication;
medication.medicationImage.data = "";
medication.medicationImage.contentType = "";

console.log(medication);

    medication.save(function (err) {
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

exports.get_all_export_birds = async function(req, res) {
    const birds = await Bird.find({}).sort({});
  
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Animals');

    worksheet.columns = [
        {header: 'Species', key: 'species', width: 15},
        {header: 'Nickname', key: 'nickName', width: 20},
        {header: 'Enabled', key: 'enabled', width: 16},
       
      ];
  
    worksheet.addRows(birds);
  
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'animals.xlsx',
    );
    return workbook.xlsx.write(res).then(function() {
      res.status(200).end();
    });
  };

exports.get_all_export_meds = async function(req, res) {
    const medications = await Medication.find({}).sort({});
  
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Medications');

    worksheet.columns = [
        {header: 'Medication Name', key: 'name', width: 17}, 
      ];
  
    worksheet.addRows(medications);
  
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'medications.xlsx',
    );
    return workbook.xlsx.write(res).then(function() {
      res.status(200).end();
    });
  };

exports.get_all_export_foods = async function(req, res) {
    const foods = await Food.find({}).sort({});
  
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Foods');

    worksheet.columns = [
        {header: 'Food Name', key: 'name', width: 15},  
      ];
  
    worksheet.addRows(foods);
  
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'foods.xlsx',
    );
    return workbook.xlsx.write(res).then(function() {
      res.status(200).end();
    });
  };

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

    console.log(updateFood);
    
    fs.unlinkSync(path.join('./public/uploads/' + req.file.filename));

    Food.findOneAndUpdate({ _id: req.body.id }, updateFood, function (err, data) {
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
        Food.findOne({_id: req.query._id}, function (err, foods) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/foods/addfoodpicture', { data: foods });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

//upload medication image function
exports.put_update_med_image = function (req, res) {
    var obj = {
        img: {
            data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    const updateMedication = {
        medicationImage: obj.img
    };

    console.log(updateMedication);
    
    fs.unlinkSync(path.join('./public/uploads/' + req.file.filename));

    Medication.findOneAndUpdate({ _id: req.body.id }, updateMedication, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            console.log("image uploaded successfully");
            res.redirect('/settings/meds');
        }
    });
};

//find addmedicationpicture view
exports.get_update_med_image = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Medication.findOne({_id: req.query._id}, function (err, meds) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/meds/addmedicationpicture', { data: meds });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}

//upload medication image function
exports.put_update_bird_image = function (req, res) {
    var obj = {
        img: {
            data: fs.readFileSync(path.join('.\\public\\uploads\\' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    const updateAnimal = {
        animalImage: obj.img
    };

    console.log(updateAnimal);
    
    fs.unlinkSync(path.join('.\\public\\uploads\\' + req.file.filename));

    Bird.findOneAndUpdate({ _id: req.body.id }, updateAnimal, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            console.log("image uploaded successfully");
            res.redirect('/settings/birds');
        }
    });
};

//find addanimalpicture view
exports.get_update_bird_image = function (req, res) {
    let currentUser = res.locals.user;
    if (currentUser.role === "Admin") {
        Bird.findOne({_id: req.query._id}, function (err, birds) {
            if (err) {
                console.error(err);
            } else {
                res.render('settings/birds/addanimalpicture', { data: birds });
            }
        })
    } else {
        res.render('error');
        console.log('You do not have permission to this page.')
    }
}