const {Schema} = require("mongoose");
const {User} = require("./User");
module.exports = {
  PollAnswer: new Schema({
    poll_id: {type: String},
    user: {type: User},
    option_ids: {type: [Number]}
  })
}
