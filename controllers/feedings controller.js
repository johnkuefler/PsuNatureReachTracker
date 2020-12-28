const Bird = require('../models/bird');
const Feeding = require('../models/feeding');
const Medication = require('../models/medication');
const Food = require('../models/food');
const excel = require('exceljs');

exports.get_feedings = function (req, res) {
    Feeding.find({}, function (err, feedings) {
        if (err) {
            console.error(err);
        } else {
            res.render('feedings/feedings', { data: feedings, title: 'Feedings' });
        }
    })
}

exports.get_all_export_feedings = async function(req, res) {
    const feedings = await Feeding.find({}).sort({Date: 'desc'});
  
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Feedings');

    worksheet.columns = [
        {header: 'Date', key: 'Date', width: 15},
        {header: 'Animal', key: 'Bird', width: 20},
        {header: 'Food', key: 'Food', width: 16},
        {header: 'Medicine', key: 'Medicine', width: 20},
        {header: 'Goal Weight (g)', key: 'GoalWeight', width: 18},
        {header: 'Actual Weight (g)', key: 'ActualWeight', width: 18},
        {header: 'Amount Fed (g)', key: 'AmountFed', width: 17},
        {header: 'Leftover Food (g)', key: 'LeftoverFood', width: 18},
        {header: 'Weather Conditions', key: 'WeatherConditions', width: 20},
        {header: 'General Comments', key: 'GeneralComments', width: 50},
        {header: 'Training Comments', key: 'TrainingComments', width: 50}
      ];
  
    worksheet.addRows(feedings);
  
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'feedings.xlsx',
    );
    return workbook.xlsx.write(res).then(function() {
      res.status(200).end();
    });
  };

exports.get_feedings_update = async function (req, res) {

    const birds = await Bird.find({enabled: true});
    const foods = await Food.find({});
    const meds = await Medication.find({});

    Feeding.findOne({ _id: req.query._id }, function (err, feedings) {
        if (err) {
            console.log(err);
        } else {
            res.render('feedings/feedingsupdate', { data: feedings, birds: birds, foods: foods, meds: meds, title: 'Update Feeding' });
        }
    });
}

exports.get_feedings_create = async function (req, res) {
    const birds = await Bird.find({enabled: true});
    const foods = await Food.find({});
    const meds = await Medication.find({});

    res.render('feedings/feedingscreate', 
    { birds: birds, foods: foods, meds: meds, title: 'Add a Feeding' });
}

exports.post_feedings_create = function (req, res) {
   let currentUser = res.locals.user;
    let newFeedings = new Feeding({
        Date: req.body.Date,
        Bird: req.body.Bird,
        Food: req.body.Food,
        AmountFed: req.body.AmountFed,
        LeftoverFood: req.body.LeftoverFood,
        Medicine: req.body.Medicine,
        GoalWeight: req.body.GoalWeight,
        ActualWeight: req.body.ActualWeight,
        WeatherConditions: req.body.WeatherConditions,
        Feeder: res.locals.user.firstName + ' ' + res.locals.user.lastName,
        GeneralComments: req.body.GeneralComments,
        TrainingComments: req.body.TrainingComments
    });
    newFeedings.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Feeding saved');
            res.redirect('/feedings');
        }
    })
}

exports.post_feedings_update = function (req, res) {
    let enabled = false;
    if (req.body.enabled == 'on') {
        enabled = true;
    }

    newFeedings.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Feedings saved');
            res.redirect('/feedings');
        }
    })
}

exports.delete_feedings = function (req, res) {
    Feeding.findOneAndDelete({ _id: req.query._id }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/feedings')
        }
    })
}

exports.post_feedings_update = function (req, res) {
    let enabled = false;
    if (req.body.enabled == 'on') {
        enabled = true;
    }

    const updateData = {
        Date: req.body.Date,
        Bird: req.body.Bird,
        Food: req.body.Food,
        Amountfed: req.body.AmountFed,
        LeftoverFood: req.body.LeftoverFood,
        Medicine: req.body.Medicine,
        GoalWeight: req.body.GoalWeight,
        ActualWeight: req.body.ActualWeight,
        WeatherConditions: req.body.WeatherConditions,
        Feeder: res.locals.user.firstName + ' ' + res.locals.user.lastName,
        GeneralComments: req.body.GeneralComments,
        TrainingComments: req.body.TrainingComments
    };
    console.log(updateData);
    Feeding.findOneAndUpdate({ _id: req.body.id }, updateData, function (err, data) {
        if (err) {
            // handle error
            console.log(err);
        } else {
            res.redirect('/feedings');
        }
    });
};
