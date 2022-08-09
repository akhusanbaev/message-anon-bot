const {Schema} = require("mongoose");
const {InlineKeyboardButton} = require("./InlineKeyboardButton");
const {KeyboardButton} = require("./KeyboardButton");
module.exports = {
  Markup: new Schema({
    inline_keyboard: {type: [[InlineKeyboardButton]]},
    keyboard: {type: [[KeyboardButton]]},
    resize_keyboard: {type: Boolean},
    one_time_keyboard: {type: Boolean},
    input_field_placeholder: {type: String},
    selective: {type: Boolean}
  })
}
