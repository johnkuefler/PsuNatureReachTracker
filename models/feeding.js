const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedingsSchema = new Schema({
    Date: { type: Date, required: true, default: Date.now},
    Bird: { type: String, required: true},
	Food: { type: String, required: true},
	AmountFed: { type: String, required: true},
	LeftoverFood: { type: String, required: true},
	Medicine: { type: String, required: false},
	GoalWeight: { type: String, required: false},
	ActualWeight: { type: String, required: false},
	WeatherConditions: { type: String, required: true},
	DailyHighTemperature: {type: String, required: true},
	DailyLowTemperature: {type: String, required: true},
	Feeder: { type: String, required: true},
	GeneralComments: { type: String, required: false},
	TrainingComments: { type: String, required: false},
});

const feedings = mongoose.model('Feeding', feedingsSchema);
module.exports = feedings;