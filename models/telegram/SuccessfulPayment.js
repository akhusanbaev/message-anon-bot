const {Schema} = require("mongoose");
const {OrderInfo} = require("./OrderInfo");
module.exports = {
  SuccessfulPayment: new Schema({
    currency: {type: String},
    total_amount: {type: Number},
    invoice_payload: {type: String},
    shipping_option_id: {type: String},
    order_info: {type: OrderInfo},
    telegram_payment_charge_id: {type: String},
    provider_payment_charge_id: {type: String}
  })
}
