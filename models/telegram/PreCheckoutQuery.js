const {Schema} = require("mongoose");
const {User} = require("./User");
const {OrderInfo} = require("./OrderInfo");
module.exports = {
  PreCheckoutQuery: new Schema({
    id: {type: String},
    from: {type: User},
    currency: {type: String},
    total_amount: {type: Number},
    invoice_payload: {type: String},
    shipping_option_id: {type: String},
    order_info: {type: OrderInfo}
  })
}
