const {Schema} = require("mongoose");
const {WebAppInfo} = require("./WebAppInfo");
const {LoginUrl} = require("./LoginUrl");
const {CallbackGame} = require("./CallbackGame");
module.exports = {
  InlineKeyboardButton: new Schema({
    text: {type: String},
    url: {type: String},
    callback_data: {type: String},
    web_app: {type: WebAppInfo},
    login_url: {type: LoginUrl},
    switch_inline_query: {type: String},
    switch_inline_query_current_chat: {type: String},
    callback_game: {type: CallbackGame},
    pay: {type: Boolean}
  })
}
