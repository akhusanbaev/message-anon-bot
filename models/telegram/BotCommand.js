const {Schema} = require("mongoose");
module.exports = {
  BotCommand: new Schema({
    command: {type: String},
    description: {type: String}
  })
}
