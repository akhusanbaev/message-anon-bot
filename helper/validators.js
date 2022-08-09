const {chooseGenderMale, chooseGenderFemale, goBack} = require("./buttons");
const {countriesData} = require("./countries");
module.exports = {
  choosingGenderValidator: async msg => {
    try {
      return msg.reply({text: `Выбери один из вариантов`, keyboard: [[chooseGenderMale], [chooseGenderFemale]]});
    } catch (e) {
      console.log(e);
    }
  }, choosingAgeValidator: async msg => {
    try {
      return msg.reply({text: `Напиши сколько тее лет в виде сообщения`});
    } catch (e) {
      console.log(e);
    }
  }, choosingAgeIntValidator: async msg => {
    try {
      return msg.reply({text: `Должно быть цело число`});
    } catch (e) {
      console.log(e);
    }
  }, choosingCountryValidator: async msg => {
    try {
      return msg.reply({text: `Выбери один из доступных стран:`, keyboard: [...countriesData.map(c => [c]), [goBack]]});
    } catch (e) {
      console.log(e);
    }
  }, choosingTownValidator: async msg => {
    try {
      return msg.reply({text: `Введи свой город в формате сообщения`});
    } catch (e) {
      console.log(e);
    }
  }, unknownMessageHomepageValidator: async msg => {
    try {
      return msg.reply({text: `Не понял(`});
    } catch (e) {
      console.log(e);
    }
  }, unknownCommandValidator: async msg => {
    try {
      return msg.reply({text: `Неизвестная команда!`});
    } catch (e) {
      console.log(e);
    }
  }, wrongAgeFillingValidator: async msg => {
    try {
      return msg.reply({text: `Данные введены неправильно`});
    } catch (e) {
      console.log(e);
    }
  }, sequenceErrorValidator: async msg => {
    try {
      return msg.reply({text: `Неправильно введена последовательноть. Нужно от меньшего к большему`});
    } catch (e) {
      console.log(e);
    }
  }, wrongCountryFillingValidator: async msg => {
    try {
      return msg.reply({text: `Выберите одну из доступных стран`});
    } catch (e) {
      console.log(e);
    }
  }, backRequestValidator: async msg => {
    try {
      return msg.reply({text: `Напишите в формате сообщения!`});
    } catch (e) {
      console.log(e);
    }
  }, choosePossibleOptionValidator: async msg => {
    try {
      return msg.reply({text: `Выбери возможную опцию:`});
    } catch (e) {
      console.log(e);
    }
  }, availableForVipOnlyValidator: async msg => {
    try {
      return msg.reply({text: `Данная функция доступна только для VIP пользователей`, inline_keyboard: [[{text: `VIP доступы`, callback_data: "vip-access"}]]});
    } catch (e) {
      console.log(e);
    }
  }
}
