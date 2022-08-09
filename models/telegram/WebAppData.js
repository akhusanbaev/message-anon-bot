const {Schema} = require("mongoose");
module.exports = {
  WebAppData: new Schema({
    data: {type: String},
    button_text: {type: String}
  })
}
