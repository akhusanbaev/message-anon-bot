const {Schema} = require("mongoose");
module.exports = {
  WebAppInfo: new Schema({
    url: {type: String}
  })
}
