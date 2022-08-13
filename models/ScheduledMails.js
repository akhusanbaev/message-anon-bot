const {Schema, model} = require("mongoose");
const {MailingMessage} = require("./adminStateTypes");
const ScheduledMailSchema = new Schema({
  mailMessage: {type: MailingMessage},
  msg: {Object},
  startDate: {type: Date},
  userIds: {type: [Number]},
  modified: {type: Boolean, required: true, default: false}
});
module.exports = model("scheduled-mails", ScheduledMailSchema);
