const {Schema} = require("mongoose");
const {User} = require("./User");
module.exports = {
  ProximityAlertTriggered: new Schema({
    traveler: {type: User},
    watcher: {type: User},
    distance: {type: Number}
  })
}
