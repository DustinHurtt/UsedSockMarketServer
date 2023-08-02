const { Schema, model } = require('mongoose');

const cartSchema = new Schema(
    {
        socks: [{type: Schema.Types.ObjectId, ref: 'Sock'}],
        subtotal: Number,
        tax: Number,
        total: Number,
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        timeLeft: Date
    },
    {
        timeseries: true
    }
)

module.exports = model('Cart', cartSchema)