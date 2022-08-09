const {Schema} = require("mongoose");
module.exports = {
  MaskPosition: new Schema({
    point: {type: String},
    x_shift: {type: Number},
    y_shift: {type: Number},
    scale: {type: Number}
  })
}
