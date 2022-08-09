const {Schema} = require("mongoose");
const {EncryptedPassportElement} = require("./EncryptedPassportElement");
const {EncryptedCredentials} = require("./EncryptedCredentials");
module.exports = {
  PassportData: new Schema({
    data: {type: [EncryptedPassportElement]},
    credentials: {type: [EncryptedCredentials]}
  })
}
