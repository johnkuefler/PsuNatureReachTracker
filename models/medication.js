const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicationSchema = new Schema({
    name: { 
        type: String, 
        required: true
    },
    medicationImage: {
        data: Buffer,
        contentType: String,
        required: false
    },
  },
);

const Medication = mongoose.model('Med', medicationSchema);
module.exports = Medication;