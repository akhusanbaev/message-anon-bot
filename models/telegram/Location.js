const {Schema} = require("mongoose");
module.exports = {
  Location: new Schema({
    longitude: {type: Number},
    latitude: {type: Number},
    horizontal_accuracy: {type: Number},
    live_period: {type: Number},
    heading: {type: Number},
    proximity_alert_radius: {type: Number}
  })
}
