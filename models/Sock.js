const { Schema, model } = require('mongoose');

const sockSchema = new Schema(
    {
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        cost: {
            type: Number,
            default: 0
        },
        image: String,
        story: String,
        size: String,
        material: String,
        colorPattern: String
    },
    {
        timeseries: true
    }
)

module.exports = model('Sock', sockSchema)