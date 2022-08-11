const Admins = require("./../models/Admins");
const Users = require("./../models/Users");
const {adminStatistics, adminMailing, adminFreeTrialSearchesCount, adminChannelsToSubscribe, adminAdBanner,
  adminLinkForAdmins, adminAdmins, adminClose, randomPartner, searchByCity, chatRestricted, profile, vipAccess,
  adminStatisticsFilterGender, adminStatisticsFilterAge, adminStatisticsFilterTown, adminStatisticsFilterShow,
  adminStatisticsFilterExit, adminStatisticsFilterGenderMale, adminStatisticsFilterGenderFemale, adminStatisticsFilter,
  adminCancelButton, adminStatisticsFilterCountry, adminStatisticsFilterDoesntMatter, adminMailAll, adminMailFilter
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
      // TODO A LOT!
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
  }
}
