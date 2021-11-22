var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ComplaintSchema = new Schema({
    query: {type: String, required: true, maxlength: 200},
    student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
    status: {type: String, required: true, enum: ['Posted', 'Pending', 'Done'], default: 'Done'},
    date: {type: Date}
});

ComplaintSchema.virtual('url').get(function() {
    return '/student/complaint/' + this._id;
});

module.exports = mongoose.model('Complaint', ComplaintSchema);