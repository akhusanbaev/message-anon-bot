const DefaultSettings = require("./../models/DefaultSettings");
const Admins = require("./../models/Admins");
class Mailer {
  constructor(userIds, msg, mailMessage) {
    this.userIds = userIds;
    this.msg = msg;
    this.mailMessage = mailMessage;
    this.mail().then(res => res).catch(err => {console.log(err)});
  }
  mail = async () => {
    try {
      const settings = await DefaultSettings.findOne();
      settings.isMailing = true;
      await settings.save();
      for (let i = 0; i < this.userIds.length; i++) {
        await this.msg.reply({chat_id: this.userIds[i], params: this.mailMessage, telegramMessage: true});
      }
      settings.isMailing = false;
      await settings.save();
      const admins = await Admins.find();
      for (let i = 0; i < admins.length; i++) {
        if (admins[i].state.on === "home") {
          await this.msg.reply({chatId: admins[i].user.id, text: `Рассылка закончилась`});
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = Mailer;
