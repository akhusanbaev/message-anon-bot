const {Schema, model} = require("mongoose");
const moment = require("moment");
const BillSchema = new Schema({
  amount: {type: Number, required: true},
  createdDate: {type: Date, required: true, default: () => moment().toDate()},
  expirationDateTime: {type: Date, required: true, default: () => moment().add(15, "minutes").toDate()},
  account: {type: String, required: true},
  status: {type: String, required: true, default: "waiting"}, // paid | canceled
});
module.exports = model("bills", BillSchema);
