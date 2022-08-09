const {Schema} = require("mongoose");
const {Location} = require("./Location");
module.exports = {
  ChatLocation: new Schema({
    location: {type: Location},
    address: {type: String}
  })
}
