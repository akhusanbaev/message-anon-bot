const {Schema} = require("mongoose");
const {User} = require("./User");
const {Location} = require("./Location");
module.exports = {
  InlineQuery: new Schema({
    id: {type: String},
    from: {type: User},
    query: {type: String},
    offset: {type: String},
    chat_type: {type: String},
    location: {type: Location}
  })
}
