const {Schema} = require("mongoose");
module.exports = {
  EncryptedCredentials: new Schema({
    data: {type: String},
    hash: {type: String},
    secret: {type: String}
  })
}
