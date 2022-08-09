const {Schema} = require("mongoose");
const {WebAppInfo} = require("./WebAppInfo");
module.exports = {
  MenuButton: new Schema({
    type: {type: String},
    text: {type: String},
    web_app: {type: WebAppInfo}
  }),
  MenuButtonCommands: new Schema({
    type: {type: String}, // commands
  }),
  MenuButtonWebApp: new Schema({
    type: {type: String}, // web_app
    text: {type: String},
    web_app: {type: WebAppInfo}
  }),
  MenuButtonDefault: new Schema({
    type: {type: String}, // default
  })
}
