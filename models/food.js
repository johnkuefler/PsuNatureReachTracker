const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodSchema = new Schema(
    {
    name: { 
        type: String, 
        required: true
    },
    foodImage: {
        data: Buffer,
        contentType: String,
        required: false
    },
  },
);

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;