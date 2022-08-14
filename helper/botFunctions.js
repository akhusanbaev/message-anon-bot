const {archiveTelegramChannel} = require("./config");
const deleteCallbackQuery = (bot, query) => async () => {
  try {
    return await bot.deleteMessage(query.message.chat.id, query.message.message_id);
  } catch (e) {
    console.log(e);
  }
}
module.exports = {
  replyMessage: (bot, msg) => async ({
    chatId, text, messageId, caption, parse_mode, keyboard, inline_keyboard, one_time_keyboard, fromChatId,
    telegramMessage, params, chat_id
  }) => {
    try {
      if (telegramMessage) {
        if (params.text) {
          const text = params.text;
          const options = {};
          let messageEntities = [];
          if (params.options.length) options.options = params.options;
          if (params.entities.length) {
            for (let i = 0; i < params.entities.length; i++) {
              const userData = {};
              if (params.entities[i].user) {
                userData.id = params.entities[i].user.id;
                if (params.entities[i].user.is_bot) userData.is_bot = params.entities[i].user.is_bot;
                if (params.entities[i].user.first_name) userData.first_name = params.entities[i].user.first_name;
                if (params.entities[i].user.last_name) userData.last_name = params.entities[i].user.last_name;
                if (params.entities[i].user.username) userData.username = params.entities[i].user.username;
                if (params.entities[i].user.language_code) userData.language_code = params.entities[i].user.language_code;
                if (params.entities[i].user.is_premium) userData.is_premium = params.entities[i].user.is_premium;
                if (params.entities[i].user.added_to_attachment_menu) userData.added_to_attachment_menu = params.entities[i].user.added_to_attachment_menu;
                if (params.entities[i].user.can_join_groups) userData.can_join_groups = params.entities[i].user.can_join_groups;
                if (params.entities[i].user.can_read_all_group_messages) userData.can_read_all_group_messages = params.entities[i].user.can_read_all_group_messages;
                if (params.entities[i].user.supports_inline_queries) userData.supports_inline_queries = params.entities[i].user.supports_inline_queries;
              }
              const nObj = {type: params.entities[i].type, offset: params.entities[i].offset, length: params.entities[i].length, url: params.entities[i].url, language: params.entities[i].language, custom_emoji_id: params.entities[i].custom_emoji_id};
              if (userData !== {}) nObj.user = userData;
              messageEntities = [...messageEntities, nObj]
            }
          }
          console.log(messageEntities);
          if (messageEntities.length) options.entities = messageEntities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendMessage(chat_id, text, options==={}?null:options);
        }
        if (params.photo) {
          const photo = params.photo;
          const options = {};
          let messageEntities = [];
          if (params.caption) options.caption = params.caption;
          if (params.options.length) options.options = params.options;
          if (params.caption_entities.length) {
            for (let i = 0; i < params.caption_entities.length; i++) {
              const userData = {};
              if (params.caption_entities[i].user) {
                userData.id = params.caption_entities[i].user.id;
                if (params.caption_entities[i].user.is_bot) userData.is_bot = params.caption_entities[i].user.is_bot;
                if (params.caption_entities[i].user.first_name) userData.first_name = params.caption_entities[i].user.first_name;
                if (params.caption_entities[i].user.last_name) userData.last_name = params.caption_entities[i].user.last_name;
                if (params.caption_entities[i].user.username) userData.username = params.caption_entities[i].user.username;
                if (params.caption_entities[i].user.language_code) userData.language_code = params.caption_entities[i].user.language_code;
                if (params.caption_entities[i].user.is_premium) userData.is_premium = params.caption_entities[i].user.is_premium;
                if (params.caption_entities[i].user.added_to_attachment_menu) userData.added_to_attachment_menu = params.caption_entities[i].user.added_to_attachment_menu;
                if (params.caption_entities[i].user.can_join_groups) userData.can_join_groups = params.caption_entities[i].user.can_join_groups;
                if (params.caption_entities[i].user.can_read_all_group_messages )userData.can_read_all_group_messages = params.caption_entities[i].user.can_read_all_group_messages;
                if (params.caption_entities[i].user.supports_inline_queries) userData.supports_inline_queries = params.caption_entities[i].user.supports_inline_queries;
              }
              const nObj = {type: params.caption_entities[i].type, offset: params.caption_entities[i].offset, length: params.caption_entities[i].length, url: params.caption_entities[i].url, language: params.caption_entities[i].language, custom_emoji_id: params.caption_entities[i].custom_emoji_id};
              if (userData !== {}) nObj.user = userData;
              messageEntities = [...messageEntities, nObj]
            }
          }
          if (messageEntities.length) options.caption_entities = messageEntities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendPhoto(chat_id, photo, options==={}?null:options);
        }
        if (params.video) {
          const video = params.video;
          const options = {};
          let messageEntities = [];
          if (params.caption) options.caption = params.caption;
          if (params.options.length) options.options = params.options;
          if (params.caption_entities.length) {
            for (let i = 0; i < params.caption_entities.length; i++) {
              const userData = {};
              if (params.caption_entities[i].user) {
                userData.id = params.caption_entities[i].user.id;
                if (params.caption_entities[i].user.is_bot) userData.is_bot = params.caption_entities[i].user.is_bot;
                if (params.caption_entities[i].user.first_name) userData.first_name = params.caption_entities[i].user.first_name;
                if (params.caption_entities[i].user.last_name) userData.last_name = params.caption_entities[i].user.last_name;
                if (params.caption_entities[i].user.username) userData.username = params.caption_entities[i].user.username;
                if (params.caption_entities[i].user.language_code) userData.language_code = params.caption_entities[i].user.language_code;
                if (params.caption_entities[i].user.is_premium) userData.is_premium = params.caption_entities[i].user.is_premium;
                if (params.caption_entities[i].user.added_to_attachment_menu) userData.added_to_attachment_menu = params.caption_entities[i].user.added_to_attachment_menu;
                if (params.caption_entities[i].user.can_join_groups) userData.can_join_groups = params.caption_entities[i].user.can_join_groups;
                if (params.caption_entities[i].user.can_read_all_group_messages )userData.can_read_all_group_messages = params.caption_entities[i].user.can_read_all_group_messages;
                if (params.caption_entities[i].user.supports_inline_queries) userData.supports_inline_queries = params.caption_entities[i].user.supports_inline_queries;
              }
              const nObj = {type: params.caption_entities[i].type, offset: params.caption_entities[i].offset, length: params.caption_entities[i].length, url: params.caption_entities[i].url, language: params.caption_entities[i].language, custom_emoji_id: params.caption_entities[i].custom_emoji_id};
              if (userData !== {}) nObj.user = userData;
              messageEntities = [...messageEntities, nObj]
            }
          }
          if (messageEntities.length) options.caption_entities = messageEntities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendVideo(chat_id, video, options==={}?null:options);
        }
        if (params.audio) {
          const audio = params.audio;
          const options = {};
          let messageEntities = [];
          if (params.caption) options.caption = params.caption;
          if (params.performer) options.performer = params.performer
          if (params.title) options.title = params.title;
          if (params.options.length) options.options = params.options;
          if (params.caption_entities.length) {
            for (let i = 0; i < params.caption_entities.length; i++) {
              const userData = {};
              if (params.caption_entities[i].user) {
                userData.id = params.caption_entities[i].user.id;
                if (params.caption_entities[i].user.is_bot) userData.is_bot = params.caption_entities[i].user.is_bot;
                if (params.caption_entities[i].user.first_name) userData.first_name = params.caption_entities[i].user.first_name;
                if (params.caption_entities[i].user.last_name) userData.last_name = params.caption_entities[i].user.last_name;
                if (params.caption_entities[i].user.username) userData.username = params.caption_entities[i].user.username;
                if (params.caption_entities[i].user.language_code) userData.language_code = params.caption_entities[i].user.language_code;
                if (params.caption_entities[i].user.is_premium) userData.is_premium = params.caption_entities[i].user.is_premium;
                if (params.caption_entities[i].user.added_to_attachment_menu) userData.added_to_attachment_menu = params.caption_entities[i].user.added_to_attachment_menu;
                if (params.caption_entities[i].user.can_join_groups) userData.can_join_groups = params.caption_entities[i].user.can_join_groups;
                if (params.caption_entities[i].user.can_read_all_group_messages )userData.can_read_all_group_messages = params.caption_entities[i].user.can_read_all_group_messages;
                if (params.caption_entities[i].user.supports_inline_queries) userData.supports_inline_queries = params.caption_entities[i].user.supports_inline_queries;
              }
              const nObj = {type: params.caption_entities[i].type, offset: params.caption_entities[i].offset, length: params.caption_entities[i].length, url: params.caption_entities[i].url, language: params.caption_entities[i].language, custom_emoji_id: params.caption_entities[i].custom_emoji_id};
              if (userData !== {}) nObj.user = userData;
              messageEntities = [...messageEntities, nObj]
            }
          }
          if (messageEntities.length) options.caption_entities = messageEntities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendAudio(chat_id, audio, options==={}?null:options);
        }
        if (params.animation) {
          const animation = params.animation;
          const options = {};
          let messageEntities = [];
          if (params.caption) options.caption = params.caption;
          if (params.options.length) options.options = params.options;
          if (params.caption_entities.length) {
            for (let i = 0; i < params.caption_entities.length; i++) {
              const userData = {};
              if (params.caption_entities[i].user) {
                userData.id = params.caption_entities[i].user.id;
                if (params.caption_entities[i].user.is_bot) userData.is_bot = params.caption_entities[i].user.is_bot;
                if (params.caption_entities[i].user.first_name) userData.first_name = params.caption_entities[i].user.first_name;
                if (params.caption_entities[i].user.last_name) userData.last_name = params.caption_entities[i].user.last_name;
                if (params.caption_entities[i].user.username) userData.username = params.caption_entities[i].user.username;
                if (params.caption_entities[i].user.language_code) userData.language_code = params.caption_entities[i].user.language_code;
                if (params.caption_entities[i].user.is_premium) userData.is_premium = params.caption_entities[i].user.is_premium;
                if (params.caption_entities[i].user.added_to_attachment_menu) userData.added_to_attachment_menu = params.caption_entities[i].user.added_to_attachment_menu;
                if (params.caption_entities[i].user.can_join_groups) userData.can_join_groups = params.caption_entities[i].user.can_join_groups;
                if (params.caption_entities[i].user.can_read_all_group_messages )userData.can_read_all_group_messages = params.caption_entities[i].user.can_read_all_group_messages;
                if (params.caption_entities[i].user.supports_inline_queries) userData.supports_inline_queries = params.caption_entities[i].user.supports_inline_queries;
              }
              const nObj = {type: params.caption_entities[i].type, offset: params.caption_entities[i].offset, length: params.caption_entities[i].length, url: params.caption_entities[i].url, language: params.caption_entities[i].language, custom_emoji_id: params.caption_entities[i].custom_emoji_id};
              if (userData !== {}) nObj.user = userData;
              messageEntities = [...messageEntities, nObj]
            }
          }
          if (messageEntities.length) options.caption_entities = messageEntities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendAnimation(chat_id, animation, options==={}?null:options);
        }
        if (params.document) {
          const document = params.document;
          const options = {};
          let messageEntities = [];
          if (params.caption) options.caption = params.caption;
          if (params.options.length) options.options = params.options;
          if (params.caption_entities.length) {
            for (let i = 0; i < params.caption_entities.length; i++) {
              const userData = {};
              if (params.caption_entities[i].user) {
                userData.id = params.caption_entities[i].user.id;
                if (params.caption_entities[i].user.is_bot) userData.is_bot = params.caption_entities[i].user.is_bot;
                if (params.caption_entities[i].user.first_name) userData.first_name = params.caption_entities[i].user.first_name;
                if (params.caption_entities[i].user.last_name) userData.last_name = params.caption_entities[i].user.last_name;
                if (params.caption_entities[i].user.username) userData.username = params.caption_entities[i].user.username;
                if (params.caption_entities[i].user.language_code) userData.language_code = params.caption_entities[i].user.language_code;
                if (params.caption_entities[i].user.is_premium) userData.is_premium = params.caption_entities[i].user.is_premium;
                if (params.caption_entities[i].user.added_to_attachment_menu) userData.added_to_attachment_menu = params.caption_entities[i].user.added_to_attachment_menu;
                if (params.caption_entities[i].user.can_join_groups) userData.can_join_groups = params.caption_entities[i].user.can_join_groups;
                if (params.caption_entities[i].user.can_read_all_group_messages )userData.can_read_all_group_messages = params.caption_entities[i].user.can_read_all_group_messages;
                if (params.caption_entities[i].user.supports_inline_queries) userData.supports_inline_queries = params.caption_entities[i].user.supports_inline_queries;
              }
              const nObj = {type: params.caption_entities[i].type, offset: params.caption_entities[i].offset, length: params.caption_entities[i].length, url: params.caption_entities[i].url, language: params.caption_entities[i].language, custom_emoji_id: params.caption_entities[i].custom_emoji_id};
              if (userData !== {}) nObj.user = userData;
              messageEntities = [...messageEntities, nObj]
            }
          }
          if (messageEntities.length) options.caption_entities = messageEntities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendDocument(chat_id, document, options==={}?null:options);
        }
        if (params.video_note) {
          const video_note = params.video_note;
          const options = {};
          let messageEntities = [];
          if (params.options.length) options.options = params.options;
          if (params.caption_entities.length) {
            for (let i = 0; i < params.caption_entities.length; i++) {
              const userData = {};
              if (params.caption_entities[i].user) {
                userData.id = params.caption_entities[i].user.id;
                if (params.caption_entities[i].user.is_bot) userData.is_bot = params.caption_entities[i].user.is_bot;
                if (params.caption_entities[i].user.first_name) userData.first_name = params.caption_entities[i].user.first_name;
                if (params.caption_entities[i].user.last_name) userData.last_name = params.caption_entities[i].user.last_name;
                if (params.caption_entities[i].user.username) userData.username = params.caption_entities[i].user.username;
                if (params.caption_entities[i].user.language_code) userData.language_code = params.caption_entities[i].user.language_code;
                if (params.caption_entities[i].user.is_premium) userData.is_premium = params.caption_entities[i].user.is_premium;
                if (params.caption_entities[i].user.added_to_attachment_menu) userData.added_to_attachment_menu = params.caption_entities[i].user.added_to_attachment_menu;
                if (params.caption_entities[i].user.can_join_groups) userData.can_join_groups = params.caption_entities[i].user.can_join_groups;
                if (params.caption_entities[i].user.can_read_all_group_messages )userData.can_read_all_group_messages = params.caption_entities[i].user.can_read_all_group_messages;
                if (params.caption_entities[i].user.supports_inline_queries) userData.supports_inline_queries = params.caption_entities[i].user.supports_inline_queries;
              }
              const nObj = {type: params.caption_entities[i].type, offset: params.caption_entities[i].offset, length: params.caption_entities[i].length, url: params.caption_entities[i].url, language: params.caption_entities[i].language, custom_emoji_id: params.caption_entities[i].custom_emoji_id};
              if (userData !== {}) nObj.user = userData;
              messageEntities = [...messageEntities, nObj]
            }
          }
          if (messageEntities.length) options.caption_entities = messageEntities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendVideoNote(chat_id, video_note, options==={}?null:options);
        }
        if (params.voice) {
          const voice = params.voice;
          const options = {};
          let messageEntities = [];
          if (params.caption) options.caption = params.caption;
          if (params.options.length) options.options = params.options;
          if (params.caption_entities.length) {
            for (let i = 0; i < params.caption_entities.length; i++) {
              const userData = {};
              if (params.caption_entities[i].user) {
                userData.id = params.caption_entities[i].user.id;
                if (params.caption_entities[i].user.is_bot) userData.is_bot = params.caption_entities[i].user.is_bot;
                if (params.caption_entities[i].user.first_name) userData.first_name = params.caption_entities[i].user.first_name;
                if (params.caption_entities[i].user.last_name) userData.last_name = params.caption_entities[i].user.last_name;
                if (params.caption_entities[i].user.username) userData.username = params.caption_entities[i].user.username;
                if (params.caption_entities[i].user.language_code) userData.language_code = params.caption_entities[i].user.language_code;
                if (params.caption_entities[i].user.is_premium) userData.is_premium = params.caption_entities[i].user.is_premium;
                if (params.caption_entities[i].user.added_to_attachment_menu) userData.added_to_attachment_menu = params.caption_entities[i].user.added_to_attachment_menu;
                if (params.caption_entities[i].user.can_join_groups) userData.can_join_groups = params.caption_entities[i].user.can_join_groups;
                if (params.caption_entities[i].user.can_read_all_group_messages )userData.can_read_all_group_messages = params.caption_entities[i].user.can_read_all_group_messages;
                if (params.caption_entities[i].user.supports_inline_queries) userData.supports_inline_queries = params.caption_entities[i].user.supports_inline_queries;
              }
              const nObj = {type: params.caption_entities[i].type, offset: params.caption_entities[i].offset, length: params.caption_entities[i].length, url: params.caption_entities[i].url, language: params.caption_entities[i].language, custom_emoji_id: params.caption_entities[i].custom_emoji_id};
              if (userData !== {}) nObj.user = userData;
              messageEntities = [...messageEntities, nObj]
            }
          }
          if (messageEntities.length) options.caption_entities = messageEntities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendVoice(chat_id, voice, options==={}?null:options);
        }
        if (params.phone_number) {
          const phone_number = params.phone_number;
          const first_name = params.first_name;
          const options = {};
          if (params.last_name) options.last_name = params.last_name;
          if (params.vcard) options.vcard = params.vcard;
          if (params.options.length) options.options = params.options;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendContact(chat_id, phone_number, first_name, options==={}?null:options);
        }
        if (params.emoji) {
          const options = {};
          options.emoji = params.emoji;
          if (params.options.length) options.options = params.options;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendDice(chat_id, options==={}?null:options);
        }
        if (params.options.length) {
          const question = params.question;
          const options = params.options;
          const opts = {};
          let messageEntities = [];
          if (params.is_anonymous) opts.is_anonymous = params.is_anonymous;
          if (params.type) opts.type = params.type;
          if (params.allows_multiple_answers) opts.allows_multiple_answers = params.allows_multiple_answers;
          if (params.correct_option_id) opts.correct_option_id = params.correct_option_id;
          if (params.explanation) opts.explanation = params.explanation;
          if (params.open_period) opts.open_period = params.open_period;
          if (params.close_date) opts.close_date = params.close_date;
          if (params.explanation_entities.length) {
            for (let i = 0; i < params.explanation_entities.length; i++) {
              const userData = {};
              if (params.explanation_entities[i].user) {
                userData.id = params.explanation_entities[i].user.id;
                if (params.explanation_entities[i].user.is_bot) userData.is_bot = params.explanation_entities[i].user.is_bot;
                if (params.explanation_entities[i].user.first_name) userData.first_name = params.explanation_entities[i].user.first_name;
                if (params.explanation_entities[i].user.last_name) userData.last_name = params.explanation_entities[i].user.last_name;
                if (params.explanation_entities[i].user.username) userData.username = params.explanation_entities[i].user.username;
                if (params.explanation_entities[i].user.language_code) userData.language_code = params.explanation_entities[i].user.language_code;
                if (params.explanation_entities[i].user.is_premium) userData.is_premium = params.explanation_entities[i].user.is_premium;
                if (params.explanation_entities[i].user.added_to_attachment_menu) userData.added_to_attachment_menu = params.explanation_entities[i].user.added_to_attachment_menu;
                if (params.explanation_entities[i].user.can_join_groups) userData.can_join_groups = params.explanation_entities[i].user.can_join_groups;
                if (params.explanation_entities[i].user.can_read_all_group_messages )userData.can_read_all_group_messages = params.explanation_entities[i].user.can_read_all_group_messages;
                if (params.explanation_entities[i].user.supports_inline_queries) userData.supports_inline_queries = params.explanation_entities[i].user.supports_inline_queries;
              }
              const nObj = {type: params.explanation_entities[i].type, offset: params.explanation_entities[i].offset, length: params.explanation_entities[i].length, url: params.explanation_entities[i].url, language: params.explanation_entities[i].language, custom_emoji_id: params.explanation_entities[i].custom_emoji_id};
              if (userData !== {}) nObj.user = userData;
              messageEntities = [...messageEntities, nObj]
            }
          }
          if (messageEntities.length) opts.explanation_entities;
          if (params.reply_markup) opts.reply_markup = params.reply_markup;
          return await bot.sendPoll(chat_id, question, options, opts==={}?null:opts);
        }
        if (params.address) {
          const latitude = params.latitude;
          const longitude = params.longitude;
          const title = params.title;
          const address = params.address;
          const options = {};
          if (params.foursquare_id) options.foursquare_id = params.foursquare_id;
          if (params.foursquare_type) options.foursquare_type = params.foursquare_type;
          if (params.google_place_id) options.google_place_id = params.google_place_id;
          if (params.google_place_type) options.google_place_type = params.google_place_type;
          if (params.options.length) options.options = params.options;
          if (params.entities.length) options.entities = params.entities;
          if (params.caption_entities.length) options.caption_entities = params.caption_entities;
          if (params.media.length) options.media = params.media;
          if (params.explanation_entities.length) options.explanation_entities = params.explanation_entities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendVenue(chat_id, latitude, longitude, title, address, options==={}?null:options);
        }
        if (params.longitude) {
          const latitude = params.latitude;
          const longitude = params.longitude;
          const options = {};
          if (params.options.length) options.options = params.options;
          if (params.entities.length) options.entities = params.entities;
          if (params.caption_entities.length) options.caption_entities = params.caption_entities;
          if (params.media.length) options.media = params.media;
          if (params.explanation_entities.length) options.explanation_entities = params.explanation_entities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendLocation(chat_id, latitude, longitude, options==={}?null:options);
        }
        if (params.sticker) {
          const sticker = params.sticker;
          const options = {};
          if (params.options.length) options.options = params.options;
          if (params.entities.length) options.entities = params.entities;
          if (params.caption_entities.length) options.caption_entities = params.caption_entities;
          if (params.media.length) options.media = params.media;
          if (params.explanation_entities.length) options.explanation_entities = params.explanation_entities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendSticker(chat_id, sticker, options==={}?null:options);
        }
        return;
      }
      let reply_markup = {}
      if (keyboard) reply_markup = {keyboard, resize_keyboard: true, one_time_keyboard: one_time_keyboard===undefined?false:one_time_keyboard}
      if (inline_keyboard) reply_markup.inline_keyboard = inline_keyboard
      if (reply_markup === {}) reply_markup = null
      if (text) return await bot.sendMessage(chatId===undefined?msg.chat.id:chatId, text, {
        parse_mode: parse_mode===undefined?"HTML":parse_mode,
        reply_markup: reply_markup || null
      })
      if (messageId) return await bot.copyMessage(chatId===undefined?msg.chat.id:chatId, fromChatId || archiveTelegramChannel, messageId, {
        caption: caption===undefined?null:caption,
        parse_mode: parse_mode===undefined?"HTML":parse_mode,
        reply_markup: reply_markup || null
      })
    } catch (e) {
      console.log(e)
    }
  },
  alertCallbackQuery: (bot, query) => async ({
    text, showAlert
  }) => {
    try {
      return await bot.answerCallbackQuery(query.id, {text, show_alert: showAlert===undefined?false:typeof showAlert==="boolean"?showAlert:false})
    } catch (e) {
      console.log(e)
    }
  },
  deleteCallbackQuery,
  editCallbackQuery: (bot, query) => async ({
    chatId, text, messageId, caption, parse_mode, keyboard, inline_keyboard, one_time_keyboard, fromChatId
  }) => {
    try {
      let reply_markup = {}
      if (keyboard) reply_markup = {keyboard, resize_keyboard: true, one_time_keyboard: one_time_keyboard===undefined?false:one_time_keyboard}
      if (inline_keyboard) reply_markup.inline_keyboard = inline_keyboard
      if (reply_markup === {}) reply_markup = null
      if (reply_markup && reply_markup.keyboard && query.message.reply_markup.inline_keyboard && text) {
        await deleteCallbackQuery(bot, query)();
        return await bot.sendMessage(chatId===undefined?query.message.chat.id:chatId, text, {
          parse_mode: parse_mode===undefined?"HTML":parse_mode,
          reply_markup: reply_markup || null
        })
      }
      if (reply_markup && reply_markup.keyboard && query.message.reply_markup.inline_keyboard && messageId) {
        await deleteCallbackQuery(bot, query)();
        return await bot.copyMessage(chatId === undefined ? query.message.chat.id : chatId, fromChatId || archiveTelegramChannel, messageId, {
          caption: caption === undefined ? null : caption,
          parse_mode: parse_mode === undefined ? "HTML" : parse_mode,
          reply_markup: reply_markup || null
        })
      }
      if (text && !query.message.text) return await bot.sendMessage(chatId===undefined?query.message.chat.id:chatId, text, {
        parse_mode: parse_mode===undefined?"HTML":parse_mode,
        reply_markup: reply_markup || null
      })
      if (text && query.message.text) return await bot.editMessageText(text, {
        chat_id: chatId===undefined?query.message.chat.id:chatId,
        message_id: query.message.message_id,
        parse_mode: parse_mode===undefined?"HTML":parse_mode,
        reply_markup: reply_markup || null
      })
      if (messageId) {
        await deleteCallbackQuery(bot, query)();
        return await bot.copyMessage(chatId === undefined ? query.message.chat.id : chatId, fromChatId || archiveTelegramChannel, messageId, {
          caption: caption === undefined ? null : caption,
          parse_mode: parse_mode === undefined ? "HTML" : parse_mode,
          reply_markup: reply_markup || null
        })
      }
    } catch (e) {
      console.log(e)
    }
  },
}
