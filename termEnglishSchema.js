 
var mongoose = require('mongoose');
var Definition = require('./definitionSchema');
var Schema = mongoose.Schema;

var termEnglishSchema = new Schema({

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
    definitions: [Definition]
},
{
    versionKey: false // remove __v property added by mongoose
});

module.exports = termEnglishSchema;