const {Schema} = require("mongoose");
const {User} = require("./User");
module.exports = {
  GameHighScore: new Schema({
    position: {type: Number},
    user: {type: User},
    score: {type: Number}
  })
}
