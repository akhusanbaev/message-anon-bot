const {Schema} = require("mongoose");
const {InputMessageContent} = require("./InputMessageContent");
const {InlineKeyboardMarkup} = require("./InlineKeyboardMarkup");
const {MessageEntity} = require("./MessageEntity");
module.exports = {
  InlineQueryResult: new Schema({
    type: {type: String},
    id: {type: String},
    title: {type: String},
    input_message_content: {type: InputMessageContent},
    reply_markup: {type: InlineKeyboardMarkup},
    url: {type: String},
    hide_url: {type: Boolean},
    description: {type: String},
    thumb_url: {type: String},
    thumb_width: {type: Number},
    thumb_height: {type: Number},
    thumb_mime_type: {type: String},
    photo_url: {type: String},
    photo_width: {type: Number},
    photo_height: {type: Number},
    gif_url: {type: String},
    gif_width: {type: Number},
    gif_height: {type: Number},
    gif_duration: {type: Number},
    mpeg4_url: {type: String},
    mpeg4_width: {type: Number},
    mpeg4_height: {type: Number},
    mpeg4_duration: {type: Number},
    video_url: {type: String},
    mime_type: {type: String},
    video_width: {type: Number},
    video_height: {type: Number},
    video_duration: {type: Number},
    audio_url: {type: String},
    audio_duration: {type: Number},
    performer: {type: String},
    voice_url: {type: String},
    voice_duration: {type: Number},
    document_url: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    horizontal_accuracy: {type: Number},
    live_period: {type: Number},
    heading: {type: Number},
    proximity_alert_radius: {type: Number},
    address: {type: String},
    foursquare_id: {type: String},
    foursquare_type: {type: String},
    google_place_id: {type: String},
    google_place_type: {type: String},
    phone_number: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    vcard: {type: String},
    game_short_name: {type: String},
    photo_file_id: {type: String},
    gif_file_id: {type: String},
    mpeg4_file_id: {type: String},
    sticker_file_id: {type: String},
    document_file_id: {type: String},
    video_file_id: {type: String},
    voice_file_id: {type: String},
    audio_file_id: {type: String},
    caption: {type: String},
    caption_entities: {type: [MessageEntity]},
  }),
  InlineQueryResultArticle: new Schema({
    type: {type: String}, // article
    id: {type: String},
    title: {type: String},
    input_message_content: {type: InputMessageContent},
    reply_markup: {type: InlineKeyboardMarkup},
    url: {type: String},
    hide_url: {type: Boolean},
    description: {type: String},
    thumb_url: {type: String},
    thumb_width: {type: Number},
    thumb_height: {type: Number}
  }),
  InlineQueryResultPhoto: new Schema({
    type: {type: String}, // photo
    id: {type: String},
    photo_url: {type: String},
    thumb_url: {type: String},
    photo_width: {type: Number},
    photo_height: {type: Number},
    title: {type: String},
    description: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultGif: new Schema({
    type: {type: String}, // gif
    id: {type: String},
    gif_url: {type: String},
    gif_width: {type: Number},
    gif_height: {type: Number},
    gif_duration: {type: Number},
    thumb_url: {type: String},
    thumb_mime_type: {type: String},
    title: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultMpeg4Gif: new Schema({
    type: {type: String}, // mpeg4_gif
    id: {type: String},
    mpeg4_url: {type: String},
    mpeg4_width: {type: Number},
    mpeg4_height: {type: Number},
    mpeg4_duration: {type: Number},
    thumb_url: {type: String},
    thumb_mime_type: {type: String},
    title: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultVideo: new Schema({
    type: {type: String}, // video
    id: {type: String},
    video_url: {type: String},
    mime_type: {type: String},
    thumb_url: {type: String},
    title: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    video_width: {type: Number},
    video_height: {type: Number},
    video_duration: {type: Number},
    description: {type: String},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultAudio: new Schema({
    type: {type: String}, // audio
    id: {type: String},
    audio_url: {type: String},
    title: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    performer: {type: String},
    audio_duration: {type: Number},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultVoice: new Schema({
    type: {type: String}, // voice
    id: {type: String},
    voice_url: {type: String},
    title: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    voice_duration: {type: Number},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultDocument: new Schema({
    type: {type: String}, // document
    id: {type: String},
    title: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    document_url: {type: String},
    mime_type: {type: String},
    description: {type: String},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent},
    thumb_url: {type: String},
    thumb_width: {type: Number},
    thumb_height: {type: Number}
  }),
  InlineQueryResultLocation: new Schema({
    type: {type: String}, // location
    id: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    title: {type: String},
    horizontal_accuracy: {type: Number},
    live_period: {type: Number},
    heading: {type: Number},
    proximity_alert_radius: {type: Number},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent},
    thumb_url: {type: String},
    thumb_width: {type: Number},
    thumb_height: {type: Number}
  }),
  InlineQueryResultVenue: new Schema({
    type: {type: String}, // venue
    id: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    title: {type: String},
    address: {type: String},
    foursquare_id: {type: String},
    foursquare_type: {type: String},
    google_place_id: {type: String},
    google_place_type: {type: String},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent},
    thumb_url: {type: String},
    thumb_width: {type: Number},
    thumb_height: {type: Number}
  }),
  InlineQueryResultContact: new Schema({
    type: {type: String}, // contact
    id: {type: String},
    phone_number: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    vcard: {type: String},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent},
    thumb_url: {type: String},
    thumb_width: {type: Number},
    thumb_height: {type: Number}
  }),
  InlineQueryResultGame: new Schema({
    type: {type: String}, // game
    id: {type: String},
    game_short_name: {type: String},
    reply_markup: {type: InlineKeyboardMarkup}
  }),
  InlineQueryResultCachedPhoto: new Schema({
    type: {type: String}, // photo
    id: {type: String},
    photo_file_id: {type: String},
    title: {type: String},
    description: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultCachedGif: new Schema({
    type: {type: String}, // gif
    id: {type: String},
    gif_file_id: {type: String},
    title: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultCachedMpeg4Gif: new Schema({
    type: {type: String}, // mpeg4_gif
    id: {type: String},
    mpeg4_file_id: {type: String},
    title: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultCachedSticker: new Schema({
    type: {type: String}, // sticker
    id: {type: String},
    sticker_file_id: {type: String},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultCachedDocument: new Schema({
    type: {type: String}, // document
    id: {type: String},
    title: {type: String},
    document_file_id: {type: String},
    description: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultCachedVideo: new Schema({
    type: {type: String}, // video
    id: {type: String},
    video_file_id: {type: String},
    title: {type: String},
    description: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultCachedVoice: new Schema({
    type: {type: String}, // voice
    id: {type: String},
    voice_file_id: {type: String},
    title: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
  InlineQueryResultCachedAudio: new Schema({
    type: {type: String}, // audio
    id: {type: String},
    audio_file_id: {type: String},
    caption: {type: String},
    parse_mode: {type: String},
    caption_entities: {type: [MessageEntity]},
    reply_markup: {type: InlineKeyboardMarkup},
    input_message_content: {type: InputMessageContent}
  }),
}
