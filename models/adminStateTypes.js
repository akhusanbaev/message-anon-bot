const {Schema} = require("mongoose");
module.exports = {
  AdminState: new Schema({
    on: {type: String},
    filterGender: {type: String},
    filterAge: {type: [Number]},
    filterCountry: {type: String},
    filterTown: {type: String}
  })
}
