const {Schema} = require("mongoose");
const {ShippingAddress} = require("./ShippingAddress");
module.exports = {
  OrderInfo: new Schema({
    name: {type: String},
    phone_number: {type: String},
    email: {type: String},
    shipping_address: {type: ShippingAddress}
  })
}
