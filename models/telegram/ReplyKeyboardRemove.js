const {Schema} = require("mongoose");
module.exports = {
  ReplyKeyboardRemove: new Schema({
    remove_keyboard: {type: Boolean},
    selective: {type: Boolean}
  })
}
