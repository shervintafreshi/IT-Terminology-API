
var mongoose = require('mongoose');
var Definition = require('./definitionSchema');
var Schema = mongoose.Schema;

var termNonEnglishSchema = new Schema({

    wordEnglish: String,
    wordNonEnglish: String,
    wordExpanded: String,
    languageCode: String,
    image: String,
    ImageType: String,
    audio: String,
    audioType: String,
    linkAuthoritative: String,
    linkWikipedia: String,
    linkYoutube: String,
    authorName: String,
    dateCreated: Date,
    dateRevised: Date,
    fieldOfStudy: String,
    helpYes: Number,
    helpNo: Number,
    definitions: [Definition],
    termEnglishId: {type: Schema.Types.ObjectId, ref: 'termEnglish'} // this might need to be modified
},
{
    versionKey: false // remove __v property added by mongoose
});

module.exports = termNonEnglishSchema;