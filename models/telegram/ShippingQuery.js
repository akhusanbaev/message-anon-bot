const {Schema} = require("mongoose");
const {User} = require("./User");
const {ShippingAddress} = require("./ShippingAddress");
module.exports = {
  ShippingQuery: new Schema({
    id: {type: String},
    from: {type: User},
    invoice_payload: {type: String},
    shipping_address: {type: ShippingAddress}
  })
}
