const express = require("express");
const {connect} = require("mongoose");
const moment = require("moment");
const TelegramBotApi = require("node-telegram-bot-api");
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');

const config = require("./helper/config");

const {replyMessage, alertCallbackQuery, deleteCallbackQuery, editCallbackQuery, sendMsg} = require("./helper/botFunctions");
const Users = require("./models/Users");
const Admins = require("./models/Admins");
const Bills = require("./models/Bills");
const ScheduledMails = require("./models/ScheduledMails");
const {welcomeMessage, choosingGender, choosingAge, choosingTown, choosingCountry, homepage, profilePage,
  choosingVipPlan, randomPartnerPage, chatPage, endedChatPage, backRequestPage, filterFillGenderPage,
  filterFillAgePage, filterFillCountryPage, filterPartnerPage, filterFillTownPage, randomPartnerRestrictedPage,
  backRequestWaitingPage, backRequestReadingPage, backRequestSeePage, choosingChatVipPlan, choosingChatVipPlanMsg
} = require("./helper/contents");
const {randomPartner, searchByCity, chatRestricted, profile, vipAccess, cancelSearch, endDialog,
  vipTryFree, fillSearch, fillGender, fillAge, fillCountry, fillTown, fillExit,
  chooseGenderMale, chooseGenderFemale, profileEdit, profileVip, backRequestOpen, backRequestReject
} = require("./helper/buttons");
const {adminMainPage, adminHomepage, adminStatisticsFilterPage, adminStatisticsFilterOpenPage,
  adminStatisticsFilterGenderPage, adminStatisticsFilterAgePage, adminStatisticsFilterCountryPage,
  adminStatisticsFilterTownPage, adminStatisticsFilterShowPage, adminMailingPage, adminMailingAllPage,
  adminMailingFilterPage, adminMailingAllMessagePage, adminMailingAllMessageAddButtonsPage,
  adminMailingAllMessageContinuePage, adminMailingAllMessageContinueSchedulePage, adminMailingFilterGenderPage,
  adminMailingFilterAgePage, adminMailingFilterCountryPage, adminMailingFilterTownPage, adminFreeTrialSearchesPage,
  adminChannelsPage, adminChannelsAddPage, adminChannelsAddLinkPage, adminChannelsAddAdminPage, adminChannelsEditPage,
  adminBannerPage, adminBannerAddPage, adminBannerAddMessagePage, adminBannerAddMessageAddButtonsPage,
  adminBannerAddMessageContinuePage, adminBannerAddNamePage, adminBannerAddMessageFilterPage,
  adminBannerAddMessageFilterGenderPage, adminBannerAddMessageFilterAgePage, adminBannerAddMessageFilterCountryPage,
  adminBannerAddMessageFilterTownPage, adminBannerAddMessageFilterContinuePage, adminAdminsPage, adminAdminsEditPage,
  adminBannerEditPage
} = require("./helper/adminContents");
const Mailer = require("./helper/Mailer");
const DefaultSettings = require("./models/DefaultSettings");

const app = express();
const bot = new TelegramBotApi(config.telegramBotToken);
const qiwiApi = new QiwiBillPaymentsAPI(config.qApiPrivateKey);


app.use(express.json());
app.post(`/bot${config.telegramBotToken}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(201);
});
app.post("/invoices", async (req, res) => {
  try {
    res.sendStatus(200);
    const bill = await Bills.findById(req.body.bill.billId);
    if (!bill) return;
    if (req.body.bill.status.value === "PAID") {
      await Bills.findOneAndUpdate({_id: bill._id}, {status: "paid"});
      const user = await Users.findById(bill.account);
      if (user.state.on === "chat-checkout") {
        if (user.state.plan === "24h") await Users.findOneAndUpdate({_id: user._id}, {vip: true, connectedVip: moment().toDate(), vipUntilDate: moment().add(24, "hours").toDate(), "state.on": "chat", "state.plan": null, "state.billId": null});
        if (user.state.plan === "7d") await Users.findOneAndUpdate({_id: user._id}, {vip: true, connectedVip: moment().toDate(), vipUntilDate: moment().add(1, "week").toDate(), "state.on": "chat", "state.plan": null, "state.billId": null});
        if (user.state.plan === "1M") await Users.findOneAndUpdate({_id: user._id}, {vip: true, connectedVip: moment().toDate(), vipUntilDate: moment().add(1, "month").toDate(), "state.on": "chat", "state.plan": null, "state.billId": null});
        if (user.state.plan === "forever") await Users.findOneAndUpdate({_id: user._id}, {vip: true, connectedVip: moment().toDate(), vipUnlimited: true, "state.on": "chat", "state.plan": null, "state.billId": null});
        await bot.sendMessage(user.user.id, `Оплата произведена успешно!`);
        return bot.sendMessage(user.user.id, `Можете продолжать общение в чате:`);
      }
      if (user.state.plan === "24h") await Users.findOneAndUpdate({_id: user._id}, {vip: true, connectedVip: moment().toDate(), vipUntilDate: moment().add(24, "hours").toDate(), "state.on": "home", "state.plan": null, "state.billId": null});
      if (user.state.plan === "7d") await Users.findOneAndUpdate({_id: user._id}, {vip: true, connectedVip: moment().toDate(), vipUntilDate: moment().add(1, "week").toDate(), "state.on": "home", "state.plan": null, "state.billId": null});
      if (user.state.plan === "1M") await Users.findOneAndUpdate({_id: user._id}, {vip: true, connectedVip: moment().toDate(), vipUntilDate: moment().add(1, "month").toDate(), "state.on": "home", "state.plan": null, "state.billId": null});
      if (user.state.plan === "forever") await Users.findOneAndUpdate({_id: user._id}, {vip: true, connectedVip: moment().toDate(), vipUnlimited: true, "state.on": "home", "state.plan": null, "state.billId": null});
      await bot.sendMessage(user.user.id, `Оплата произведена успешно!`);
      return bot.sendMessage(user.user.id, `Выбери действие:`, {reply_markup: {resize_keyboard: true, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]}});
    }
  } catch (e) {
    console.log(e);
  }
});
app.post("/renewals", async (req, res) => {
  try {
    const users = await Users.find({vipUntilDate: {$exists: true, $lte: moment().toDate()}});
    if (!users.length) return res.sendStatus(201);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      await Users.findOneAndUpdate({"user.id": user.user.id}, {vip: false, vipUntilDate: null, vipExpired: moment().toDate});
      if (user.state.on !== "chat" && user.state.on !== "back-request" && user.state.on !== "back-request-read" && user.state.on !== "back-request-see-requests" && user.state.on !== "search-filter-partner-fill-town" && user.state.on !== "search-filter-partner-fill-country" && user.state.on !== "search-filter-partner-fill-age" && user.state.on !== "search-filter-partner-fill-gender" && user.state.on !== "search-filter-partner" && user.state.on !== "gender" && user.state.on !== "age" && user.state.on !== "country" && user.state.on !== "town") await bot.sendMessage(user.user.id, `Срок подписки истек!`);
    }
    return res.sendStatus(201);
  } catch (e) {
    console.log(e);
  }
});
app.get("/", async (req, res) => {
    try {
      res.sendStatus(201);
      const mails = await ScheduledMails.find({startDate: {$lte: moment().toDate()}});
      const admins = await Admins.find();
      if (!mails.length) return;
      const reply = replyMessage(bot);
      for (let i = 0; i < admins.length; i++) {
        if (admins[i].state.on === "home") {
          await reply({chatId: admins[i].user.id, text: `Рассылка закончилась`});
        }
      }
      for (let i = 0; i < mails.length; i++) {
        await ScheduledMails.findOneAndUpdate({_id: mails[i]._id}, {modified: true});
        new Mailer(mails[i].userIds, {send: sendMsg(), reply}, mails[i].mailMessage);
      }
    } catch (e) {
      console.log(e);
    }
  });

bot.on("message", async msg => {
  try {
    if (!msg.chat) return;
    if (msg.chat.type !== "private") return;
    msg.reply = replyMessage(bot, msg);
    const user = await Users.findOne({"user.id": msg.chat.id});
    const admin = await Admins.findOne({"user.id": msg.chat.id});
    if (!user) {
      const newUser = new Users({user: msg.from, startQuery: msg.text?msg.text.startsWith("/start ")?msg.text.substring(7, msg.text.length):"empty":"empty"});
      await newUser.save();
      return welcomeMessage(msg, newUser);
    }
    if (msg.text && msg.text === "become admin") {
      const newAdmin = new Admins({user: msg.from, boss: true});
      await newAdmin.save();
      return msg.reply({text: `/admin`});
    }
    if (admin && admin.state.on === "none" && msg.text && msg.text === "/admin") return adminMainPage(msg, admin);
    if (admin && admin.state.on === "home") return adminHomepage(msg, admin);
    if (admin && admin.state.on === "statistics") return adminStatisticsFilterPage(msg, admin);
    if (admin && admin.state.on === "statistics-filter") return adminStatisticsFilterOpenPage(msg, admin);
    if (admin && admin.state.on === "statistics-filter-gender") return adminStatisticsFilterGenderPage(msg, admin);
    if (admin && admin.state.on === "statistics-filter-age") return adminStatisticsFilterAgePage(msg, admin);
    if (admin && admin.state.on === "statistics-filter-country") return adminStatisticsFilterCountryPage(msg, admin);
    if (admin && admin.state.on === "statistics-filter-town") return adminStatisticsFilterTownPage(msg, admin);
    if (admin && admin.state.on === "statistics-filter-show") return adminStatisticsFilterShowPage(msg, admin);
    if (admin && admin.state.on === "mailing") return adminMailingPage(msg, admin);
    if (admin && admin.state.on === "mailing-all") return adminMailingAllPage(msg, admin);
    if (admin && admin.state.on === "mailing-filter") return adminMailingFilterPage(msg, admin);
    if (admin && admin.state.on === "mailing-all-message") return adminMailingAllMessagePage(msg, admin);
    if (admin && admin.state.on === "mailing-all-message-add-buttons") return adminMailingAllMessageAddButtonsPage(msg, admin);
    if (admin && admin.state.on === "mailing-all-message-continue") return adminMailingAllMessageContinuePage(msg, admin);
    if (admin && admin.state.on === "mailing-all-message-continue-schedule") return adminMailingAllMessageContinueSchedulePage(msg, admin);
    if (admin && admin.state.on === "mailing-filter-gender") return adminMailingFilterGenderPage(msg, admin);
    if (admin && admin.state.on === "mailing-filter-age") return adminMailingFilterAgePage(msg, admin);
    if (admin && admin.state.on === "mailing-filter-country") return adminMailingFilterCountryPage(msg, admin);
    if (admin && admin.state.on === "mailing-filter-town") return adminMailingFilterTownPage(msg, admin);
    if (admin && admin.state.on === "trial-searches") return adminFreeTrialSearchesPage(msg, admin);
    if (admin && admin.state.on === "channels") return adminChannelsPage(msg, admin);
    if (admin && admin.state.on === "channels-add") return adminChannelsAddPage(msg, admin);
    if (admin && admin.state.on === "channels-add-link") return adminChannelsAddLinkPage(msg, admin);
    if (admin && admin.state.on === "channels-add-admin") return adminChannelsAddAdminPage(msg, admin);
    if (admin && admin.state.on === "channels-edit") return adminChannelsEditPage(msg, admin);
    if (admin && admin.state.on === "banner") return adminBannerPage(msg, admin);
    if (admin && admin.state.on === "banner-edit") return adminBannerEditPage(msg, admin);
    if (admin && admin.state.on === "banner-add-name") return adminBannerAddNamePage(msg, admin);
    if (admin && admin.state.on === "banner-add") return adminBannerAddPage(msg, admin);
    if (admin && admin.state.on === "banner-add-message") return adminBannerAddMessagePage(msg, admin);
    if (admin && admin.state.on === "banner-add-message-add-buttons") return adminBannerAddMessageAddButtonsPage(msg, admin);
    if (admin && admin.state.on === "banner-add-message-continue") return adminBannerAddMessageContinuePage(msg, admin);
    if (admin && admin.state.on === "banner-add-message-filter") return adminBannerAddMessageFilterPage(msg, admin);
    if (admin && admin.state.on === "banner-add-message-filter-gender") return adminBannerAddMessageFilterGenderPage(msg, admin);
    if (admin && admin.state.on === "banner-add-message-filter-age") return adminBannerAddMessageFilterAgePage(msg, admin);
    if (admin && admin.state.on === "banner-add-message-filter-country") return adminBannerAddMessageFilterCountryPage(msg, admin);
    if (admin && admin.state.on === "banner-add-message-filter-town") return adminBannerAddMessageFilterTownPage(msg, admin);
    if (admin && admin.state.on === "banner-add-message-filter-continue") return adminBannerAddMessageFilterContinuePage(msg, admin);
    if (admin && admin.state.on === "admins") return adminAdminsPage(msg, admin);
    if (admin && admin.state.on === "admin-edit") return adminAdminsEditPage(msg, admin);
    await Users.findOneAndUpdate({"user.id": user.user.id}, {lastAction: moment().toDate()});
    if (user.left) await Users.findOneAndUpdate({"user.id": user.user.id}, {left: false, backDate: moment().toDate()});
    if (user.state.on !== "chat" && user.state.on !== "back-request" && user.state.on !== "back-request-read" && user.state.on !== "back-request-see-requests" && user.state.on !== "search-filter-partner-fill-town" && user.state.on !== "search-filter-partner-fill-country" && user.state.on !== "search-filter-partner-fill-age" && user.state.on !== "search-filter-partner-fill-gender" && user.state.on !== "search-filter-partner" && user.state.on !== "gender" && user.state.on !== "age" && user.state.on !== "country" && user.state.on !== "town" && msg.text) {
      if (user.backRequests.length) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "back-request-read"});
        return msg.reply({text: `У вас новые запросы на общение от ${user.backRequests.length!==1?"людей":"человека"}`, keyboard: [[backRequestOpen], [backRequestReject]]});
      }
      if (msg.text === randomPartner) {
        const searchResult = await Users.find({"state.on": "search-random-partner", "user.id": {$ne: user.user.id}}).sort("lastAction");
        let partner = searchResult.length?searchResult[0]:null;
        if (!partner) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `🔎 Ищем собеседника...`, keyboard: [[cancelSearch]]});
        }
        if (partner.state.gender && partner.state.gender !== user.gender) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `🔎 Ищем собеседника...`, keyboard: [[cancelSearch]]});
        }
        if (partner.state.age.length && !partner.state.age.includes(user.age)) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `🔎 Ищем собеседника...`, keyboard: [[cancelSearch]]});
        }
        if (partner.state.country && !user.country.includes(partner.state.country)) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `🔎 Ищем собеседника...`, keyboard: [[cancelSearch]]});
        }
        if (partner.state.town && user.town && partner.state.town !== user.town) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `🔎 Ищем собеседника...`, keyboard: [[cancelSearch]]});
        }
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "chat", partner: partner._id.toString(), totalDialogs: user.totalDialogs+1});
        await Users.findOneAndUpdate({"user.id": partner.user.id}, {"state.on": "chat", partner: user._id.toString(), totalDialogs: partner.totalDialogs+1});
        await msg.reply({chatId: user.user.id, text: `Собеседник найден. Приятного общения. \n/stop - Закончить диалог${user.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        await msg.reply({chatId: partner.user.id, text: `Собеседник найден. Приятного общения. \n/stop - Закончить диалог${partner.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        return;
      }
      if (msg.text === searchByCity) {
        if (!user.vip) return msg.reply({text: `Данная функция доступна только для VIP пользователей`});
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-filter-partner"});
        return msg.reply({text: `Заданные параметры:\nПол: ${user.state.gender || "Без разницы"}\nВозраст: ${user.state.age || "Без разницы"}\nСтрана: ${user.state.country || "Без разницы"}\nГород: ${user.state.town || "Без разницы"}`, keyboard: [[fillSearch], [fillGender], [fillAge], [fillCountry], [fillTown], [fillExit]]});
      }
      if (msg.text === chatRestricted) {
        if (!user.vip) return msg.reply({text: `Данная функция доступна только для VIP пользователей`});
        const searchResult = await Users.find({"state.on": "search-random-partner-restricted", gender: user.gender==="male"?"female":"male", "user.id": {$ne: user.user.id}, "state.gender": {$exists: true, $in: [user.gender]}, "state.age": {$exists: true, $in: [user.age]}, "state.country": {$exists: true, $in: user.country}, "state.town": {$exists: true, $in: [user.town]}}).sort("lastAction");
        const partner = searchResult.length?searchResult[0]:null;
        if (!partner) {
          if (user.trialSearches === 1) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner-restricted", trialSearches: 0});
          if (user.trialSearches > 1) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner-restricted", trialSearches: user.trialSearches-1});
          return msg.reply({text: `🔎 Ищем собеседника...`, keyboard: [[cancelSearch]]});
        }
        if (user.trialSearches === 1) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "chat", partner: partner._id.toString(), trialSearches: 0, totalDialogs: user.totalDialogs+1});
        if (user.trialSearches > 1) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "chat", partner: partner._id.toString(), trialSearches: user.trialSearches-1, totalDialogs: user.totalDialogs+1});
        await Users.findOneAndUpdate({"user.id": partner.user.id}, {"state.on": "chat", partner: user._id.toString(), totalDialogs: partner.totalDialogs+1});
        await msg.reply({chatId: user.user.id, text: `Собеседник найден. Приятного общения. \n/stop - Закончить диалог${user.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        await msg.reply({chatId: partner.user.id, text: `Собеседник найден. Приятного общения. \n/stop - Закончить диалог${partner.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        return;
      }
      if (msg.text === profile) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "profile-page"});
        return msg.reply({text: `🎭 Мой профиль\n\nПол: ${user.gender === "male" ? chooseGenderMale : chooseGenderFemale}\nВозраст: ${user.age}\n\nVIP: ${user.vip ? user.vipUnlimited ? "Да(навсегда)" : user.trialSearches !== 0 ? `${user.trialSearches} пробных вип поисков` : user.vipUntilDate ? moment(user.vipUntilDate).format("MM/DD/YYYY") : "Нет" : "Нет"}\n\nВсего диалогов: ${user.totalDialogs}\nВсего сообщений: ${user.totalMessages}`, inline_keyboard: [[{text: profileEdit, callback_data: "edit"}], [{text: profileVip, callback_data: "vip"}]]});
      }
      if (msg.text === vipAccess || msg.text === "/vip") {
        if (user.vip) return msg.reply({text: `У вас уже есть VIP`});
        const settings = await DefaultSettings.findOne();
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "choose-vip-plan"});
        let buttons = [[{text: `24 часа ${settings.vipDailyPrice}р`, callback_data: "24h"}], [{text: `7 дней ${settings.vipWeeklyPrice}р`, callback_data: "7d"}], [{text: `1 месяц ${settings.vipMonthlyPrice}р`, callback_data: "1M"}], [{text: `Навсегда ${settings.vipForeverPrice}р`, callback_data: "forever"}]];
        if (user.hasFreeTrial) buttons = [[{text: `${vipTryFree}(${settings.freeTrialSearches} поисков)`, callback_data: "try-free"}], ...buttons];
        return msg.reply({text: `Выберите тарифный план`, inline_keyboard: buttons});
      }
      if (msg.text === "/start") return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
    }
    if (user.state.on === "gender") return choosingGender(msg, user);
    if (user.state.on === "age") return choosingAge(msg, user);
    if (user.state.on === "country") return choosingCountry(msg, user);
    if (user.state.on === "town") return choosingTown(msg, user);
    if (user.state.on === "home") return homepage(msg, user);
    if (user.state.on === "search-random-partner") return randomPartnerPage(msg, user);
    if (user.state.on === "search-random-partner-restricted") return randomPartnerRestrictedPage(msg, user);
    if (user.state.on === "search-filter-partner") return filterPartnerPage(msg, user);
    if (user.state.on === "search-filter-partner-fill-gender") return filterFillGenderPage(msg, user);
    if (user.state.on === "search-filter-partner-fill-age") return filterFillAgePage(msg, user);
    if (user.state.on === "search-filter-partner-fill-country") return filterFillCountryPage(msg, user);
    if (user.state.on === "search-filter-partner-fill-town") return filterFillTownPage(msg, user);
    if (user.state.on === "chat") return chatPage(msg, user);
    if (user.state.on === "choose-chat-vip-plan") return choosingChatVipPlanMsg(msg, user);
    if (user.state.on === "ended-chat") return endedChatPage(msg, user);
    if (user.state.on === "back-request") return backRequestPage(msg, user);
    if (user.state.on === "back-request-waiting") return backRequestWaitingPage(msg, user);
    if (user.state.on === "back-request-read") return backRequestReadingPage(msg, user);
    if (user.state.on === "back-request-see-requests") return backRequestSeePage(msg, user);
  } catch (e) {
    console.log(e);
  }
});

bot.on("callback_query", async query => {
  try {
    query.alert = alertCallbackQuery(bot, query);
    query.delete = deleteCallbackQuery(bot, query);
    query.edit = editCallbackQuery(bot, query);
    const user = await Users.findOne({"user.id": query.from.id});
    if (!user) return;
    if (user.state.on !== "chat" && user.state.on !== "back-request" && user.state.on !== "back-request-read" && user.state.on !== "back-request-see-requests" && user.state.on !== "search-filter-partner-fill-town" && user.state.on !== "search-filter-partner-fill-country" && user.state.on !== "search-filter-partner-fill-age" && user.state.on !== "search-filter-partner-fill-gender" && user.state.on !== "search-filter-partner" && user.state.on !== "gender" && user.state.on !== "age" && user.state.on !== "country" && user.state.on !== "town" && query.data === "vip-access") {
      if (user.vip) return query.edit({text: `У вас уже есть VIP`});
      const settings = await DefaultSettings.findOne();
      await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "choose-vip-plan"});
      let buttons = [[{text: `24 часа ${settings.vipDailyPrice}р`, callback_data: "24h"}], [{text: `7 дней ${settings.vipWeeklyPrice}р`, callback_data: "7d"}], [{text: `1 месяц ${settings.vipMonthlyPrice}р`, callback_data: "1M"}], [{text: `Навсегда ${settings.vipForeverPrice}р`, callback_data: "forever"}]];
      if (user.hasFreeTrial) buttons = [[{text: `${vipTryFree}(${settings.freeTrialSearches} поисков)`, callback_data: "try-free"}], ...buttons];
      return query.edit({text: `Выберите тарифный план`, inline_keyboard: buttons});
    }
    if (user.state.on === "profile-page") return profilePage(query, user);
    if (user.state.on === "choose-vip-plan") return choosingVipPlan(query, user, qiwiApi);
    if (user.state.on === "choose-chat-vip-plan") return choosingChatVipPlan(query, user, qiwiApi);
  } catch (e) {
    console.log(e);
  }
});

bot.on("my_chat_member", chatMemberUpdated => {
  console.log(chatMemberUpdated);
});

async function start() {
  try {
    await connect(config.mongoUri);
    await bot.setWebHook(`${config.serverUrl}/bot${config.telegramBotToken}`);
    app.listen(config.port, () => {
      console.log("Started...");
    })
  } catch (e) {
    console.log(e);
  }
}
start();
