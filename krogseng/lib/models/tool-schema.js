const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toolSchema = new Schema({
name: {
    type: String, 
    required: true
},
type: {
    type: String,
    required: true
}
});
module.exports = mongoose.model('Tool', toolSchema);