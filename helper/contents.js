const moment = require("moment");
const Users = require("./../models/Users");
const Bills = require("./../models/Bills");
const DefaultSettings = require("./../models/DefaultSettings");
const {chooseGenderMale, chooseGenderFemale, goBack, skip, randomPartner, searchByCity, chatRestricted, profile,
  vipAccess, profileEdit, profileVip, vipTryFree, cancelSearch, endDialog, backToMenu, fillGender, fillAge,
  fillCountry, fillTown, fillSearch, doesntMatter, filterBack, fillExit, backRequestsExit, backRequestOpen,
  backRequestReject, backRequestStartChat, backRequestSkip, countryReady
} = require("./buttons");
const {countriesData} = require("./countries");
const {serverUrl} = require("./config");
const {choosingGenderValidator, choosingAgeValidator, choosingAgeIntValidator, choosingCountryValidator,
  choosingTownValidator, unknownMessageHomepageValidator, unknownCommandValidator, wrongAgeFillingValidator,
  sequenceErrorValidator, wrongCountryFillingValidator, backRequestValidator, choosePossibleOptionValidator,
  availableForVipOnlyValidator
} = require("./validators");
module.exports = {
  welcomeMessage: async (msg, user) => {
    try {
      await msg.reply({text: `Добро пожаловать, <b>${user.user.first_name}</b>!`});
      return msg.reply({text: `Какой у вас пол?`, keyboard: [[chooseGenderMale], [chooseGenderFemale]]});
    } catch (e) {
      console.log(e);
    }
  }, choosingGender: async (msg, user) => {
    try {
      if (!msg.text) return choosingGenderValidator(msg);
      if (msg.text !== chooseGenderMale && msg.text !== chooseGenderFemale) return choosingGenderValidator(msg);
      if (msg.text === chooseGenderMale) await Users.findOneAndUpdate({"user.id": user.user.id}, {gender: "male", "state.on": "age"});
      if (msg.text === chooseGenderFemale) await Users.findOneAndUpdate({"user.id": user.user.id}, {gender: "female", "state.on": "age"});
      return msg.reply({text: `Сколько вам лет?`, keyboard: [[goBack]]});
    } catch (e) {
      console.log(e);
    }
  }, choosingAge: async (msg, user) => {
    try {
      if (!msg.text) return choosingAgeValidator(msg);
      if (msg.text === goBack) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {gender: null, "state.on": "gender"});
        return msg.reply({text: `Какой у вас пол?`, keyboard: [[chooseGenderMale], [chooseGenderFemale]]});
      }
      if (!parseInt(msg.text)) return choosingAgeIntValidator(msg);
      await Users.findOneAndUpdate({"user.id": user.user.id}, {age: parseInt(msg.text), "state.on": "country"});
      return msg.reply({text: `Выберите свою страну`, keyboard: [...countriesData.map(c => [c]), [goBack]]});
    } catch (e) {
      console.log(e);
    }
  }, choosingCountry: async (msg, user) => {
    try {
      if (!msg.text) return choosingCountryValidator(msg);
      if (msg.text === goBack) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {age: null, "state.on": "age"});
        return msg.reply({text: `Сколько вам лет?`, keyboard: [[goBack]]});
      }
      if (msg.text === countryReady) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "town"});
        return msg.reply({text: `Выберите свой город:`, keyboard: [[skip], [goBack]]});
      }
      if (msg.text.startsWith("❌ ")) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {$pull: {country: msg.text.substring(2, msg.text.length)}});
        user.country.splice(user.country.findIndex(b => b === msg.text.substring(2, msg.text.length)), 1);
        return msg.reply({text: `Ваши страны: ${user.country.join(", ")}`, keyboard: [...countriesData.map(c => {if (user.country.includes(c)) return [`❌ ${c}`];
          return [c];}), [countryReady], [goBack]]});
      }
      if (!countriesData.includes(msg.text)) return choosingCountryValidator(msg);
      await Users.findOneAndUpdate({"user.id": user.user.id}, {$push: {country: msg.text}, "state.on": "country"});
      user.country.push(msg.text)
      return msg.reply({text: `Ваши страны: ${user.country.join(", ")}`, keyboard: [...countriesData.map(c => {
        if (user.country.includes(c)) return [`❌ ${c}`]
        return [c];
      }), [countryReady], [goBack]]});
    } catch (e) {
      console.log(e);
    }
  }, choosingTown: async (msg, user) => {
    try {
      if (!msg.text) return choosingTownValidator(msg);
      if (msg.text === goBack) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {country: null, "state.on": "country"});
        return msg.reply({text: `Выберите свою страну`, keyboard: [...countriesData.map(c => [c]), [goBack]]});
      }
      await Users.findOneAndUpdate({"user.id": user.user.id}, {town: msg.text===skip?null:msg.text, "state.on": "home"});
      return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
    } catch (e) {
      console.log(e);
    }
  }, homepage: async (msg, user) => {
    try {
      if (!msg.text) return unknownMessageHomepageValidator(msg);
      if (user.backRequests.length) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "back-request-read"});
        return msg.reply({text: `У вас новые запросы на общение от ${user.backRequests.length!==1?"людей":"человека"}`, keyboard: [[backRequestOpen], [backRequestReject]]});
      }
      if (msg.text === randomPartner) {
        const searchResult = await Users.find({"state.on": "search-random-partner", "user.id": {$ne: user.user.id}}).sort("lastAction");
        let partner = searchResult.length?searchResult[0]:null;
        if (!partner) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `Ищем собеседника`, keyboard: [[cancelSearch]]});
        }
        if (partner.state.gender && partner.state.gender !== user.gender) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `Ищем собеседника`, keyboard: [[cancelSearch]]});
        }
        if (partner.state.age.length && !partner.state.age.includes(user.age)) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `Ищем собеседника`, keyboard: [[cancelSearch]]});
        }
        if (partner.state.country && !user.country.includes(partner.state.country)) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `Ищем собеседника`, keyboard: [[cancelSearch]]});
        }
        if (partner.state.town && user.town && partner.state.town !== user.town) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `Ищем собеседника`, keyboard: [[cancelSearch]]});
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
          return msg.reply({text: `Ищем собеседника`, keyboard: [[cancelSearch]]});
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
        return msg.reply({text: `Мой профиль\n\nПол: ${user.gender === "male" ? chooseGenderMale : chooseGenderFemale}\nВозраст: ${user.age}\n\nVIP: ${user.vip ? user.vipUnlimited ? "Да(навсегда)" : user.trialSearches !== 0 ? `${user.trialSearches} пробных вип поисков` : user.vipUntilDate ? moment(user.vipUntilDate).format("MM/DD/YYYY") : "Нет" : "Нет"}\n\nВсего диалогов: ${user.totalDialogs}\nВсего сообщений: ${user.totalMessages}`, inline_keyboard: [[{text: profileEdit, callback_data: "edit"}], [{text: profileVip, callback_data: "vip"}]]});
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
      return msg.reply({text: `Для использования бота пользуйся кнопками снизу`});
    } catch (e) {
      console.log(e);
    }
  }, profilePage: async (query, user) => {
    try {
      if (!query.data) return;
      if (query.data === "edit") {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {gender: null, age: null, country: null, town: null, "state.on": "gender"});
        return query.edit({text: `Какой у вас пол?`, keyboard: [[chooseGenderMale], [chooseGenderFemale]]});
      }
      if (query.data === "vip") {
        if (user.vip) return query.edit({text: `У вас уже есть VIP`});
        const settings = await DefaultSettings.findOne();
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "choose-vip-plan"});
        let buttons = [[{text: `24 часа ${settings.vipDailyPrice}р`, callback_data: "24h"}], [{text: `7 дней ${settings.vipWeeklyPrice}р`, callback_data: "7d"}], [{text: `1 месяц ${settings.vipMonthlyPrice}р`, callback_data: "1M"}], [{text: `Навсегда ${settings.vipForeverPrice}р`, callback_data: "forever"}]];
        if (user.hasFreeTrial) buttons = [[{text: `${vipTryFree}(${settings.freeTrialSearches} поисков)`, callback_data: "try-free"}], ...buttons];
        return query.edit({text: `Выберите тарифный план`, inline_keyboard: buttons});
      }
    } catch (e) {
      console.log(e);
    }
  }, choosingVipPlan: async (query, user, qiwiApi) => {
    try {
      if (!query.data) return;
      const settings = await DefaultSettings.findOne();
      if (query.data === "try-free") {
        if (!user.hasFreeTrial) return query.alert({text: "ERROR"});
        await Users.findOneAndUpdate({"user.id": user.user.id}, {vip: true, trialSearches: settings.freeTrialSearches, hasFreeTrial: false, "state.on": "home"});
        return query.edit({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
      }
      const newBill = new Bills({amount: query.data==="24h"?settings.vipDailyPrice:query.data==="7d"?settings.vipWeeklyPrice:query.data==="1M"?settings.vipMonthlyPrice:settings.vipForeverPrice, account: user._id.toString()});
      await newBill.save();
      const data = await qiwiApi.createBill(newBill._id.toString(), {amount: newBill.amount, currency: 'RUB', comment: 'New purchase from TestMessageAnonBot', expirationDateTime: newBill.expirationDateTime.toISOString(), account: newBill.account, successUrl: `${serverUrl}/invoices`});
      await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "checkout", "state.plan": query.data, "state.billId": newBill._id.toString()});
      return query.edit({text: `Итого к оплате ${newBill.amount}р. Система QIWI. Если не оплатите в течении 15 минут, срок счета истечет`, inline_keyboard: [[{text: `Оплатить`, url: data.payUrl}]]});
    } catch (e) {
      console.log(e);
    }
  }, choosingChatVipPlan: async (query, user, qiwiApi) => {
    try {
      if (!query.data) return;
      const settings = await DefaultSettings.findOne();
      if (user.hasFreeTrial && query.data === "try-free") {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {vip: true, trialSearches: settings.freeTrialSearches, hasFreeTrial: false, "state.on": "chat"});
        return query.edit({text: `Можете продолжать общение в чате:`});
      }
      const newBill = new Bills({amount: settings.vipDailyPrice, account: user._id.toString()});
      await newBill.save();
      const data = await qiwiApi.createBill(newBill._id.toString(), {amount: newBill.amount, currency: 'RUB', comment: 'New purchase from TestMessageAnonBot', expirationDateTime: newBill.expirationDateTime.toISOString(), account: newBill.account, successUrl: `${serverUrl}/invoices`});
      await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "chat-checkout", "state.plan": query.data, "state.billId": newBill._id.toString()});
      return query.edit({text: `Итого к оплате ${newBill.amount}р. Система QIWI. Если не оплатите в течении 15 минут, срок счета истечет`, inline_keyboard: [[{text: `Оплатить`, url: data.payUrl}]]});
    } catch (e) {
      console.log(e);
    }
  }, randomPartnerPage: async (msg, user) => {
    try {
      if (!msg.text) return unknownCommandValidator(msg);
      if (msg.text === cancelSearch) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "home"});
        return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, randomPartnerRestrictedPage: async (msg, user) => {
    try {
      if (!msg.text) return unknownCommandValidator(msg);
      if (msg.text === cancelSearch) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "home",});
        return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, filterPartnerPage: async (msg, user) => {
    try {
      let fillField = "";
      let params = {};
      if (!msg.text) return unknownCommandValidator(msg);
      if (msg.text === fillExit) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "home"});
        return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
      }
      if (msg.text === fillSearch) {
        let otherParams = {};
        if (user.state.gender) otherParams.gender = user.state.gender;
        if (user.state.age) otherParams.age = {$in: user.state.age};
        if (user.state.country) otherParams.country = user.state.country;
        if (user.state.town) otherParams.town = user.state.town;
        const searchResult = await Users.find({"state.on": "search-random-partner", "user.id": {$ne: user.user.id}, ...otherParams, "state.gender": {$exists: true, $in: [user.gender]}, "state.age": {$exists: true, $in: [user.age]}, "state.country": {$exists: true, $in: user.country}, "state.town": {$exists: true, $in: [user.town]}}).sort("lastAction");
        const partner = searchResult.length?searchResult[0]:null;
        if (!partner) {
          if (user.trialSearches === 1) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner", trialSearches: 0});
          if (user.trialSearches > 1) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner", trialSearches: user.trialSearches-1});
          return msg.reply({text: `Ищем собеседника`, keyboard: [[cancelSearch]]});
        }
        if (user.trialSearches === 1) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "chat", partner: partner._id.toString(), trialSearches: 0, totalDialogs: user.totalDialogs+1});
        if (user.trialSearches > 1) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "chat", partner: partner._id.toString(), trialSearches: user.trialSearches-1, totalDialogs: user.totalDialogs+1});
        await Users.findOneAndUpdate({"user.id": partner.user.id}, {"state.on": "chat", partner: user._id.toString(), totalDialogs: partner.totalDialogs+1});
        await msg.reply({chatId: user.user.id, text: `Собеседник найден. Приятного общения. \n/stop - Закончить диалог${user.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        await msg.reply({chatId: partner.user.id, text: `Собеседник найден. Приятного общения. \n/stop - Закончить диалог${partner.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        return;
      }
      if (msg.text !== fillGender && msg.text !== fillAge && msg.text !== fillCountry && msg.text !== fillTown) return choosePossibleOptionValidator(msg);
      if (msg.text === fillGender) {
        fillField = "gender";
        params = {text: `Пол: ${user.state.gender?user.state.gender==="male"?"Мужской":"Женский":"Без разницы"}`, keyboard: [[chooseGenderMale], [chooseGenderFemale], [doesntMatter], [filterBack]]};
      }
      if (msg.text === fillAge) {
        fillField = "age";
        params = {text: `Задайте возраст в формате 18-20, либо 18`, keyboard: [[doesntMatter], [filterBack]]};
      }
      if (msg.text === fillCountry) {
        fillField = "country";
        params = {text: `Выберите страну:`, keyboard: [...countriesData.map(c => [c]), [doesntMatter], [filterBack]]};
      }
      if (msg.text === fillTown) {
        fillField = "town";
        params = {text: `Выберите страну:`, keyboard: [[doesntMatter], [filterBack]]};
      }
      await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": `search-filter-partner-fill-${fillField}`});
      return msg.reply(params);
    } catch (e) {
      console.log(e);
    }
  }, filterFillGenderPage: async (msg, user) => {
    try {
      if (!msg.text) return unknownCommandValidator(msg);
      if (msg.text === doesntMatter) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.gender": null, "state.on": "search-filter-partner"});
      if (msg.text === filterBack) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-filter-partner"});
      if (msg.text === chooseGenderMale) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.gender": "male", "state.on": "search-filter-partner"});
      if (msg.text === chooseGenderFemale) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.gender": "female", "state.on": "search-filter-partner"});
      return msg.reply({text: `Заданные параметры:\nПол: ${user.state.gender==="male"?"Мужской":user.state.gender==="female"?"Женский":"Без разницы"}\nВозраст: ${user.state.age || "Без разницы"}\nСтрана: ${user.state.country || "Без разницы"}\nГород: ${user.state.town || "Без разницы"}`, keyboard: [[fillSearch], [fillGender], [fillAge], [fillCountry], [fillTown]]});
    } catch (e) {
      console.log(e);
    }
  }, filterFillAgePage: async (msg, user) => {
    try {
      if (!msg.text) return unknownCommandValidator(msg);
      if (msg.text === doesntMatter) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.age": [], "state.on": "search-filter-partner"});
        return msg.reply({text: `Заданные параметры:\nПол: ${user.state.gender==="male"?"Мужской":user.state.gender==="female"?"Женский":"Без разницы"}\nВозраст: ${user.state.age || "Без разницы"}\nСтрана: ${user.state.country || "Без разницы"}\nГород: ${user.state.town || "Без разницы"}`, keyboard: [[fillSearch], [fillGender], [fillAge], [fillCountry], [fillTown]]});
      }
      if (msg.text === filterBack) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-filter-partner"});
        return msg.reply({text: `Заданные параметры:\nПол: ${user.state.gender==="male"?"Мужской":user.state.gender==="female"?"Женский":"Без разницы"}\nВозраст: ${user.state.age || "Без разницы"}\nСтрана: ${user.state.country || "Без разницы"}\nГород: ${user.state.town || "Без разницы"}`, keyboard: [[fillSearch], [fillGender], [fillAge], [fillCountry], [fillTown]]});
      }
      if (msg.text.trim().startsWith("-")) return wrongAgeFillingValidator(msg);
      if (msg.text.split("-") && msg.text.split("-").length && msg.text.split("-").length === 2) {
        if (!Number(msg.text.split("-")[0])) return wrongAgeFillingValidator(msg);
        if (!Number(msg.text.split("-")[1])) return wrongAgeFillingValidator(msg);
        if (Number(msg.text.split("-")[1]) < Number(msg.text.split("-")[0])) return sequenceErrorValidator(msg);
        if (Number(msg.text.split("-")[1]) === Number(msg.text.split("-")[0])) return wrongAgeFillingValidator(msg);
        let value = []
        for (let i = msg.text.split("-").map(v => Number(v))[0]; i <= msg.text.split("-").map(v => Number(v))[1]; i++) {value = [...value, i];}
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-filter-partner", "state.age": value});
        return msg.reply({text: `Заданные параметры:\nПол: ${user.state.gender==="male"?"Мужской":user.state.gender==="female"?"Женский":"Без разницы"}\nВозраст: ${user.state.age || "Без разницы"}\nСтрана: ${user.state.country || "Без разницы"}\nГород: ${user.state.town || "Без разницы"}`, keyboard: [[fillSearch], [fillGender], [fillAge], [fillCountry], [fillTown]]});
      }
      if (!Number(msg.text)) return wrongAgeFillingValidator(msg);
      await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-filter-partner", "state.age": [Number(msg.text)]});
      return msg.reply({text: `Заданные параметры:\nПол: ${user.state.gender==="male"?"Мужской":user.state.gender==="female"?"Женский":"Без разницы"}\nВозраст: ${user.state.age || "Без разницы"}\nСтрана: ${user.state.country || "Без разницы"}\nГород: ${user.state.town || "Без разницы"}`, keyboard: [[fillSearch], [fillGender], [fillAge], [fillCountry], [fillTown]]});
    } catch (e) {
      console.log(e);
    }
  }, filterFillCountryPage: async (msg, user) => {
    try {
      if (!msg.text) return wrongCountryFillingValidator(msg);
      if (msg.text === doesntMatter) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.country": null, "state.on": "search-filter-partner"});
      if (msg.text === filterBack) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-filter-partner"});
      if (countriesData.includes(msg.text)) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.country": msg.text, "state.on": "search-filter-partner"});
      return msg.reply({text: `Заданные параметры:\nПол: ${user.state.gender==="male"?"Мужской":user.state.gender==="female"?"Женский":"Без разницы"}\nВозраст: ${user.state.age || "Без разницы"}\nСтрана: ${user.state.country || "Без разницы"}\nГород: ${user.state.town || "Без разницы"}`, keyboard: [[fillSearch], [fillGender], [fillAge], [fillCountry], [fillTown]]});
    } catch (e) {
      console.log(e);
    }
  }, filterFillTownPage: async (msg, user) => {
    try {
      if (!msg.text) return choosingTownValidator(msg);
      if (msg.text === doesntMatter) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.town": null, "state.on": "search-filter-partner"});
      if (msg.text === filterBack) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-filter-partner"});
      if (msg.text !== doesntMatter && msg.text !== filterBack) await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-filter-partner", "state.town": msg.text});
      return msg.reply({text: `Заданные параметры:\nПол: ${user.state.gender==="male"?"Мужской":user.state.gender==="female"?"Женский":"Без разницы"}\nВозраст: ${user.state.age || "Без разницы"}\nСтрана: ${user.state.country || "Без разницы"}\nГород: ${user.state.town || "Без разницы"}`, keyboard: [[fillSearch], [fillGender], [fillAge], [fillCountry], [fillTown]]});
    } catch (e) {
      console.log(e);
    }
  }, chatPage: async (msg, user) => {
    try {
      const partner = await Users.findById(user.partner);
      if (msg.text && msg.text === "/stop" || msg.text === endDialog) {
        let userOptions = {};
        let partnerOptions = {};
        if (user.vip && user.trialSearches === 0) userOptions = {vip: false, lastVipAccess: true};
        if (partner.vip && partner.trialSearches === 0) partnerOptions = {vip: false, lastVipAccess: true};
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "ended-chat", "state.partner": user.partner, partner: null, ...userOptions});
        await Users.findOneAndUpdate({"user.id": partner.user.id}, {"state.on": "ended-chat", "state.partner": partner.partner, partner: null, ...partnerOptions});
        await msg.reply({chatId: user.user.id, text: `Вы закончили диалог с собеседником\n/next - Найти следующего\n/back - вернуть собеседника\n/report - пожаловаться на спам`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
        await msg.reply({chatId: partner.user.id, text: `Ваш собеседник окончил диалог с вами\n/next - Найти следующего\n/back - вернуть собеседника\n/report - пожаловаться на спам`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
        return;
      }
      if (msg.text && msg.text === "/vip") {
        if (user.vip) return msg.reply({text: `У вас уже есть VIP`});
        const settings = await DefaultSettings.findOne();
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "choose-chat-vip-plan"});
        let buttons = [[{text: `24 часа ${settings.vipDailyPrice}р`, callback_data: "24h"}], [{text: `7 дней ${settings.vipWeeklyPrice}р`, callback_data: "7d"}], [{text: `1 месяц ${settings.vipMonthlyPrice}р`, callback_data: "1M"}], [{text: `Навсегда ${settings.vipForeverPrice}р`, callback_data: "forever"}]];
        if (user.hasFreeTrial) buttons = [[{text: `${vipTryFree}(${settings.freeTrialSearches} поисков)`, callback_data: "try-free"}], ...buttons];
        return msg.reply({text: `Выберите тарифный план`, inline_keyboard: buttons});
      }
      await Users.findOneAndUpdate({"user.id": user.user.id}, {totalMessages: user.totalMessages+1});
      return msg.reply({chatId: partner.user.id, fromChatId: user.user.id, messageId: msg.message_id});
    } catch (e) {
      console.log(e);
    }
  }, endedChatPage: async (msg, user) => {
    try {
      if (!msg.text) return unknownMessageHomepageValidator(msg);
      if (user.backRequests.length) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "back-request-read"});
        return msg.reply({text: `У вас новые запросы на общение от ${user.backRequests.length!==1?"людей":"человека"}`, keyboard: [[backRequestOpen], [backRequestReject]]});
      }
      if (msg.text === "/report") {
        const partner = await Users.findById(user.state.partner);
        await Users.findOneAndUpdate({"user.id": partner.user.id}, {reportsCount: partner.reportsCount+1});
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "home", "state.partner": null});
        return msg.reply({text: `Жалоба отправлена. На рассмотрении модераторами`});
      }
      if (msg.text === "/back") {
        if (!user.vip && !user.lastVipAccess) return availableForVipOnlyValidator(msg);
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "back-request"});
        return msg.reply({text: `Введи текст запроса чтобы получатель понял, кто его оправил.\n\nПример:\nпривет, я Олег 22 года, случайно завершил диалог, давай продолжим?`, keyboard: [[backToMenu]]});
      }
      if (msg.text === "/next") {
        const searchResult = await Users.find({"state.on": "search-random-partner", "user.id": {$ne: user.user.id}, "state.gender": {$exists: true, $in: [user.gender]}, "state.age": {$exists: true, $in: [user.age]}, "state.country": {$exists: true, $in: user.country}, "state.town": {$exists: true, $in: [user.town]}}).sort("lastAction");
        const partner = searchResult.length?searchResult[0]:null;
        if (!partner) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "search-random-partner"});
          return msg.reply({text: `Ищем собеседника`, keyboard: [[cancelSearch]]});
        }
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "chat", partner: partner._id.toString()});
        await Users.findOneAndUpdate({"user.id": partner.user.id}, {"state.on": "chat", partner: user._id.toString()});
        await msg.reply({chatId: user.user.id, text: `Собеседник найден. Приятного общения. \n/stop - Закончить диалог${user.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        await msg.reply({chatId: partner.user.id, text: `Собеседник найден. Приятного общения. \n/stop - Закончить диалог${partner.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        return;
      }
      return true;
    } catch (e) {
      console.log(e);
    }
  }, backRequestPage: async (msg, user) => {
    try {
      if (!msg.text) return backRequestValidator(msg);
      const partner = await Users.findById(user.state.partner);
      if (msg.text === backToMenu) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "home", "state.partner": null});
        return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
      }
      await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "back-request-waiting", "state.user": partner._id.toString()});
      await Users.findOneAndUpdate({"user.id": partner.user.id}, {$push: {backRequests: {date: moment().toDate(), from: user._id.toString(), content: msg.text}}});
      if (partner.state.on !== "chat" && partner.state.on !== "back-request" && partner.state.on !== "search-filter-partner-fill-town" && partner.state.on !== "search-filter-partner-fill-country" && partner.state.on !== "search-filter-partner-fill-age" && partner.state.on !== "search-filter-partner-fill-gender" && partner.state.on !== "search-filter-partner" && partner.state.on !== "gender" && partner.state.on !== "age" && partner.state.on !== "country" && partner.state.on !== "town") {
        await Users.findOneAndUpdate({"user.id": partner.user.id}, {"state.on": "back-request-read"});
        await msg.reply({chatId: partner.user.id, text: `У вас новые запросы на общение от ${user.backRequests.length!==1?"людей":"человека"}`, keyboard: [[backRequestOpen], [backRequestReject]]});
      }
      return msg.reply({text: `Ваш запрос отправлен пользователю`, keyboard: [[backRequestsExit]]});
    } catch (e) {
      console.log(e);
    }
  }, backRequestWaitingPage: async (msg, user) => {
    try {
      if (!msg.text) return unknownMessageHomepageValidator(msg);
      const partner = await Users.findById(user.state.user);
      if (msg.text === backRequestsExit) {
        await Users.findOneAndUpdate({"user.id": partner.user.id}, {$pull: {backRequests: {from: user._id.toString()}}});
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "home", "state.plan": null, "state.billId": null, "state.gender": null, "state.age": [], "state.country": null, "state.town": null, "state.user": null, "state.partner": null});
        return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, backRequestReadingPage: async (msg, user) => {
    try {
      if (!msg.text) return choosePossibleOptionValidator(msg);
      if (msg.text === backRequestOpen) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "back-request-see-requests"});
        return msg.reply({text: `${user.backRequests[0].content}`, keyboard: [[backRequestStartChat], [backRequestSkip]]});
      }
      if (msg.text === backRequestReject) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {$set: {backRequests: []}, "state.on": "home", "state.plan": null, "state.billId": null, "state.gender": null, "state.age": [], "state.country": null, "state.town": null, "state.user": null, "state.partner": null});
        return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
      }
    } catch (e) {
      console.log(e);
    }
  }, backRequestSeePage: async (msg, user) => {
    try {
      if (!msg.text) return choosePossibleOptionValidator(msg);
      const partner = await Users.findById(user.backRequests[0].from);
      if (msg.text === backRequestStartChat) {
        if (partner.state.on !== "back-request-waiting") {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "back-request-see-requests", backRequests: {$pull: {from: user.backRequests[0].from}}});
          await msg.reply({text: `Пока вы думали этот пользователь уже передумал общаться`});
          if (user.backRequests.length === 1) {
            await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "home", "state.plan": null, "state.billId": null, "state.gender": null, "state.age": [], "state.country": null, "state.town": null, "state.user": null, "state.partner": null});
            return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
          }
          return msg.reply({text: `${user.backRequests[1].content}`, keyboard: [[backRequestStartChat], [backRequestSkip]]});
        }
        await Users.findOneAndUpdate({"user.id": partner.user.id}, {"state.on": "chat", partner: user._id.toString(), "state.user": null});
        await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "chat", partner: user.backRequests[0].from, backRequests: {$pull: {from: user.backRequests[0].from}}});
        await msg.reply({chatId: user.user.id, text: `Можете начинать общение с этим собеседником. Приятного общения. \n/stop - Закончить диалог${user.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        await msg.reply({chatId: partner.user.id, text: `Собеседник принял ваш запрос на общение. Приятного общения. \n/stop - Закончить диалог${partner.vip?"":"\n/vip - Получить VIP"}`, keyboard: [[endDialog]]});
        return;
      }
      if (msg.text === backRequestSkip) {
        await Users.findOneAndUpdate({"user.id": user.user.id}, {backRequests: {$pull: {from: user.backRequests[0].from}}});
        if (user.backRequests.length === 1) {
          await Users.findOneAndUpdate({"user.id": user.user.id}, {"state.on": "home", "state.plan": null, "state.billId": null, "state.gender": null, "state.age": [], "state.country": null, "state.town": null, "state.user": null, "state.partner": null});
          return msg.reply({text: `Выбери действие:`, keyboard: [[randomPartner], [searchByCity, chatRestricted], [profile, vipAccess]]});
        }
        return msg.reply({text: `${user.backRequests[1].content}`, keyboard: [[backRequestStartChat], [backRequestSkip]]});
      }
    } catch (e) {
      console.log(e);
    }
  },
}
