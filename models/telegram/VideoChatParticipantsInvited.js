const {Schema} = require("mongoose");
const {User} = require("./User");
module.exports = {
  VideoChatParticipantsInvited: new Schema({
    users: {type: [User]}
  })
}
