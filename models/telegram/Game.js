const {Schema} = require("mongoose");
const {PhotoSize} = require("./PhotoSize");
const {MessageEntity} = require("./MessageEntity");
const {Animation} = require("./Animation");
module.exports = {
  Game: new Schema({
    title: {type: String},
    description: {type: String},
    photo: {type: [PhotoSize]},
    text: {type: String},
    text_entities: {type: [MessageEntity]},
    animation: {type: Animation}
  })
}
