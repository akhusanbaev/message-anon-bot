const {Schema} = require("mongoose");
const {User} = require("./User");
const {Chat} = require("./Chat");
const {MessageEntity} = require("./MessageEntity");
const {Animation} = require("./Animation");
const {Audio} = require("./Audio");
const {PhotoSize} = require("./PhotoSize");
const {Sticker} = require("./Sticker");
const {Video} = require("./Video");
const {VideoNote} = require("./VideoNote");
const {Voice} = require("./Voice");
const {Contact} = require("./Contact");
const {Dice} = require("./Dice");
const {Game} = require("./Game");
const {Poll} = require("./Poll");
const {Venue} = require("./Venue");
const {Location} = require("./Location");
const {MessageAutoDeleteTimerChanged} = require("./MessageAutoDeleteTimerChanged");
const {Invoice} = require("./Invoice");
const {SuccessfulPayment} = require("./SuccessfulPayment");
const {PassportData} = require("./PassportData");
const {ProximityAlertTriggered} = require("./ProximityAlertTriggered");
const {VideoChatScheduled} = require("./VideoChatScheduled");
const {VideoChatStarted} = require("./VideoChatStarted");
const {VideoChatEnded} = require("./VideoChatEnded");
const {VideoChatParticipantsInvited} = require("./VideoChatParticipantsInvited");
const {WebAppData} = require("./WebAppData");
const {InlineKeyboardMarkup} = require("./InlineKeyboardMarkup");
const {Document} = require("./Document");
module.exports = {
  Message: new Schema({
    message_id: {type: Number},
    from: {type: User},
    sender_chat: {type: Chat},
    date: {type: Number},
    chat: {type: Chat},
    forward_from: {type: User},
    forward_from_chat: {type: Chat},
    forward_from_message_id: {type: Number},
    forward_signature: {type: String},
    forward_sender_name: {type: String},
    forward_date: {type: Number},
    is_automatic_forward: {type: Boolean},
    reply_to_message: {type: Object},
    via_bot: {type: User},
    edit_date: {type: Number},
    has_protected_content: {type: Boolean},
    media_group_id: {type: Number},
    author_signature: {type: String},
    text: {type: String},
    entities: {type: [MessageEntity]},
    animation: {type: Animation},
    audio: {type: Audio},
    document: {type: Document},
    photo: {type: [PhotoSize]},
    sticker: {type: Sticker},
    video: {type: Video},
    video_note: {type: VideoNote},
    voice: {type: Voice},
    caption: {type: String},
    caption_entities: {type: [MessageEntity]},
    contact: {type: Contact},
    dice: {type: Dice},
    game: {type: Game},
    poll: {type: Poll},
    venue: {type: Venue},
    location: {type: Location},
    new_chat_members: {type: [User]},
    left_chat_member: {type: User},
    new_chat_title: {type: String},
    new_chat_photo: {type: [PhotoSize]},
    delete_chat_photo: {type: Boolean},
    group_chat_created: {type: Boolean},
    supergroup_chat_created: {type: Boolean},
    channel_chat_created: {type: Boolean},
    message_auto_delete_timer_changed: {type: MessageAutoDeleteTimerChanged},
    migrate_to_chat_id: {type: Number},
    migrate_from_chat_id: {type: Number},
    pinned_message: {type: Object},
    invoice: {type: Invoice},
    successful_payment: {type: SuccessfulPayment},
    connected_website: {type: String},
    passport_data: {type: PassportData},
    proximity_alert_triggered: {type: ProximityAlertTriggered},
    video_chat_scheduled: {type: VideoChatScheduled},
    video_chat_started: {type: VideoChatStarted},
    video_chat_ended: {type: VideoChatEnded},
    video_chat_participants_invited: {type: VideoChatParticipantsInvited},
    web_app_data: {type: WebAppData},
    reply_markup: {type: InlineKeyboardMarkup}
  })
}
