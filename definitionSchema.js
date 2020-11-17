
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var definitionSchema = new Schema({

    authorName: String,
    dateCreated: Date,
    definition: String,
    quality: Number,
    likes: Number,
    termId: {
        type: Schema.Types.ObjectId, ref: 'termsEnglish'
    }
},
{
    versionKey: false // remove __v property added by mongoose
});

module.exports = definitionSchema;