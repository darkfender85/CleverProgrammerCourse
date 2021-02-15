const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
    storeName: String,
    phoneNumber: String,
    address:{},
    openStatusText:String,
    addressLines: Array,
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
},{ collection: 'stores' })

storeSchema.index({location: '2dshpere' },{ sparse: true });

module.exports = mongoose.model('Store',storeSchema)