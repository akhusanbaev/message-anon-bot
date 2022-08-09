const {Schema} = require("mongoose");
module.exports = {
  Contact: new Schema({
    phone_number: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    user_id: {type: Number},
    vcard: {type: String}
  })
}
