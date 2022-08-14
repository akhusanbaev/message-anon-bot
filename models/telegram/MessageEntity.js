const {Schema} = require("mongoose");
const {User} = require("./User");
module.exports = {
  MessageEntity: new Schema({
    type: {type: String},
    offset: {type: Number},
    length: {type: Number},
    url: {type: String},
    user: {type: User},
    language: {type: String},
    custom_emoji_id: {type: String}
  })
}
