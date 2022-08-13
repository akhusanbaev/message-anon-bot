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
    chatId, text, messageId, caption, parse_mode, keyboard, inline_keyboard, one_time_keyboard, fromChatId
  }) => {
    try {
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
  }, sendMsg: bot => async (params, chat_id) => {
    try {
      if (params.text) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.text;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendMessage(chat_id, params.text, options);
      }
      if (params.photo) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.photo;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendPhoto(chat_id, params.photo, options);
      }
      if (params.video) {
        let options = params;
        delete options._id;
        delete options.methodName;

        delete options.video;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendVideo(chat_id, params.video, options);
      }
      if (params.audio) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.audio;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendAudio(chat_id, params.audio, options);
      }
      if (params.animation) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.animation;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendAnimation(chat_id, params.animation, options);
      }
      if (params.document) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.document;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendDocument(chat_id, params.document, options);
      }
      if (params.video_note) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.video_note;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendVideoNote(chat_id, params.video_note, options);
      }
      if (params.voice) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.voice;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendVoice(chat_id, params.voice, options);
      }
      if (params.phone_number) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.phone_number;
        delete options.first_name;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendContact(chat_id, params.phone_number, params.first_name, options);
      }
      if (params.emoji) {
        let options = params;
        delete options._id;
        delete options.methodName;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendDice(chat_id, options);
      }
      if (params.options) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.options;
        delete options.question;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendPoll(chat_id, params.question, params.options, options);
      }
      if (params.address) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.latitude;
        delete options.longitude;
        delete options.title;
        delete options.address;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendVenue(chat_id, params.latitude, params.longitude, params.title, params.address, options);
      }
      if (params.longitude) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.latitude;
        delete options.longitude;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendLocation(chat_id, params.latitude, params.longitude, options);
      }
      if (params.sticker) {
        let options = params;
        delete options._id;
        delete options.methodName;
        delete options.sticker;
        if (!params.options.length) delete options.options;
        if (!params.entities.length) delete options.entities;
        if (!params.caption_entities.length) delete options.caption_entities;
        if (!params.media.length) delete options.media;
        if (!params.explanation_entities.length) delete options.explanation_entities;
        return await bot.sendSticker(chat_id, params.sticker, options);
      }
    } catch (e) {
      console.log(e);
    }
  },
}
