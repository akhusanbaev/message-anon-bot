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
          if (params.entities.length) options.entities = params.entities;
          if (params.reply_markup) options.reply_markup = params.reply_markup;
          return await bot.sendMessage(chat_id, text, options==={}?null:options);
        }
        if (params.photo) {
          const photo = params.photo;
          params._id = null;
          params.methodName = null;
          params.photo = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendPhoto(chat_id, photo, params);
        }
        if (params.video) {
          const video = params.video;
          params._id = null;
          params.methodName = null;
          params.video = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendVideo(chat_id, video, params);
        }
        if (params.audio) {
          const audio = params.audio;
          params._id = null;
          params.methodName = null;
          params.audio = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendAudio(chat_id, audio, params);
        }
        if (params.animation) {
          const animation = params.animation;
          params._id = null;
          params.methodName = null;
          params.animation = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendAnimation(chat_id, animation, params);
        }
        if (params.document) {
          const document = params.document;
          params._id = null;
          params.methodName = null;
          params.document = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendDocument(chat_id, document, params);
        }
        if (params.video_note) {
          const video_note = params.video_note;
          params._id = null;
          params.methodName = null;
          params.video_note = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendVideoNote(chat_id, video_note, params);
        }
        if (params.voice) {
          const voice = params.voice;
          params._id = null;
          params.methodName = null;
          params.voice = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendVoice(chat_id, voice, params);
        }
        if (params.phone_number) {
          const phone_number = params.phone_number;
          const first_name = params.first_name;
          params._id = null;
          params.methodName = null;
          params.phone_number = null;
          params.first_name = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendContact(chat_id, phone_number, first_name, params);
        }
        if (params.emoji) {
          params._id = null;
          params.methodName = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendDice(chat_id, params);
        }
        if (params.options.length) {
          const question = params.question;
          const options = params.options;
          params._id = null;
          params.methodName = null;
          params.options = null;
          params.question = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendPoll(chat_id, question, options, params);
        }
        if (params.address) {
          const latitude = params.latitude;
          const longitude = params.longitude;
          const title = params.title;
          const address = params.address;
          params._id = null;
          params.methodName = null;
          params.latitude = null;
          params.longitude = null;
          params.title = null;
          params.address = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendVenue(chat_id, latitude, longitude, title, address, params);
        }
        if (params.longitude) {
          const latitude = params.latitude;
          const longitude = params.longitude;
          params._id = null;
          params.methodName = null;
          params.latitude = null;
          params.longitude = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendLocation(chat_id, latitude, longitude, params);
        }
        if (params.sticker) {
          const sticker = params.sticker;
          params._id = null;
          params.methodName = null;
          params.sticker = null;
          if (!params.options.length) params.options = null;
          if (!params.entities.length) params.entities = null;
          if (!params.caption_entities.length) params.caption_entities = null;
          if (!params.media.length) params.media = null;
          if (!params.explanation_entities.length) params.explanation_entities = null;
          return await bot.sendSticker(chat_id, sticker, params);
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
