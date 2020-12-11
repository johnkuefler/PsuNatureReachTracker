const Bird = require('../models/bird');
const Feeding = require('../models/feeding');
const Medication = require('../models/medication');
const Food = require('../models/food');

exports.get_feedings = function (req, res) {
    Feeding.find({}, function (err, feedings) {
        if (err) {
            console.error(err);
        } else {
            res.render('feedings/feedings', { data: feedings, title: 'Feedings' });
        }
    })
}

exports.export_feedings = async function (req, res) {
    let csv = '';
    const feedings = await Feeding.find({});


    feedings.forEach((feeding) => {
        csv += feeding.Date + ',' +
            feeding.Bird + ',' +
            feeding.Food + ',' +
            feeding.AmountFed + ',' +
            feeding.LeftoverFood + ',' +
            feeding.Medicine + ',' +
            feeding.GoalWeight + ',' +
            feeding.ActualWeight + ',' +
            feeding.WeatherConditions + ',' +
            feeding.Feeder + ',' +
            feeding.Comments + '\r\n'
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('feedings.csv');
    return res.send(csv);
}

exports.get_feedings_update = function (req, res) {
    Feeding.findOne({ _id: req.query._id }, function (err, feeding) {

        if (err) {
            console.log(err);
        } else {
            res.render('feedings/feedingsupdate', { data: feeding, title: 'Update Feeding' });
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
   let today = new Date();
   let currentUser = res.locals.user;
    let newFeedings = new Feeding({
        Date: today,
        Bird: req.body.Bird,
        Food: req.body.Food,
        AmountFed: req.body.AmountFed,
        LeftoverFood: req.body.LeftoverFood,
        Medicine: req.body.Medicine,
        GoalWeight: req.body.GoalWeight,
        ActualWeight: req.body.ActualWeight,
        WeatherConditions: req.body.WeatherConditions,
        Feeder: currentUser.firstName + " " + currentUser.lastName,
        Comments: req.body.Comments
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
        Bird: req.body.Bird,
        Food: req.body.Food,
        Amountfed: req.body.AmountFed,
        LeftoverFood: req.body.LeftoverFood,
        Medicine: req.body.Medicine,
        GoalWeight: req.body.GoalWeight,
        ActualWeight: req.body.ActualWeight,
        WeatherConditions: req.body.WeatherConditions,
        Feeder: req.body.Feeder,
        Comments: req.body.Comments,
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
