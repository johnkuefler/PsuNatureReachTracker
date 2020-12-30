const mongoose = require('mongoose');
const { Schema } = mongoose;

const instructionSchema = new Schema({
    Comment: { 
        type: String, 
        required: true
    },
    Admin: { 
        type: String, required: true
    },
  },
);

const Instruction = mongoose.model('Instruction', instructionSchema);
module.exports = Instruction;