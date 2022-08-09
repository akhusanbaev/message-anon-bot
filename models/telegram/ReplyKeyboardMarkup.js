const {Schema} = require("mongoose");
const {KeyboardButton} = require("./KeyboardButton");
module.exports = {
  ReplyKeyboardMarkup: new Schema({
    keyboard: {type: [[KeyboardButton]]},
    resize_keyboard: {type: Boolean},
    one_time_keyboard: {type: Boolean},
    input_field_placeholder: {type: String},
    selective: {type: Boolean}
  })
}
