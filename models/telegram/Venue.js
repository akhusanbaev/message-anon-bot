const {Schema} = require("mongoose");
const {Location} = require("./Location");
module.exports = {
  Venue: new Schema({
    location: {type: Location},
    title: {type: String},
    address: {type: String},
    foursquare_id: {type: String},
    foursquare_type: {type: String},
    google_place_id: {type: String},
    google_place_type: {type: String}
  })
}
