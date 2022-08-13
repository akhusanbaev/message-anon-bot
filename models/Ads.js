const {Schema, model} = require("mongoose");
const {MailingMessage} = require("./adminStateTypes");
const AdSchema = new Schema({
  name: {type: String, required: true, unique: true},
  mailMessage: {type: MailingMessage},
  filter: {type: Object, required: true, default: {left: false}},
  seen: {type: [String], required: true, default: []},
  visible: {type: Boolean, required: true, default: true}
});
module.exports = model("ads", AdSchema);
