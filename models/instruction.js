const mongoose = require('mongoose');
const { Schema } = mongoose;

const instructionSchema = new Schema({
    comment: { 
        type: String, 
        required: true
    },
  },
);

const Instruction = mongoose.model('Instruction', instructionSchema);
module.exports = Instruction;