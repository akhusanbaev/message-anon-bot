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
  }, sendMsg: (bot) => async params => {
    try {
      if (params.text) {
        let options = params;
        delete options.chat_id;
        delete options.text;
        return await bot.sendMessage(params.chat_id, params.text, options);
      }
      if (params.photo) {
        let options = params;
        delete options.chat_id;
        delete options.photo;
        return await bot.sendPhoto(params.chat_id, params.photo, options);
      }
      if (params.video) {
        let options = params;
        delete options.chat_id;
        delete options.video;
        return await bot.sendVideo(params.chat_id, params.video, options);
      }
      if (params.audio) {
        let options = params;
        delete options.chat_id;
        delete options.audio;
        return await bot.sendAudio(params.chat_id, params.audio, options);
      }
      if (params.animation) {
        let options = params;
        delete options.chat_id;
        delete options.animation;
        return await bot.sendAnimation(params.chat_id, params.animation, options);
      }
      if (params.document) {
        let options = params;
        delete options.chat_id;
        delete options.document;
        return await bot.sendDocument(params.chat_id, params.document, options);
      }
      if (params.video_note) {
        let options = params;
        delete options.chat_id;
        delete options.video_note;
        return await bot.sendVideoNote(params.chat_id, params.video_note, options);
      }
      if (params.voice) {
        let options = params;
        delete options.chat_id;
        delete options.voice;
        return await bot.sendVoice(params.chat_id, params.voice, options);
      }
      if (params.phone_number) {
        let options = params;
        delete options.chat_id;
        delete options.phone_number;
        delete options.first_name
        return await bot.sendContact(params.chat_id, params.phone_number, params.first_name, options);
      }
      if (params.emoji) {
        let options = params;
        delete options.chat_id;
        delete options.emoji;
        return await bot.sendDice(params.chat_id, params.emoji, options);
      }
      if (params.options) {
        let options = params;
        delete options.chat_id;
        delete options.options;
        delete options.question;
        return await bot.sendPoll(params.chat_id, params.question, params.options, options);
      }
      if (params.address) {
        let options = params;
        delete options.chat_id;
        delete options.latitude;
        delete options.longitude;
        delete options.title;
        delete options.address;
        return await bot.sendVenue(params.chat_id, params.latitude, params.longitude, params.title, params.address, options);
      }
      if (params.longitude) {
        let options = params;
        delete options.chat_id;
        delete options.latitude;
        delete options.longitude;
        return await bot.sendLocation(params.chat_id, params.latitude, params.longitude, options);
      }
      if (params.sticker) {
        let options = params;
        delete options.chat_id;
        delete options.sticker;
        return await bot.sendSticker(params.chat_id, params.sticker, options);
      }
    } catch (e) {
      console.log(e);
    }
  },
}
