const {PhotoSize} = require("./telegram/PhotoSize");
const {Location} = require("./telegram/Location");
const {MessageId} = require("./telegram/MessageId");
const {PollOption} = require("./telegram/PollOption");
const {Poll} = require("./telegram/Poll");
const {WebAppData} = require("./telegram/WebAppData");
const {WebAppInfo} = require("./telegram/WebAppInfo");
const {MessageAutoDeleteTimerChanged} = require("./telegram/MessageAutoDeleteTimerChanged");
const {VideoChatScheduled} = require("./telegram/VideoChatScheduled");
const {VideoChatStarted} = require("./telegram/VideoChatStarted");
const {VideoChatEnded} = require("./telegram/VideoChatEnded");
const {VideoChatParticipantsInvited} = require("./telegram/VideoChatParticipantsInvited");
const {UserProfilePhotos} = require("./telegram/UserProfilePhotos");
const {File} = require("./telegram/File");
const {KeyboardButtonPollType} = require("./telegram/KeyboardButtonPollType");
const {ReplyKeyboardMarkup} = require("./telegram/ReplyKeyboardMarkup");
const {ReplyKeyboardRemove} = require("./telegram/ReplyKeyboardRemove");
const {InlineKeyboardMarkup} = require("./telegram/InlineKeyboardMarkup");
const {LoginUrl} = require("./telegram/LoginUrl");
const {ChatPhoto} = require("./telegram/ChatPhoto");
const {ChatAdministratorRights} = require("./telegram/ChatAdministratorRights");
const {ChatPermissions} = require("./telegram/ChatPermissions");
const {BotCommand} = require("./telegram/BotCommand");
const {BotCommandScope, BotCommandScopeDefault, BotCommandScopeAllPrivateChats, BotCommandScopeAllGroupChats,
  BotCommandScopeAllChatAdministrators, BotCommandScopeChat, BotCommandScopeChatAdministrators,
  BotCommandScopeChatMember
} = require("./telegram/BotCommandScope");
const {ResponseParameters} = require("./telegram/ResponseParameters");
const {InputMedia, InputMediaPhoto, InputMediaVideo, InputMediaAnimation, InputMediaAudio, InputMediaDocument} = require("./telegram/InputMedia");
const {MaskPosition} = require("./telegram/MaskPosition");
const {InputMessageContent, InputTextMessageContent, InputLocationMessageContent, InputVenueMessageContent,
  InputContactMessageContent, InputInvoiceMessageContent
} = require("./telegram/InputMessageContent");
const {ForceReply} = require("./telegram/ForceReply");
const {SentWebAppMessage} = require("./telegram/SentWebAppMessage");
const {LabeledPrice} = require("./telegram/LabeledPrice");
const {Invoice} = require("./telegram/Invoice");
const {ShippingAddress} = require("./telegram/ShippingAddress");
const {ShippingOption} = require("./telegram/ShippingOption");
const {PassportData} = require("./telegram/PassportData");
const {PassportFile} = require("./telegram/PassportFile");
const {EncryptedCredentials} = require("./telegram/EncryptedCredentials");
const {PassportElementError} = require("./telegram/PassportElementError");
const {PassportElementErrorDataField} = require("./telegram/PassportElementErrorDataField");
const {PassportElementErrorFrontSide} = require("./telegram/PassportElementErrorFrontSide");
const {PassportElementErrorReverseSide} = require("./telegram/PassportElementErrorReverseSide");
const {PassportElementErrorSelfie} = require("./telegram/PassportElementErrorSelfie");
const {PassportElementErrorFile} = require("./telegram/PassportElementErrorFile");
const {PassportElementErrorFiles} = require("./telegram/PassportElementErrorFiles");
const {PassportElementErrorTranslationFile} = require("./telegram/PassportElementErrorTranslationFile");
const {PassportElementErrorTranslationFiles} = require("./telegram/PassportElementErrorTranslationFiles");
const {PassportElementErrorUnspecified} = require("./telegram/PassportElementErrorUnspecified");
const {Animation} = require("./telegram/Animation");
const {ChatLocation} = require("./telegram/ChatLocation");
const {Venue} = require("./telegram/Venue");
const {CallbackGame} = require("./telegram/CallbackGame");
const {OrderInfo} = require("./telegram/OrderInfo");
const {EncryptedPassportElement} = require("./telegram/EncryptedPassportElement");
const {SuccessfulPayment} = require("./telegram/SuccessfulPayment");
const {Audio} = require("./telegram/Audio");
const {Document} = require("./telegram/Document");
const {Sticker} = require("./telegram/Sticker");
const {StickerSet} = require("./telegram/StickerSet");
const {Video} = require("./telegram/Video");
const {VideoNote} = require("./telegram/VideoNote");
const {Voice} = require("./telegram/Voice");
const {Contact} = require("./telegram/Contact");
const {Dice} = require("./telegram/Dice");
const {User} = require("./telegram/User");
const {Game} = require("./telegram/Game");
const {ShippingQuery} = require("./telegram/ShippingQuery");
const {ChosenInlineResult} = require("./telegram/ChosenInlineResult");
const {GameHighScore} = require("./telegram/GameHighScore");
const {PreCheckoutQuery} = require("./telegram/PreCheckoutQuery");
const {InlineQuery} = require("./telegram/InlineQuery");
const {ChatMember, ChatMemberOwner, ChatMemberAdministrator, ChatMemberMember, ChatMemberRestricted, ChatMemberLeft,
  ChatMemberBanned
} = require("./telegram/ChatMember");
const {MenuButton, MenuButtonCommands, MenuButtonWebApp, MenuButtonDefault} = require("./telegram/MenuButton");
const {ChatInviteLink} = require("./telegram/ChatInviteLink");
const {ProximityAlertTriggered} = require("./telegram/ProximityAlertTriggered");
const {KeyboardButton} = require("./telegram/KeyboardButton");
const {InlineKeyboardButton} = require("./telegram/InlineKeyboardButton");
const {MessageEntity} = require("./telegram/MessageEntity");
const {PollAnswer} = require("./telegram/PollAnswer");
const {Chat} = require("./telegram/Chat");
const {ChatMemberUpdated} = require("./telegram/ChatMemberUpdated");
const {ChatJoinRequest} = require("./telegram/ChatJoinRequest");
const {CallbackQuery} = require("./telegram/CallbackQuery");
const {InlineQueryResult, InlineQueryResultArticle, InlineQueryResultPhoto, InlineQueryResultGif,
  InlineQueryResultMpeg4Gif, InlineQueryResultVideo, InlineQueryResultAudio, InlineQueryResultVoice,
  InlineQueryResultDocument, InlineQueryResultLocation, InlineQueryResultVenue, InlineQueryResultContact,
  InlineQueryResultGame, InlineQueryResultCachedPhoto, InlineQueryResultCachedGif, InlineQueryResultCachedMpeg4Gif,
  InlineQueryResultCachedSticker, InlineQueryResultCachedDocument, InlineQueryResultCachedVideo,
  InlineQueryResultCachedVoice, InlineQueryResultCachedAudio
} = require("./telegram/InlineQueryResult");
const {Message} = require("./telegram/Message");
const {Markup} = require("./telegram/Markup");
module.exports = {
  User,
  Chat,
  Message,
  MessageId,
  MessageEntity,
  PhotoSize,
  Animation,
  Audio,
  Document,
  Video,
  VideoNote,
  Voice,
  Contact,
  Dice,
  PollOption,
  PollAnswer,
  Poll,
  Location,
  Venue,
  WebAppData,
  ProximityAlertTriggered,
  MessageAutoDeleteTimerChanged,
  VideoChatScheduled,
  VideoChatStarted,
  VideoChatEnded,
  VideoChatParticipantsInvited,
  UserProfilePhotos,
  File,
  WebAppInfo,
  ReplyKeyboardMarkup,
  KeyboardButton,
  KeyboardButtonPollType,
  ReplyKeyboardRemove,
  InlineKeyboardMarkup,
  InlineKeyboardButton,
  LoginUrl,
  CallbackQuery,
  ForceReply,
  ChatPhoto,
  ChatInviteLink,
  ChatAdministratorRights,
  ChatMember,
  ChatMemberOwner,
  ChatMemberAdministrator,
  ChatMemberMember,
  ChatMemberRestricted,
  ChatMemberLeft,
  ChatMemberBanned,
  ChatMemberUpdated,
  ChatJoinRequest,
  ChatPermissions,
  ChatLocation,
  BotCommand,
  BotCommandScope,
  BotCommandScopeDefault,
  BotCommandScopeAllPrivateChats,
  BotCommandScopeAllGroupChats,
  BotCommandScopeAllChatAdministrators,
  BotCommandScopeChat,
  BotCommandScopeChatAdministrators,
  BotCommandScopeChatMember,
  MenuButton,
  MenuButtonCommands,
  MenuButtonWebApp,
  MenuButtonDefault,
  ResponseParameters,
  InputMedia,
  InputMediaPhoto,
  InputMediaVideo,
  InputMediaAnimation,
  InputMediaAudio,
  InputMediaDocument,
  Sticker,
  StickerSet,
  MaskPosition,
  InlineQuery,
  InlineQueryResult,
  InlineQueryResultArticle,
  InlineQueryResultPhoto,
  InlineQueryResultGif,
  InlineQueryResultMpeg4Gif,
  InlineQueryResultVideo,
  InlineQueryResultAudio,
  InlineQueryResultVoice,
  InlineQueryResultDocument,
  InlineQueryResultLocation,
  InlineQueryResultVenue,
  InlineQueryResultContact,
  InlineQueryResultGame,
  InlineQueryResultCachedPhoto,
  InlineQueryResultCachedGif,
  InlineQueryResultCachedMpeg4Gif,
  InlineQueryResultCachedSticker,
  InlineQueryResultCachedDocument,
  InlineQueryResultCachedVideo,
  InlineQueryResultCachedVoice,
  InlineQueryResultCachedAudio,
  InputMessageContent,
  InputTextMessageContent,
  InputLocationMessageContent,
  InputVenueMessageContent,
  InputContactMessageContent,
  InputInvoiceMessageContent,
  ChosenInlineResult,
  SentWebAppMessage,
  LabeledPrice,
  Invoice,
  ShippingAddress,
  OrderInfo,
  ShippingOption,
  SuccessfulPayment,
  ShippingQuery,
  PreCheckoutQuery,
  PassportData,
  PassportFile,
  EncryptedPassportElement,
  EncryptedCredentials,
  PassportElementError,
  PassportElementErrorDataField,
  PassportElementErrorFrontSide,
  PassportElementErrorReverseSide,
  PassportElementErrorSelfie,
  PassportElementErrorFile,
  PassportElementErrorFiles,
  PassportElementErrorTranslationFile,
  PassportElementErrorTranslationFiles,
  PassportElementErrorUnspecified,
  Game,
  CallbackGame,
  GameHighScore,
  Markup
}
