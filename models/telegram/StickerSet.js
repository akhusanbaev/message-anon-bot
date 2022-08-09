const {Schema} = require("mongoose");
const {Sticker} = require("./Sticker");
const {PhotoSize} = require("./PhotoSize");
module.exports = {
  StickerSet: new Schema({
    name: {type: String},
    title: {type: String},
    is_animated: {type: Boolean},
    is_video: {type: Boolean},
    contains_masks: {type: Boolean},
    stickers: {type: [Sticker]},
    thumb: {type: PhotoSize}
  })
}
