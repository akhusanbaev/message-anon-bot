const {Schema} = require("mongoose");
const {InlineKeyboardButton} = require("./InlineKeyboardButton");
module.exports = {
  InlineKeyboardMarkup: new Schema({
    inline_keyboard: {type: [[InlineKeyboardButton]]}
  })
}
