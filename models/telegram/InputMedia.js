const {Schema} = require("mongoose");
const {MessageEntity} = require("./MessageEntity");
module.exports = {
  InputMedia: new Schema({
    type: {type: String},
    media: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    thumb: {type: String},
    width: {type: Number},
    height: {type: Number},
    duration: {type: Number},
    supports_streaming: {type: Boolean},
    performer: {type: String},
    title: {type: String},
    disable_content_type_detection: {type: Boolean}
  }),
  InputMediaPhoto: new Schema({
    type: {type: String}, // photo
    media: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]}
  }),
  InputMediaVideo: new Schema({
    type: {type: String}, // video
    media: {type: String},
    thumb: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    width: {type: Number},
    height: {type: Number},
    duration: {type: Number},
    supports_streaming: {type: Boolean}
  }),
  InputMediaAnimation: new Schema({
    type: {type: String}, // animation
    media: {type: String},
    thumb: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    width: {type: Number},
    height: {type: Number},
    duration: {type: Number}
  }),
  InputMediaAudio: new Schema({
    type: {type: String}, // audio
    media: {type: String},
    thumb: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    duration: {type: Number},
    performer: {type: String},
    title: {type: String}
  }),
  InputMediaDocument: new Schema({
    type: {type: String}, // document
    media: {type: String},
    thumb: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    disable_content_type_detection: {type: Boolean}
  }),
}
