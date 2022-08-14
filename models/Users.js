const {Schema, model} = require("mongoose");
const moment = require("moment");
const {User} = require("./telegram");
const {UserState} = require("./userStateTypes");
const {UserBackRequest} = require("./userBackRequestTypes");
const {UserWatchlist} = require("./userWatchlistTypes");
const UserSchema = new Schema({
  user: {type: User, required: true},
  joinDate: {type: Date, required: true, default: () => moment().toDate()},
  lastAction: {type: Date, required: true, default: () => moment().toDate()},
  lastChat: {type: Date},
  startQuery: {type: String, required: true, default: "empty"},
  gender: {type: String},
  age: {type: Number},
  country: {type: [String]},
  town: {type: String},
  completedRegistration: {type: Date},
  editedProfile: {type: Date},
  vip: {type: Boolean, required: true, default: false},
  lastVipAccess: {type: Boolean, required: true, default: false},
  vipUnlimited: {type: Boolean, required: true, default: false},
  vipUntilDate: {type: Date},
  connectedVip: {type: Date},
  vipExpired: {type: Date},
  hasFreeTrial: {type: Boolean, required: true, default: true},
  trialSearches: {type: Number, required: true, default: 0},
  totalDialogs: {type: Number, required: true, default: 0},
  totalMessages: {type: Number, required: true, default: 0},
  left: {type: Boolean, required: true, default: false},
  leftDate: {type: Date},
  backDate: {type: Date}, // If left users comes back
  partner: {type: String}, // Users._id
  reportsCount: {type: Number, required: true, default: 0},
  backRequests: {type: [UserBackRequest], required: true, default: []},
  watchlist: {type: [UserWatchlist], required: true, default: []},
  subscribed: {type: Boolean, required: true, default: false},
  state: {type: UserState, required: true, default: {on: "gender"}}
});
module.exports = model("users", UserSchema);
