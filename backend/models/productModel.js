const mongoose = require('mongoose')

const productSchema = mongoose.Schema({

    productName : String,
    brandName : String,
    category  : String,
    description: String,
    productImage :[],
    price  : Number,
    sellingPrice : Number
},{
    timestamps : true

})

const productMOdel = mongoose.model("product",productSchema)

module.exports =  productMOdel