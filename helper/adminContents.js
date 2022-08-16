const moment = require("moment");
const Admins = require("./../models/Admins");
const Users = require("./../models/Users");
const ScheduledMails = require("./../models/ScheduledMails");
const DefaultSettings = require("./../models/DefaultSettings");
const Channels = require("./../models/Channels");
const Ads = require("./../models/Ads");
const Mailer = require("./Mailer");
const {adminStatistics, adminMailing, adminFreeTrialSearchesCount, adminChannelsToSubscribe, adminAdBanner,
  adminLinkForAdmins, adminAdmins, adminClose, randomPartner, searchByCity, chatRestricted, profile, vipAccess,
  adminStatisticsFilterGender, adminStatisticsFilterAge, adminStatisticsFilterTown, adminStatisticsFilterShow,
  adminStatisticsFilterExit, adminStatisticsFilterGenderMale, adminStatisticsFilterGenderFemale, adminStatisticsFilter,
  adminCancelButton, adminStatisticsFilterCountry, adminStatisticsFilterDoesntMatter, adminMailAll, adminMailFilter,
  adminMailingAddButtons, adminMailingContinue, adminMailingMessagePreview, adminMailingAllMessageSchedule,
  adminMailingAllMessageStart, adminChannelsAddChannel, adminChannelsEditSubscriptions, adminChannelsEditDelete,
  adminBannerAdd, adminBannerSet, adminBannerFilter, adminBannerDone, adminBannerReady, adminAdminsDelete,
  adminBannerDelete, searchByFourParams, support, rules, adminRulesText
} = require("./buttons");
const {countriesData} = require("./countries");
const {telegramBotLink, inviteAdminQuery} = require("./config");
module.exports = {
  adminMainPage: async (msg, admin) => {
    try {
      await Users.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
      return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
    } catch (e) {
      console.log(e);
    }
  }, adminHomepage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminClose) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "none"});
        return msg.reply({text: `⚡️Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [searchByFourParams], [profile, vipAccess], [support, rules]]});
      }
      if (msg.text === adminStatistics) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics"});
        const users = await Users.find();
        const left = await Users.find({left: true});
        const lastDay = await Users.find({joinDate: {$gte: moment().subtract(1, "days").toDate()}});
        const vipUsers = await Users.find({vip: true});
        return msg.reply({text: `Всего пользователей: ${users.length}\nПокинули бота: ${left.length}\nПрисоединились за последние 24 часа: ${lastDay.length}\nVIP пользователи: ${vipUsers.length}`, keyboard: [[adminStatisticsFilter], [adminCancelButton]]});
      }
      if (msg.text === adminMailing) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing"});
        return msg.reply({text: `Панель рассылки`, keyboard: [[adminMailAll], [adminMailFilter], [adminCancelButton]]});
      }
      if (msg.text === adminFreeTrialSearchesCount) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "trial-searches"});
        const settings = await DefaultSettings.findOne();
        return msg.reply({text: `На данный момент количество пробных VIP поисков ${settings.freeTrialSearches}. Введите в фомате числа сколько на сколько вы хотите поменять это значение:`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminChannelsToSubscribe) {
        const channels = await Channels.find();
        let buttons = [];
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels"});
        if (!channels.length) return msg.reply({text: `Каналы`, keyboard: [[adminChannelsAddChannel], [adminCancelButton]]});
        for (let i = 0; i < channels.length; i++) {buttons = [...buttons, [channels[i].name]];}
        return msg.reply({text: `Каналы`, keyboard: [...buttons, [adminChannelsAddChannel], [adminCancelButton]]});
      }
      if (msg.text === adminAdBanner) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner"});
        const ads = await Ads.find();
        return msg.reply({text: `Баннеры:`, keyboard: [...ads.map(a => [a.name]), [adminBannerAdd], [adminCancelButton]]});
      }
      if (msg.text === adminLinkForAdmins) return msg.reply({text: `Ссылка\n\n${telegramBotLink}?start=${inviteAdminQuery}\n\nПосторонним не показывайте эту ссылку`})
      if (msg.text === adminRulesText) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "rules-text"});
        return msg.reply({text: `Пришлите текст правил`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminAdmins) {
        if (!admin.boss) return msg.reply({text: `Данное меню доступно только для самого главного админа!`});
        const admins = await Admins.find({boss: false});
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "admins"});
        return msg.reply({text: `Админы`, keyboard: [...admins.map(a => [`${a.user.first_name}///${a.user.id}`]), [adminCancelButton]]});
      }
      if (msg.text.startsWith("/vip ")) {
        const settings = await DefaultSettings.findOne();
        const [plan, price] = msg.text.substring(5, msg.text.length).split(" ");
        if (plan !== "24h" && plan !== "7d" && plan !== "1M" && plan !== "forever") return msg.reply({text: `Неправильно! Доступные планы:\n\n<code>24h</code>\n\n<code>7d</code>\n\n<code>1M</code>\n\n<code>forever</code>`});
        if (plan === "24h") settings.vipDailyPrice = parseInt(price);
        if (plan === "7d") settings.vipWeeklyPrice = parseInt(price);
        if (plan === "1M") settings.vipMonthlyPrice = parseInt(price);
        if (plan === "forever") settings.vipForeverPrice = parseInt(price);
        await settings.save();
        return msg.reply({text: `Цена тарифа изменена на сумму ${parseInt(price)}`});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminStatisticsFilter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterOpenPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminStatisticsFilterGender) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter-gender"});
        return msg.reply({text: `Пол: ${admin.state.filterGender?admin.state.filterGender==="male"?"Мужской":"Женский":"все"}`, keyboard: [[adminStatisticsFilterGenderMale, adminStatisticsFilterGenderFemale], [adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterAge) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter-age"});
        return msg.reply({text: `Возраст: ${admin.state.filterAge.length?`${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length-1]}`:"все"}`, keyboard: [[adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterCountry) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter-country"});
        return msg.reply({text: `Страны: ${admin.state.filterCountry.length?admin.state.filterCountry.join(", "):"все"}`, keyboard: [...countriesData.map(c => {if (admin.state.filterCountry.includes(c)) return [`❌ ${c}`];
            return [c];}), [adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterTown) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter-town"});
        return msg.reply({text: `Город: ${admin.state.filterTown.length?admin.state.filterTown.join(", "):"все"}`, keyboard: [[adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterShow) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter-show"});
        let options = {};
        if (admin.state.filterGender) options.gender = admin.state.filterGender;
        if (admin.state.filterAge.length) options.age = {$gte: admin.state.filterAge[0], $lte: admin.state.filterAge[admin.state.filterAge.length-1]};
        if (admin.state.filterCountry.length) options.country = {$in: admin.state.filterCountry};
        if (admin.state.filterTown.length) options.town = {$in: admin.state.filterTown.map(t => ({$regex: t, $options: "i"}))};
        options.left = false;
        const users = await Users.find(options);
        return msg.reply({text: `По данному фильтру найдено ${users.length} пользователей`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterExit) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterGenderPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterGender": null});
        admin.state.filterGender = null;
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterGenderFemale) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterGender": "female"});
        admin.state.filterGender = "female";
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterGenderMale) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterGender": "male"});
        admin.state.filterGender = "male";
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterAgePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", $set: {"state.filterAge": []}});
        admin.state.filterAge = [];
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text.split("-").length && msg.text.split("-").length === 2) {
        let arr = [];
        for (let i = Number(msg.text.split("-")[0]); i <= Number(msg.text.split("-")[1]); i++) {arr = [...arr, i];}
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterAge": arr});
        admin.state.filterAge = arr;
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      return msg.reply({text: `Формат: X-Y`});
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterCountryPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterCountry": null});
        admin.state.filterCountry = [];
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text.startsWith("❌ ")) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", $pull: {"state.filterCountry": msg.text.substring(2, msg.text.length)}});
        admin.state.filterCountry.splice(admin.state.filterCountry.findIndex(b => b === msg.text.substring(2, msg.text.length)), 1);
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", $push: {"state.filterCountry": msg.text}});
      admin.state.filterCountry.push(msg.text);
      return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterTownPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterTown": null});
        admin.state.filterTown = [];
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterTown": msg.text.split(", ")});
      admin.state.filterTown = msg.text.split(", ");
      return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterShowPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminMailingPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminMailAll) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all"});
        return msg.reply({text: `Пришлите сообщение для рассылки:`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminMailFilter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminMailingAllPage: async (msg, admin) => {
    try {
      if (msg.text && msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      const params = {};
      if (msg.text) {
        params["state.mailing.mailMessage.methodName"] = "sendMessage";
        params["state.mailing.mailMessage.text"] = msg.text;
        if (msg.entities) params["state.mailing.mailMessage.entities"] = msg.entities;
      }
      if (msg.animation) {
        params["state.mailing.mailMessage.methodName"] = "sendAnimation";
        params["state.mailing.mailMessage.animation"] = msg.animation.file_id;
        if (msg.caption) params["state.mailing.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.mailing.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.audio) {
        params["state.mailing.mailMessage.methodName"] = "sendAudio";
        params["state.mailing.mailMessage.audio"] = msg.audio.file_id;
        if (msg.caption) params["state.mailing.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.mailing.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.document) {
        params["state.mailing.mailMessage.methodName"] = "sendDocument";
        params["state.mailing.mailMessage.document"] = msg.document.file_id;
        if (msg.caption) params["state.mailing.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.mailing.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.photo) {
        params["state.mailing.mailMessage.methodName"] = "sendPhoto";
        params["state.mailing.mailMessage.photo"] = msg.photo[msg.photo.length-1].file_id;
        if (msg.caption) params["state.mailing.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.mailing.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.sticker) {
        params["state.mailing.mailMessage.methodName"] = "sendSticker";
        params["state.mailing.mailMessage.sticker"] = msg.sticker.file_id;
        if (msg.caption) params["state.mailing.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.mailing.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.video) {
        params["state.mailing.mailMessage.methodName"] = "sendVideo";
        params["state.mailing.mailMessage.video"] = msg.video.file_id;
        if (msg.caption) params["state.mailing.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.mailing.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.video_note) {
        params["state.mailing.mailMessage.methodName"] = "sendVideoNote";
        params["state.mailing.mailMessage.video_note"] = msg.video_note.file_id;
        if (msg.caption) params["state.mailing.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.mailing.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.voice) {
        params["state.mailing.mailMessage.methodName"] = "sendVoice";
        params["state.mailing.mailMessage.voice"] = msg.voice.file_id;
        if (msg.caption) params["state.mailing.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.mailing.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.contact) {
        params["state.mailing.mailMessage.methodName"] = "sendContact";
        params["state.mailing.mailMessage.phone_number"] = msg.contact.phone_number;
        params["state.mailing.mailMessage.first_name"] = msg.contact.first_name;
        if (msg.contact.last_name) params["state.mailing.mailMessage.last_name"] = msg.contact.last_name;
        if (msg.contact.user_id) params["state.mailing.mailMessage.user_id"] = msg.contact.user_id;
        if (msg.contact.vcard) params["state.mailing.mailMessage.vcard"] = msg.contact.vcard;
      }
      if (msg.dice) {
        params["state.mailing.mailMessage.methodName"] = "sendDice";
        params["state.mailing.mailMessage.emoji"] = msg.dice.emoji;
      }
      if (msg.poll) {
        params["state.mailing.mailMessage.methodName"] = "sendPoll";
        params["state.mailing.mailMessage.question"] = msg.poll.question;
        params["state.mailing.mailMessage.options"] = msg.poll.options;
        if (msg.poll.is_anonymous) params["state.mailing.mailMessage.is_anonymous"] = msg.poll.is_anonymous;
        if (msg.poll.type) params["state.mailing.mailMessage.type"] = msg.poll.type;
        if (msg.poll.allows_multiple_answers) params["state.mailing.mailMessage.allows_multiple_answers"] = msg.poll.allows_multiple_answers;
        if (msg.poll.correct_option_id) params["state.mailing.mailMessage.correct_option_id"] = msg.poll.correct_option_id;
        if (msg.poll.explanation) params["state.mailing.mailMessage.explanation"] = msg.poll.explanation;
        if (msg.poll.explanation_entities) params["state.mailing.mailMessage.explanation_entities"] = msg.poll.explanation_entities;
        if (msg.poll.open_period) params["state.mailing.mailMessage.open_period"] = msg.poll.open_period;
        if (msg.poll.close_date) params["state.mailing.mailMessage.close_date"] = msg.poll.close_date;
      }
      if (msg.venue) {
        params["state.mailing.mailMessage.methodName"] = "sendVenue";
        params["state.mailing.mailMessage.latitude"] = msg.venue.location.latitude;
        params["state.mailing.mailMessage.longitude"] = msg.venue.location.longitude;
        params["state.mailing.mailMessage.title"] = msg.venue.title;
        params["state.mailing.mailMessage.address"] = msg.venue.address;
        if (msg.venue.foursquare_id) params["state.mailing.mailMessage.foursquare_id"] = msg.venue.foursquare_id;
        if (msg.venue.foursquare_type) params["state.mailing.mailMessage.foursquare_type"] = msg.venue.foursquare_type;
        if (msg.venue.google_place_id) params["state.mailing.mailMessage.google_place_id"] = msg.venue.google_place_id;
        if (msg.venue.google_place_type) params["state.mailing.mailMessage.google_place_type"] = msg.venue.google_place_type;
      }
      if (msg.location) {
        params["state.mailing.mailMessage.methodName"] = "sendLocation";
        params["state.mailing.mailMessage.latitude"] = msg.location.latitude;
        params["state.mailing.mailMessage.longitude"] = msg.location.longitude;
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message", ...params});
      return msg.reply({text: `Действия:`, keyboard: [[adminMailingMessagePreview], [adminMailingAddButtons], [adminMailingContinue], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminMailingFilterPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminStatisticsFilterGender) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter-gender"});
        return msg.reply({text: `Пол: ${admin.state.filterGender?admin.state.filterGender==="male"?"Мужской":"Женский":"все"}`, keyboard: [[adminStatisticsFilterGenderMale, adminStatisticsFilterGenderFemale], [adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterAge) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter-age"});
        return msg.reply({text: `Возраст: ${admin.state.filterAge.length?`${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length-1]}`:"все"}`, keyboard: [[adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterCountry) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter-country"});
        return msg.reply({text: `Страна: ${admin.state.filterCountry.length?admin.state.filterCountry.join(", "):"все"}`, keyboard: [...countriesData.map(c => [c]), [adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterTown) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter-town"});
        return msg.reply({text: `Город: ${admin.state.filterTown.length?admin.state.filterTown.join(", "):"все"}`, keyboard: [[adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminMailingContinue) {
        let params = {};
        if (admin.state.filterGender) params["state.mailing.filter.gender"] = admin.state.filterGender;
        if (admin.state.filterAge.length) params["state.mailing.filter.age"] = {$gte: admin.state.filterAge[0], $lte: admin.state.filterAge[admin.state.filterAge.length-1]};
        if (admin.state.filterCountry.length) params["state.mailing.filter.country"] = {$in: admin.state.filterCountry};
        if (admin.state.filterTown.length) params["state.mailing.filter.town"] = {$in: admin.state.filterTown.map(t => ({$regex: t, $options: "i"}))};
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all", ...params});
        return msg.reply({text: `Пришлите сообщение для рассылки:`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing"});
        return msg.reply({text: `Панель рассылки`, keyboard: [[adminMailAll], [adminMailFilter], [adminCancelButton]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminMailingAllMessagePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminMailingAddButtons) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message-add-buttons"});
        return msg.reply({text: `Напишите в формате:\n\ntitle - url\ntitle2 - url2\n\ntitle будет названием, url ссылкой\nкаждая новая кнопка с новой строки\n`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminMailingContinue) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message-continue"});
        return msg.reply({text: `Если хотите запланировать начало рассылки жмите кнопку запланировать`, keyboard: [[adminMailingAllMessageStart], [adminMailingAllMessageSchedule], [adminCancelButton]]});
      }
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing", $set: {"state.mailing": {}}});
        return msg.reply({text: `Панель рассылки`, keyboard: [[adminMailAll], [adminMailFilter], [adminCancelButton]]});
      }
      if (msg.text === adminMailingMessagePreview) {
        await msg.reply({telegramMessage: true, params: admin.state.mailing.mailMessage, chat_id: admin.user.id});
        return msg.reply({text: `Действия:`, keyboard: [[adminMailingMessagePreview], [adminMailingAddButtons], [adminMailingContinue], [adminCancelButton]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminMailingAllMessageAddButtonsPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message"});
        await msg.reply({telegramMessage: true, params: admin.state.mailing.mailMessage, chat_id: admin.user.id});
        return msg.reply({text: `Действия:`, keyboard: [[adminMailingMessagePreview], [adminMailingAddButtons], [adminMailingContinue], [adminCancelButton]]});
      }
      const arrays = msg.text.split("\n");
      let buttons = [];
      for (let i = 0; i < arrays.length; i++) {buttons = [...buttons, [{text: arrays[i].split(" - ")[0], url: arrays[i].split(" - ")[1]}]];}
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message", "state.mailing.mailMessage.reply_markup.inline_keyboard": buttons});
      return msg.reply({text: `Действия:`, keyboard: [[adminMailingMessagePreview], [adminMailingAddButtons], [adminMailingContinue], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminMailingAllMessageContinuePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminMailingAllMessageStart) {
        let userIds = []
        const users = await Users.find({left: false, ...admin.state.mailing.filter});
        for (let i = 0; i < users.length; i++) {userIds = [...userIds, users[i]._id.toString()];}
        new Mailer(userIds, msg, admin.state.mailing.mailMessage);
        await msg.reply({text: `Рассылка началась`});
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home", $set: {"state.mailing": {}}});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      if (msg.text === adminMailingAllMessageSchedule) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message-continue-schedule"});
        return msg.reply({text: `Напишите дату в формате MM/DD/YYYY HH:mm\nПример: <code>08/14/2022 13:00</code>\n-> 14 Aug, 2022 (1.00 PM)\n`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message"});
        await msg.reply({telegramMessage: true, params: admin.state.mailing.mailMessage, chat_id: admin.user.id});
        return msg.reply({text: `Действия:`, keyboard: [[adminMailingMessagePreview], [adminMailingAddButtons], [adminMailingContinue], [adminCancelButton]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminMailingAllMessageContinueSchedulePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message-continue"});
        return msg.reply({text: `Если хотите запланировать начало рассылки жмите кнопку запланировать`, keyboard: [[adminMailingAllMessageStart], [adminMailingAllMessageSchedule], [adminCancelButton]]});
      }
      const isValid = moment(msg.text, "MM/DD/YYYY HH:mm", true).isValid()
      if (!isValid) return msg.reply({text: `Неверный формат!`});
      let userIds = [];
      const users = await Users.find({left: false, ...admin.state.mailing.filter});
      for (let i = 0; i < users.length; i++) {userIds = [...userIds, users[i].user.id];}
      const newScheduledMail = new ScheduledMails({mailMessage: admin.state.mailing.mailMessage, startDate: moment(msg.text, "MM/DD/YYYY HH:mm").toDate(), userIds});
      await newScheduledMail.save();
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home", $set: {"state.mailing": {}}});
      return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
    } catch (e) {
      console.log(e);
    }
  }, adminMailingFilterGenderPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", "state.filterGender": null});
        admin.state.filterGender = null;
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterGenderMale) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", "state.filterGender": "male"});
        admin.state.filterGender = "male";
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterGenderFemale) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", "state.filterGender": "female"});
        admin.state.filterGender = "female";
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminMailingFilterAgePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", "state.filterAge": []});
        admin.state.filterAge = [];
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      if (msg.text.split("-").length && msg.text.split("-").length === 2) {
        let arr = [];
        for (let i = Number(msg.text.split("-")[0]); i <= Number(msg.text.split("-")[1]); i++) {arr = [...arr, i];}
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", "state.filterAge": arr});
        admin.state.filterAge = arr;
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      return msg.reply({text: `Формат: X-Y`});
    } catch (e) {
      console.log(e);
    }
  }, adminMailingFilterCountryPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", "state.filterCountry": []});
        admin.state.filterCountry = [];
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      if (msg.text.startsWith("❌ ")) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", $pull: {"state.filterCountry": msg.text.substring(2, msg.text.length)}});
        admin.state.filterCountry.splice(admin.state.filterCountry.findIndex(b => b === msg.text.substring(2, msg.text.length)), 1);
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", $push: {"state.filterCountry": msg.text}});
      admin.state.filterCountry.push(msg.text);
      return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminMailingFilterTownPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", "state.filterTown": []});
        admin.state.filterTown = [];
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-filter", "state.filterTown": msg.text.split(", ")});
      admin.state.filterTown = msg.text.split(", ");
      return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminMailingContinue], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminFreeTrialSearchesPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      if (!parseInt(msg.text)) return msg.reply({text: `Должно быть целое число`});
      const settings = await DefaultSettings.findOne();
      settings.freeTrialSearches = parseInt(msg.text);
      await settings.save()
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
      await msg.reply({text: `Теперь ${msg.text} количество пробных ВИП поисков`});
      return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
    } catch (e) {
      console.log(e);
    }
  }, adminChannelsPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      if (msg.text === adminChannelsAddChannel) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels-add"});
        return msg.reply({text: `Придумайте заголовок для этого канала(люди будут видеть этот заголовок на кнопке с сылкой на канал)`, keyboard: [[adminCancelButton]]});
      }
      const channel = await Channels.findOne({name: msg.text});
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels-edit", "state.channelId": channel._id.toString()});
      return msg.reply({text: `Канал: ${channel.name}. Пользователи ${channel.subscription?"должны":"могут и не"} подписываться`, keyboard: [[adminChannelsEditSubscriptions], [adminChannelsEditDelete], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminChannelsAddPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        const channels = await Channels.find();
        let buttons = [];
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels"});
        if (!channels.length) return msg.reply({text: `Каналы`, keyboard: [[adminChannelsAddChannel], [adminCancelButton]]});
        for (let i = 0; i < channels.length; i++) {buttons = [...buttons, [channels[i].name]];}
        return msg.reply({text: `Каналы`, keyboard: [...buttons, [adminChannelsAddChannel], [adminCancelButton]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels-add-link", "state.channelName": msg.text});
      return msg.reply({text: `Теперь пришлите ссылку на канал в формате https://t.me/example`, keyboard: [[adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminChannelsAddLinkPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        const channels = await Channels.find();
        let buttons = [];
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels", "state.channelName": null});
        if (!channels.length) return msg.reply({text: `Каналы`, keyboard: [[adminChannelsAddChannel]]});
        for (let i = 0; i < channels.length; i++) {buttons = [...buttons, [channels[i].name]];}
        return msg.reply({text: `Каналы`, keyboard: [...buttons, [adminChannelsAddChannel], [adminCancelButton]]});
      }
      if (!msg.text.startsWith("https://t.me")) return msg.reply({text: `Должен начинаться с https://t.me/`});
      if (msg.text.includes(" ")) return msg.reply({text: `Неверный формат!`});
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels-add-admin", "state.channelLink": msg.text});
      return msg.reply({text: `Сделайте бота админом и потом перешлите сюда любой пост из этого канала:`, keyboard: [[adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminChannelsAddAdminPage: async (msg, admin) => {
    try {
      if (msg.text && msg.text === adminCancelButton) {
        const channels = await Channels.find();
        let buttons = [];
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels", "state.channelName": null, "state.channelLink": null});
        if (!channels.length) return msg.reply({text: `Каналы`, keyboard: [[adminChannelsAddChannel]]});
        for (let i = 0; i < channels.length; i++) {buttons = [...buttons, [channels[i].name]];}
        return msg.reply({text: `Каналы`, keyboard: [...buttons, [adminChannelsAddChannel], [adminCancelButton]]});
      }
      if (!msg.forward_from_chat) return msg.reply({text: `Перешлите!`});
      const newChannel = new Channels({name: admin.state.channelName, link: admin.state.channelLink, chat: msg.forward_from_chat});
      await newChannel.save();
      const channels = await Channels.find();
      let buttons = [];
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels", "state.channelName": null, "state.channelLink": null});
      if (!channels.length) return msg.reply({text: `Каналы`, keyboard: [[adminChannelsAddChannel]]});
      for (let i = 0; i < channels.length; i++) {buttons = [...buttons, [channels[i].name]];}
      return msg.reply({text: `Каналы`, keyboard: [...buttons, [adminChannelsAddChannel], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminChannelsEditPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home", "state.channelId": null});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      if (msg.text === adminChannelsEditSubscriptions) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "channels-edit"});
        const channel = await Channels.findById(admin.state.channelId);
        await Channels.findOneAndUpdate({name: channel.name}, {subscription: false});
        channel.subscription = false;
        return msg.reply({text: `Канал: ${channel.name}. Пользователи ${channel.subscription?"должны":"могут и не"} подписываться`, keyboard: [[adminChannelsEditSubscriptions], [adminCancelButton]]});
      }
      if (msg.text === adminChannelsEditDelete) {
        const channel = await Channels.findById(admin.state.channelId);
        await Channels.deleteOne({name: channel.name});
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home", "state.channelId": null});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminBannerPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      if (msg.text === adminBannerAdd) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-name"});
        return msg.reply({text: `Добавление баннера\nНапишите название:`, keyboard: [[adminCancelButton]]});
      }
      const ad = await Ads.findOne({name: msg.text});
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-edit", "state.bannerId": ad._id.toString()});
      return msg.reply({text: `Баннер ${ad.name}`, keyboard: [[adminBannerDelete], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminBannerEditPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      if (msg.text === adminBannerDelete) {
        const ad = await Ads.findById(admin.state.bannerId);
        await Ads.deleteOne({name: ad.name});
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home", "state.bannerId": null});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddNamePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add", "state.banner.name": msg.text});
      return msg.reply({text: `Добавление баннера\nПришлите сообщение:`, keyboard: [[adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddPage: async (msg, admin) => {
    try {
      if (msg.text && msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      const params = {};
      if (msg.text) {
        params["state.banner.mailMessage.methodName"] = "sendMessage";
        params["state.banner.mailMessage.text"] = msg.text;
        if (msg.entities) params["state.banner.mailMessage.entities"] = msg.entities;
      }
      if (msg.animation) {
        params["state.banner.mailMessage.methodName"] = "sendAnimation";
        params["state.banner.mailMessage.animation"] = msg.animation.file_id;
        if (msg.caption) params["state.banner.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.banner.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.audio) {
        params["state.banner.mailMessage.methodName"] = "sendAudio";
        params["state.banner.mailMessage.audio"] = msg.audio.file_id;
        if (msg.caption) params["state.banner.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.banner.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.document) {
        params["state.banner.mailMessage.methodName"] = "sendDocument";
        params["state.banner.mailMessage.document"] = msg.document.file_id;
        if (msg.caption) params["state.banner.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.banner.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.photo) {
        params["state.banner.mailMessage.methodName"] = "sendPhoto";
        params["state.banner.mailMessage.photo"] = msg.photo[msg.photo.length-1].file_id;
        if (msg.caption) params["state.banner.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.banner.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.sticker) {
        params["state.banner.mailMessage.methodName"] = "sendSticker";
        params["state.banner.mailMessage.sticker"] = msg.sticker.file_id;
        if (msg.caption) params["state.banner.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.banner.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.video) {
        params["state.banner.mailMessage.methodName"] = "sendVideo";
        params["state.banner.mailMessage.video"] = msg.video.file_id;
        if (msg.caption) params["state.banner.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.banner.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.video_note) {
        params["state.banner.mailMessage.methodName"] = "sendVideoNote";
        params["state.banner.mailMessage.video_note"] = msg.video_note.file_id;
        if (msg.caption) params["state.banner.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.banner.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.voice) {
        params["state.banner.mailMessage.methodName"] = "sendVoice";
        params["state.banner.mailMessage.voice"] = msg.voice.file_id;
        if (msg.caption) params["state.banner.mailMessage.caption"] = msg.caption;
        if (msg.caption_entities) params["state.banner.mailMessage.caption_entities"] = msg.caption_entities
      }
      if (msg.contact) {
        params["state.banner.mailMessage.methodName"] = "sendContact";
        params["state.banner.mailMessage.phone_number"] = msg.contact.phone_number;
        params["state.banner.mailMessage.first_name"] = msg.contact.first_name;
        if (msg.contact.last_name) params["state.banner.mailMessage.last_name"] = msg.contact.last_name;
        if (msg.contact.user_id) params["state.banner.mailMessage.user_id"] = msg.contact.user_id;
        if (msg.contact.vcard) params["state.banner.mailMessage.vcard"] = msg.contact.vcard;
      }
      if (msg.dice) {
        params["state.banner.mailMessage.methodName"] = "sendDice";
        params["state.banner.mailMessage.emoji"] = msg.dice.emoji;
      }
      if (msg.poll) {
        params["state.banner.mailMessage.methodName"] = "sendPoll";
        params["state.banner.mailMessage.question"] = msg.poll.question;
        params["state.banner.mailMessage.options"] = msg.poll.options;
        if (msg.poll.is_anonymous) params["state.banner.mailMessage.is_anonymous"] = msg.poll.is_anonymous;
        if (msg.poll.type) params["state.banner.mailMessage.type"] = msg.poll.type;
        if (msg.poll.allows_multiple_answers) params["state.banner.mailMessage.allows_multiple_answers"] = msg.poll.allows_multiple_answers;
        if (msg.poll.correct_option_id) params["state.banner.mailMessage.correct_option_id"] = msg.poll.correct_option_id;
        if (msg.poll.explanation) params["state.banner.mailMessage.explanation"] = msg.poll.explanation;
        if (msg.poll.explanation_entities) params["state.banner.mailMessage.explanation_entities"] = msg.poll.explanation_entities;
        if (msg.poll.open_period) params["state.banner.mailMessage.open_period"] = msg.poll.open_period;
        if (msg.poll.close_date) params["state.banner.mailMessage.close_date"] = msg.poll.close_date;
      }
      if (msg.venue) {
        params["state.banner.mailMessage.methodName"] = "sendVenue";
        params["state.banner.mailMessage.latitude"] = msg.venue.location.latitude;
        params["state.banner.mailMessage.longitude"] = msg.venue.location.longitude;
        params["state.banner.mailMessage.title"] = msg.venue.title;
        params["state.banner.mailMessage.address"] = msg.venue.address;
        if (msg.venue.foursquare_id) params["state.banner.mailMessage.foursquare_id"] = msg.venue.foursquare_id;
        if (msg.venue.foursquare_type) params["state.banner.mailMessage.foursquare_type"] = msg.venue.foursquare_type;
        if (msg.venue.google_place_id) params["state.banner.mailMessage.google_place_id"] = msg.venue.google_place_id;
        if (msg.venue.google_place_type) params["state.banner.mailMessage.google_place_type"] = msg.venue.google_place_type;
      }
      if (msg.location) {
        params["state.banner.mailMessage.methodName"] = "sendLocation";
        params["state.banner.mailMessage.latitude"] = msg.location.latitude;
        params["state.banner.mailMessage.longitude"] = msg.location.longitude;
      }
      await msg.reply({text: `Превью:`});
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message", ...params});
      const nData = await Admins.findOne({"user.id": admin.user.id});
      await msg.reply({chat_id: nData.user.id, params: nData.state.banner.mailMessage, telegramMessage: true});
      return msg.reply({text: `Что дальше?`, keyboard: [[adminMailingAddButtons], [adminMailingContinue], [adminMailingMessagePreview], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddMessagePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add", $set: {"state.banner": {}}});
        return msg.reply({text: `Добавление баннера\nПришлите сообщение:`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminMailingAddButtons) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-add-buttons"});
        return msg.reply({text: `Напишите в формате:\n\ntitle - url\ntitle2 - url2\n\ntitle будет названием, url ссылкой\nкаждая новая кнопка с новой строки\n`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminMailingContinue) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-continue"});
        return msg.reply({text: `Баннер готов!`, keyboard: [[adminBannerSet], [adminBannerFilter], [adminCancelButton]]});
      }
      if (msg.text === adminMailingMessagePreview) {
        await msg.reply({telegramMessage: true, chat_id: admin.user.id, params: admin.state.banner.mailMessage});
        return msg.reply({text: `Что дальше?`, keyboard: [[adminMailingAddButtons], [adminMailingContinue], [adminMailingMessagePreview], [adminCancelButton]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddMessageAddButtonsPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message"});
        await msg.reply({telegramMessage: true, chat_id: admin.user.id, params: admin.state.banner.mailMessage});
        return msg.reply({text: `Что дальше?`, keyboard: [[adminMailingAddButtons], [adminMailingContinue], [adminMailingMessagePreview], [adminCancelButton]]});
      }
      const arrays = msg.text.split("\n");
      let buttons = [];
      for (let i = 0; i < arrays.length; i++) {buttons = [...buttons, [{text: arrays[i].split(" - ")[0], url: arrays[i].split(" - ")[1]}]];}
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message", "state.banner.mailMessage.reply_markup.inline_keyboard": buttons});
      await msg.reply({telegramMessage: true, chat_id: admin.user.id, params: admin.state.banner.mailMessage});
      return msg.reply({text: `Действия:`, keyboard: [[adminMailingMessagePreview], [adminMailingAddButtons], [adminMailingContinue], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddMessageContinuePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message"});
        await msg.reply({telegramMessage: true, chat_id: admin.user.id, params: admin.state.banner.mailMessage});
        return msg.reply({text: `Что дальше?`, keyboard: [[adminMailingAddButtons], [adminMailingContinue], [adminMailingMessagePreview], [adminCancelButton]]});
      }
      if (msg.text === adminBannerSet) {
        const newBanner = new Ads({name: admin.state.banner.name, mailMessage: admin.state.banner.mailMessage, filter: admin.state.banner.filter});
        await newBanner.save();
        await msg.reply({text: `Баннер создан успешно!`});
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home", $set: {"state.banner": {}}});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      if (msg.text === adminBannerFilter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddMessageFilterPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message"});
        await msg.reply({telegramMessage: true, chat_id: admin.user.id, params: admin.state.banner.mailMessage});
        return msg.reply({text: `Что дальше?`, keyboard: [[adminMailingAddButtons], [adminMailingContinue], [adminMailingMessagePreview], [adminCancelButton]]});
      }
      if (msg.text === adminBannerDone) {
        let params = {};
        if (admin.state.filterGender) params["state.banner.filter.gender"] = admin.state.filterGender;
        if (admin.state.filterAge.length) params["state.banner.filter.age"] = admin.state.filterAge;
        if (admin.state.filterCountry) params["state.banner.filter.country"] = admin.state.filterCountry;
        if (admin.state.filterTown) params["state.banner.filter.town"] = admin.state.filterTown;
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter-continue", ...params});
        await msg.reply({telegramMessage: true, chat_id: admin.user.id, params: admin.state.banner.mailMessage});
        return msg.reply({text: `Баннер готов!`, keyboard: [[adminBannerReady], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterGender) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter-gender"});
        return msg.reply({text: `Пол: ${admin.state.filterGender?admin.state.filterGender==="male"?"Мужской":"Женский":"все"}`, keyboard: [[adminStatisticsFilterGenderMale, adminStatisticsFilterGenderFemale], [adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterAge) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter-age"});
        return msg.reply({text: `Возраст: ${admin.state.filterAge.length?`${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length-1]}`:"все"}`, keyboard: [[adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterCountry) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter-country"});
        return msg.reply({text: `Страны: ${admin.state.filterCountry.length?admin.state.filterCountry.join(", "):"все"}`, keyboard: [...countriesData.map(c => {if (admin.state.filterCountry.includes(c)) return [`❌ ${c}`];
            return [c];}), [adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterTown) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter-town"});
        return msg.reply({text: `Города: ${admin.state.filterTown.length?admin.state.filterTown.join(", "):"все"}. (Нужно вводить через запятую, после запятой пробел) Москва, Ташкент...`, keyboard: [[adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddMessageFilterGenderPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", "state.filterGender": null});
        admin.state.filterGender = null;
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterGenderMale) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", "state.filterGender": "male"});
        admin.state.filterGender = "male";
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterGenderFemale) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", "state.filterGender": "female"});
        admin.state.filterGender = "female";
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddMessageFilterAgePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", "state.filterAge": []});
        admin.state.filterAge = [];
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      if (msg.text.split("-").length && msg.text.split("-").length === 2) {
        let arr = [];
        for (let i = Number(msg.text.split("-")[0]); i <= Number(msg.text.split("-")[1]); i++) {arr = [...arr, i];}
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", "state.filterAge": arr});
        admin.state.filterAge = arr;
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      return msg.reply({text: `Формат: X-Y`});
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddMessageFilterCountryPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", $set: {"state.filterCountry": []}});
        admin.state.filterCountry = [];
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      if (msg.text.startsWith("❌ ")) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", $pull: {"state.filterCountry": msg.text.substring(2, msg.text.length)}});
        admin.state.filterCountry.splice(admin.state.filterCountry.findIndex(b => b === msg.text.substring(2, msg.text.length)), 1);
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", $push: {"state.filterCountry": msg.text}});
      admin.state.filterCountry.push(msg.text);
      return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddMessageFilterTownPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", $set: {"state.filterTown": []}});
        admin.state.filterTown = [];
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter", $set: {"state.filterTown": msg.text.split(", ")}});
      admin.state.filterTown = msg.text.split(", ");
      return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminBannerAddMessageFilterContinuePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "banner-add-message-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry.length ? admin.state.filterCountry.join(", ") : "все"}\nГород: ${admin.state.filterTown.length ? admin.state.filterTown.join(", ") : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminBannerDone], [adminCancelButton]]});
      }
      if (msg.text === adminBannerReady) {
        const newBanner = new Ads({name: admin.state.banner.name, mailMessage: admin.state.banner.mailMessage, filter: admin.state.banner.filter});
        await newBanner.save();
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home", $set: {"state.banner": {}}});
        await msg.reply({text: `Баннер создан успешно!`});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminAdminsPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      if (msg.text.split("///").length && msg.text.split("///").length === 2) {
        const a = await Admins.findOne({"user.id": parseInt(msg.text.split("///")[1])});
        if (!a) return msg.reply({text: `Что-то пошло не так`});
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "admin-edit", "state.adminId": a._id.toString()});
        return msg.reply({text: `Админ: ${a.user.first_name}\nID: ${a.user.id}`, keyboard: [[adminAdminsDelete], [adminCancelButton]]});
      }
      return msg.reply({text: `Непонял(`});
    } catch (e) {
    console.log(e);
    }
  }, adminAdminsEditPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        const admins = await Admins.find({boss: false});
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "admins"});
        return msg.reply({text: `Админы`, keyboard: [...admins.map(a => [`${a.user.first_name}///${a.user.id}`]), [adminCancelButton]]});
      }
      if (msg.text === adminAdminsDelete) {
        const a = await Admins.findById(admin.state.adminId);
        const admins = await Admins.find({boss: false});
        await Admins.deleteOne({"user.id": a.user.id});
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "admins"});
        return msg.reply({text: `Админы`, keyboard: [...admins.map(a => [`${a.user.first_name}///${a.user.id}`]), [adminCancelButton]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminRulesPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
      }
      const settings = await DefaultSettings.findOne();
      settings.rulesText = msg.text;
      await settings.save();
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
      return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminRulesText], [adminClose]]});
    } catch (e) {
      console.log(e);
    }
  }
}
