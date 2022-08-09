const {Schema} = require("mongoose");
module.exports = {
  Invoice: new Schema({
    title: {type: String},
    description: {type: String},
    start_parameter: {type: String},
    currency: {type: String},
    total_amount: {type: Number}
  })
}
