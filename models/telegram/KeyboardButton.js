const {Schema} = require("mongoose");
const {KeyboardButtonPollType} = require("./KeyboardButtonPollType");
const {WebAppInfo} = require("./WebAppInfo");
module.exports = {
  KeyboardButton: new Schema({
    text: {type: String},
    request_contact: {type: Boolean},
    request_location: {type: Boolean},
    request_poll: {type: KeyboardButtonPollType},
    web_app: {type: WebAppInfo}
  })
}
