const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedingsSchema = new Schema({
    Date: { type: Date, required: true, default: Date.now},
    Bird: { type: String, required: true},
	Food: { type: String, required: false},
	AmountFed: { type: String, required: false},
	LeftoverFood: { type: String, required: false},
	Medicine: { type: String, required: false},
	GoalWeight: { type: String, required: false},
	ActualWeight: { type: String, required: false},
	WeatherConditions: { type: String, required: false},
	DailyHighTemperature: {type: String, required: false},
	DailyLowTemperature: {type: String, required: false},
	Feeder: { type: String, required: true},
	GeneralComments: { type: String, required: false},
	TrainingComments: { type: String, required: false},
});

const feedings = mongoose.model('Feeding', feedingsSchema);
module.exports = feedings;