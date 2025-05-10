const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
   password: {
        type: String,
        required: true
    }
});

const ItemModel = mongoose.model('Item', itemSchema);
module.exports = ItemModel;