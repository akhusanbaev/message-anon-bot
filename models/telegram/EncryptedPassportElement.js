const {Schema} = require("mongoose");
const {PassportFile} = require("./PassportFile");
module.exports = {
  EncryptedPassportElement: new Schema({
    type: {type: String},
    data: {type: String},
    phone_number: {type: String},
    email: {type: String},
    files: {type: [PassportFile]},
    front_side: {type: PassportFile},
    reverse_side: {type: PassportFile},
    selfie: {type: PassportFile},
    translation: {type: [PassportFile]},
    hash: {type: String}
  })
}
