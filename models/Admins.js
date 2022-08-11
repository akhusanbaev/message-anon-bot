const {Schema, model} = require("mongoose");
const {User} = require("./telegram");
const {AdminState} = require("./adminStateTypes");
const AdminSchema = new Schema({
  user: {type: User, required: true},
  state: {type: AdminState, required: true, default: {on: "none"}},
  boss: {type: Boolean, required: true, default: false}
});
module.exports = model("admins", AdminSchema);
