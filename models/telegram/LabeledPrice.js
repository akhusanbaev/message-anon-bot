const {Schema} = require("mongoose");
module.exports = {
  LabeledPrice: new Schema({
    label: {type: String},
    amount: {type: Number}
  })
}
