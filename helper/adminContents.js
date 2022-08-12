const Admins = require("./../models/Admins");
const Users = require("./../models/Users");
const {adminStatistics, adminMailing, adminFreeTrialSearchesCount, adminChannelsToSubscribe, adminAdBanner,
  adminLinkForAdmins, adminAdmins, adminClose, randomPartner, searchByCity, chatRestricted, profile, vipAccess,
  adminStatisticsFilterGender, adminStatisticsFilterAge, adminStatisticsFilterTown, adminStatisticsFilterShow,
  adminStatisticsFilterExit, adminStatisticsFilterGenderMale, adminStatisticsFilterGenderFemale, adminStatisticsFilter,
  adminCancelButton, adminStatisticsFilterCountry, adminStatisticsFilterDoesntMatter, adminMailAll, adminMailFilter,
  adminMailingAddButtons, adminMailingContinue, adminMailingMessagePreview
} = require("./buttons");
const moment = require("moment");
const {countriesData} = require("./countries");
module.exports = {
  adminMainPage: async (msg, admin) => {
    try {
      await Users.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
      return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminClose]]});
    } catch (e) {
      console.log(e);
    }
  }, adminHomepage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminClose) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "none"});
        return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
      }
      if (msg.text === adminStatistics) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics"});
        const users = await Users.find();
        const left = await Users.find({left: true});
        const lastDay = await Users.find({joinDate: {$lte: moment().add(-1, "day").toDate()}});
        const vipUsers = await Users.find({vip: true});
        return msg.reply({text: `Всего пользователей: ${users.length}\nПокинули бота: ${left.length}\nПрисоединились за последние 24 часа: ${lastDay.length}\nVIP пользователи: ${vipUsers.length}`, keyboard: [[adminStatisticsFilter], [adminCancelButton]]});
      }
      if (msg.text === adminMailing) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing"});
        return msg.reply({text: `Панель рассылки`, keyboard: [[adminMailAll], [adminMailFilter]]});
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
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminClose]]});
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
        return msg.reply({text: `Страна: ${admin.state.filterCountry?admin.state.filterCountry:"все"}`, keyboard: [...countriesData.map(c => [c]), [adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterTown) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter-town"});
        return msg.reply({text: `Город: ${admin.state.filterTown?admin.state.filterTown:"все"}`, keyboard: [[adminStatisticsFilterDoesntMatter], [adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterShow) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter-show"});
        let options = {};
        if (admin.state.filterGender) options.gender = admin.state.filterGender;
        if (admin.state.filterAge) options.age = {$gte: admin.state.filterAge[0], $lte: admin.state.filterAge[admin.state.filterAge.length-1]};
        if (admin.state.filterCountry) options.country = admin.state.filterCountry;
        if (admin.state.filterTown) options.town = {$regex: admin.state.filterTown, $options: "i"};
        options.left = false;
        const users = await Users.find(options);
        return msg.reply({text: `По данному фильтру найдено ${users.length} пользователей`, keyboard: [[adminCancelButton]]});
      }
      if (msg.text === adminStatisticsFilterExit) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminClose]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterGenderPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterGender": null});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterGenderFemale) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterGender": "female"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterGenderMale) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterGender": "male"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterAgePage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", $set: {"state.filterAge": []}});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text.split("-").length && msg.text.split("-").length === 2) {
        let arr = [];
        for (let i = Number(msg.text.split("-")[0]); i <= Number(msg.text.split("-")[1]); i++) {arr = [...arr, i];}
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterAge": arr});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
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
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterCountry": null});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterCountry": msg.text});
      return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
    } catch (e) {
      console.log(e);
    }
  }, adminStatisticsFilterTownPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter"});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      if (msg.text === adminStatisticsFilterDoesntMatter) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterTown": null});
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "statistics-filter", "state.filterTown": msg.text});
      return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
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
        return msg.reply({text: `Выбранные фильтры: \nПол: ${admin.state.filterGender ? admin.state.filterGender === "male" ? "Мужской" : "Женский" : "все"}\nВозраст: ${admin.state.filterAge.length ? `${admin.state.filterAge[0]}-${admin.state.filterAge[admin.state.filterAge.length - 1]}` : "все"}\nСтрана: ${admin.state.filterCountry ? admin.state.filterCountry : "все"}\nГород: ${admin.state.filterTown ? admin.state.filterTown : "все"}`, keyboard: [[adminStatisticsFilterGender], [adminStatisticsFilterAge], [adminStatisticsFilterCountry], [adminStatisticsFilterTown], [adminStatisticsFilterShow], [adminStatisticsFilterExit]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminMailingAllPage: async (msg, admin) => {
    try {
      if (msg.text && msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "home"});
        return msg.reply({text: `Админ панель`, keyboard: [[adminStatistics], [adminMailing], [adminFreeTrialSearchesCount], [adminChannelsToSubscribe], [adminAdBanner], [adminLinkForAdmins], [adminAdmins], [adminClose]]});
      }
      let params = {};
      if (msg.text) {
        params["state.mailing.mailMessage.methodName"] = "sendMessage";
        params["state.mailing.mailMessage.text"] = msg.text;
        params["state.mailing.mailMessage.entities"] = msg.entities;
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
        params["state.mailing.mailMessage.methodName"] = "sendVenue";
        params["state.mailing.mailMessage.latitude"] = msg.venue.location.latitude;
        params["state.mailing.mailMessage.longitude"] = msg.venue.location.longitude;
      }
      await msg.reply({text: `Превью:`});
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message", ...params});
      const nData = await Admins.findOne({"user.id": admin.user.id});
      await msg.send({chat_id: nData.user.id, ...nData.state.mailing.mailMessage});
      return msg.reply({text: `Дальнейшие действия:`, keyboard: [[adminMailingMessagePreview], [adminMailingAddButtons], [adminMailingContinue], [adminCancelButton]]});
    } catch (e) {
      console.log(e);
    }
  }, adminMailingFilterPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      // TODO A LOT!
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
        // TODO
      }
      if (msg.text === adminCancelButton) {
        // TODO
      }
      if (msg.text === adminMailingMessagePreview) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message"});
        return msg.send({chat_id: admin.user.id, ...admin.state.mailing.mailMessage});
      }
    } catch (e) {
      console.log(e);
    }
  }, adminMailingAllMessageAddButtonsPage: async (msg, admin) => {
    try {
      if (!msg.text) return;
      if (msg.text === adminCancelButton) {
        await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message"});
        return msg.send({chat_id: admin.user.id, ...admin.state.mailing.mailMessage});
      }
      const arrays = msg.text.split("\n");
      let buttons = [];
      for (let i = 0; i < arrays.length; i++) {buttons = [...buttons, [{text: arrays[i].split(" - ")[0], url: arrays[i].split(" - ")[1]}]];}
      await Admins.findOneAndUpdate({"user.id": admin.user.id}, {"state.on": "mailing-all-message", "state.mailing.mailMessage.reply_markup.inline_keyboard": buttons});
      return msg.send({chat_id: admin.user.id, ...admin.state.mailing.mailMessage});
    } catch (e) {
      console.log(e);
    }
  },
}
