const {Schema} = require("mongoose");
module.exports = {
  UserBackRequest: new Schema({
    date: {type: Date},
    deliveredDate: {type: Date},
    from: {type: String}, // Users._id
    content: {type: String},
  })
}
