const {Schema, model} = require("mongoose");
const DefaultSettingsSchema = new Schema({
  freeTrialSearches: {type: Number},
  vipDailyPrice: {type: Number},
  vipWeeklyPrice: {type: Number},
  vipMonthlyPrice: {type: Number},
  vipForeverPrice: {type: Number},
  isMailing: {type: Boolean},
  rulesText: {type: String},
  links: {type: [String]}
});
module.exports = model("default-settings", DefaultSettingsSchema);
