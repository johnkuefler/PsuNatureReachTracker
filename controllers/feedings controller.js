const Bird = require('../models/bird');
const Feeding = require('../models/feeding');
const Medication = require('../models/medication');
const Food = require('../models/food');
const excel = require('exceljs');
const Sentry = require("@sentry/node");


exports.get_feedings = async function (req, res) {
    
    const getFeedings = await Feeding.find({}).sort({Date: 'desc'});
    res.render('feedings/feedings', { data: getFeedings, title: 'Feedings' });         
}

exports.get_export_feedings_page = function (req, res) {
    Feeding.find({}, function (err, feedings) {
        if (err) {
            Sentry.captureException(err);
            res.render('error',{message:'Unable to fetch export feedings page',error: err});
        } else {
            res.render('feedings/exportfeedings', { data: feedings });
        }
    });
}

exports.get_specific_export_feedings = async function(req, res) {

    const feedings = await Feeding.find({Date: {
        $gte: new Date(new Date(req.query.initialDate).setHours(00, 00, 00)),
        $lte: new Date(new Date(req.query.endDate).setHours(23, 59, 59)),
    },
}).sort({Date: 'desc'});

let displayFeedings = [];

for (let i=0; i<feedings.length; i++) {
    displayFeedings.push({
        Date: feedings[i].Date.toLocaleString("en-US", {timeZone: 'UTC'}),
        Bird: feedings[i].Bird,
        Food: feedings[i].Food,
        Medicine: feedings[i].Medicine,
        GoalWeight: feedings[i].GoalWeight,
        ActualWeight: feedings[i].ActualWeight,
        AmountFed: feedings[i].AmountFed,
        LeftoverFood: feedings[i].LeftoverFood,
        WeatherConditions: feedings[i].WeatherConditions,
        GeneralComments: feedings[i].GeneralComments,
        TrainingComments: feedings[i].TrainingComments
    })
}

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

  //set worksheet data
  worksheet.addRows(displayFeedings);

  //generate response
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

exports.get_all_export_feedings = async function(req, res) {
    const feedings = await Feeding.find({}).sort({Date: 'desc'});

    let displayFeedings = [];

    for (let i=0; i<feedings.length; i++) {
        displayFeedings.push({
            Date: feedings[i].Date.toLocaleString("en-US", {timeZone: "UTC"}),
            Bird: feedings[i].Bird,
            Food: feedings[i].Food,
            Medicine: feedings[i].Medicine,
            GoalWeight: feedings[i].GoalWeight,
            ActualWeight: feedings[i].ActualWeight,
            AmountFed: feedings[i].AmountFed,
            LeftoverFood: feedings[i].LeftoverFood,
            WeatherConditions: feedings[i].WeatherConditions,
            GeneralComments: feedings[i].GeneralComments,
            TrainingComments: feedings[i].TrainingComments
        })
    }
  
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
  
    worksheet.addRows(displayFeedings);
  
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
            Sentry.captureException(err);
            res.render('error',{message:'Unable to fetch specific update feeding page',error: err});
        } else {

            let medicine = [];
            let food = [];

            if (feedings.Medicine != null) {
                medicine = feedings.Medicine.split(", ");
            }

            if (feedings.Food != null) {
                food = feedings.Food.split(", ");
            }
            
            res.render('feedings/feedingsupdate', 
            { 
                data: feedings, 
                feedingFoods: food,  
                feedingMedicines: medicine,
                birds: birds, 
                foods: foods, 
                meds: meds, 
                title: 'Update Feeding' 
            });
        }
    });
}

exports.get_feedings_create = async function (req, res) {
    const birds = await Bird.find({enabled: true});
    const foods = await Food.find({});
    const meds = await Medication.find({});

    res.render('feedings/feedingscreate', 
    { birds: birds, foods: foods, meds: meds, title: 'Create a Feeding' });
}

exports.post_feedings_create = async function (req, res) {
    let newFeeding = await new Feeding({
        Date: req.body.Date,
        Bird: req.body.Bird,
        AmountFed: req.body.AmountFed,
        LeftoverFood: req.body.LeftoverFood,
        GoalWeight: req.body.GoalWeight,
        ActualWeight: req.body.ActualWeight,
        WeatherConditions: req.body.WeatherConditions,
        DailyHighTemperature: req.body.DailyHighTemperature,
        DailyLowTemperature: req.body.DailyLowTemperature,
        Feeder: res.locals.user.firstName + ' ' + res.locals.user.lastName,
        GeneralComments: req.body.GeneralComments,
        TrainingComments: req.body.TrainingComments
    });

    if (Array.isArray(req.body.Food)) {
        newFeeding.Food = req.body.Food.join(", ");
    } else {
        newFeeding.Food = req.body.Food;
    }

    if (Array.isArray(req.body.Medicine)) {
        newFeeding.Medicine = req.body.Medicine.join(", ");
    } else {
        newFeeding.Medicine = req.body.Medicine;
    }

    newFeeding.save(function (err) {
        if (err) {
            Sentry.captureException(err);
            res.render('error',{message:'Unable to create feeding',error: err});
        } else {
            console.log('Feeding saved');
            res.redirect('/feedings');
        }
    })
}

exports.delete_feedings = function (req, res) {
    Feeding.findOneAndDelete({ _id: req.query._id }, function (err) {
        if (err) {
            Sentry.captureException(err);
            res.render('error',{message:'Unable to delete feeding',error: err});
        } else {
            res.redirect('/feedings')
        }
    })
}

exports.post_feedings_update = function (req, res) {

    const updateData = {
        Date: req.body.Date,
        Bird: req.body.Bird,
        Amountfed: req.body.AmountFed,
        LeftoverFood: req.body.LeftoverFood,
        GoalWeight: req.body.GoalWeight,
        ActualWeight: req.body.ActualWeight,
        WeatherConditions: req.body.WeatherConditions,
        DailyHighTemperature: req.body.DailyHighTemperature,
        DailyLowTemperature: req.body.DailyLowTemperature,
        Feeder: res.locals.user.firstName + ' ' + res.locals.user.lastName,
        GeneralComments: req.body.GeneralComments,
        TrainingComments: req.body.TrainingComments
    };

    if (Array.isArray(req.body.Food)) {
        updateData.Food = req.body.Food.join(", ");
    } else {
        updateData.Food = req.body.Food;
    }

    if (Array.isArray(req.body.Medicine)) {
        updateData.Medicine = req.body.Medicine.join(", ");
    } else {
        updateData.Medicine = req.body.Medicine;
    }
    
    Feeding.findOneAndUpdate({ _id: req.body.id }, updateData, function (err, data) {
        if (err) {
            Sentry.captureException(err);
            res.render('error',{message:'Unable to update feeding',error: err});
        } else {
            res.redirect('/feedings');
        }
    });
};
