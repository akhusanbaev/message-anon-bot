const {Schema} = require("mongoose");
const {PollOption} = require("./PollOption");
const {MessageEntity} = require("./MessageEntity");
module.exports = {
  Poll: new Schema({
    id: {type: String},
    question: {type: String},
    options: {type: [PollOption]},
    total_voter_count: {type: Number},
    is_closed: {type: Boolean},
    is_anonymous: {type: Boolean},
    type: {type: String},
    allows_multiple_answers: {type: Boolean},
    correct_option_id: {type: Number},
    explanation: {type: String},
    explanation_entities: {type: [MessageEntity]},
    open_period: {type: Number},
    close_date: {type: Number}
  })
}
