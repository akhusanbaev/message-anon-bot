const {Schema} = require("mongoose");
const {LabeledPrice} = require("./LabeledPrice");
module.exports = {
  ShippingOption: new Schema({
    id: {type: String},
    title: {type: String},
    prices: {type: [LabeledPrice]}
  })
}
