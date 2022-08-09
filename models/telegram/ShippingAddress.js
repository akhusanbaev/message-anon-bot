const {Schema} = require("mongoose");
module.exports = {
  ShippingAddress: new Schema({
    country_code: {type: String},
    state: {type: String},
    city: {type: String},
    street_line1: {type: String},
    street_line2: {type: String},
    post_code: {type: String}
  })
}
