const {Schema} = require("mongoose");
const {User} = require("./User");
const {Location} = require("./Location");
module.exports = {
  ChosenInlineResult: new Schema({
    result_id: {type: String},
    from: {type: User},
    location: {type: Location},
    inline_message_id: {type: String},
    query: {type: String}
  })
}
