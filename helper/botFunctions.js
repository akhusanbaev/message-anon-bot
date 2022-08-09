const {archiveTelegramChannel} = require("./config");
const deleteCallbackQuery = (bot, query) => async () => {
  try {
    return await bot.deleteMessage(query.message.chat.id, query.message.message_id)
  } catch (e) {
    console.log(e)
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
  }
}
