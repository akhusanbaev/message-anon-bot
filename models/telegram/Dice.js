const {Schema} = require("mongoose");
module.exports = {
  Dice: new Schema({
    emoji: {type: String},
    value: {type: Number}
  })
}
