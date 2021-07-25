const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    _id:  mongoose.Types.ObjectId,
    name: {type: String},
    symbol: {type: String},
    current_price: {type: Number},
    user_id: { type: mongoose.Types.ObjectId, ref: 'User' },
    stock_quantity: {type: Number}
})

module.exports = mongoose.model('Stock',stockSchema);