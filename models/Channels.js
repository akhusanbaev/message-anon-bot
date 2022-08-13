const {Schema, model} = require("mongoose");
const {Chat} = require("./telegram");
const ChannelSchema = new Schema({
  name: {type: String, required: true, unique: true},
  link: {type: String},
  chat: {type: Chat},
  subscription: {type: Boolean, required: true, default: true}
});
module.exports = model("channels", ChannelSchema);
