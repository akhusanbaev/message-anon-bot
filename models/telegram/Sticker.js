const {Schema} = require("mongoose");
const {PhotoSize} = require("./PhotoSize");
const {File} = require("./File");
const {MaskPosition} = require("./MaskPosition");
module.exports = {
  Sticker: new Schema({
    file_id: {type: String},
    file_unique_id: {type: String},
    width: {type: Number},
    height: {type: Number},
    is_animated: {type: Boolean},
    is_video: {type: Boolean},
    thumb: {type: PhotoSize},
    emoji: {type: String},
    set_name: {type: String},
    premium_animation: {type: File},
    mask_position: {type: MaskPosition},
    file_size: {type: Number}
  })
}
