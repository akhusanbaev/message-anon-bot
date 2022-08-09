const {Schema} = require("mongoose");
module.exports = {
  UserState: new Schema({
    on: {type: String},
    plan: {type: String},
    billId: {type: String},
    gender: {type: String},
    age: {type: [Number]},
    country: {type: String},
    town: {type: String},
    user: {type: String},
    partner: {type: String}
  }),
  UserStateCheckout: new Schema({
    on: {type: String}, // checkout
    plan: {type: String},
    billId: {type: String}
  }),
  UserStateSearch: new Schema({
    on: {type: String}, // search-filter-partner
    gender: {type: String},
    age: {type: [Number]}, //
    country: {type: String},
    town: {type: String}
  }),
  UserStateBackRequest: new Schema({
    on: {type: String}, // back-request-waiting
    user: {type: String}, // Users._id
  })
}
