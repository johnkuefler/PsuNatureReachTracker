const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicationSchema = new Schema({
    name: { type: String, required: true}
});

const Medication = mongoose.model('Med', medicationSchema);
module.exports = Medication;