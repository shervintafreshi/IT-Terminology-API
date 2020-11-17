
// ################################################################################
// Data service operations setup

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Load the schemas...

// Data entities; the standard format is:
const termEnglishSchema = require ('./termEnglishSchema');
const termNonEnglishSchema = require ('./termNonEnglishSchema');
const definitionSchema = require ('./definitionSchema');

// ################################################################################
// Define the functions that can be called by server.js

module.exports = function () {

  return {

    // ############################################################
    // Connect to the database

    connect: function () {
      return new Promise(function (resolve, reject) {

        // Create connection to the database
        console.log('Attempting to connect to the database...');

        // The following works for localhost...
        // Replace the database name with your own value
        const uri = "";   // const uri = "private_cluster_uri";
        mongoose.connect(uri, {dbName: 'db-a2', connectTimeoutMS: 5000, useUnifiedTopology: true });
        
        // This one works for MongoDB Atlas...
        // (coming soon)

        // From https://mongoosejs.com/docs/connections.html
        // Mongoose creates a default connection when you call mongoose.connect(). 
        // You can access the default connection using mongoose.connection.
        var db = mongoose.connection;
        
        // Handle connection events...
        // https://mongoosejs.com/docs/connections.html#connection-events
        // The data type of a connection event is string
        // And more than one connection event may be emitted during execution

        // FYI the Node.js EventEmitter class docs is here...
        // https://nodejs.org/api/events.html#events_class_eventemitter

        // Handle the unable to connect scenario
        // "on" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
        db.on('error', (error) => {
          console.log('Connection error:', error.message);
          reject(error);
        });

        // Need to add two here with the correct names
        // Handle the open/connected event scenario
        // "once" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
        db.once('open', () => {
          console.log('Connection to the database was successful');
          termEnglish = db.model("TermsEnglish", termEnglishSchema, "TermsEnglish");
          termNonEnglish = db.model("TermsNonEnglish", termNonEnglishSchema, "TermsNonEnglish");
          definition = db.model("definition", definitionSchema, "definition");
          resolve();
        });
      });
    },
    
    // ########################################################### //
    // ************** English term requests METHODS ************** //

    termGetAllEng: function () {
      return new Promise(function (resolve, reject) {

        // Fetch all documents
        termEnglish.find()
          .sort({ wordEnglish: 'asc'})
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
             
            // Found, a collection will be returned
            return resolve(items);
          });
      })
    },

    termGetSomeByRegEx: function(pattern) {
     return new Promise(function (resolve, reject) { 
        // Fetch all documents
        termEnglish.find({wordEnglish: new RegExp('^' + pattern, 'i')})
          .sort({ wordEnglish: 'asc'})
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
             
            // Found, a collection will be returned
            return resolve(items);
          });
      })
    },


    termGetByIdEng: function (itemId) {
      return new Promise(function (resolve, reject) {

        // Find one specific document
        termEnglish.findById(itemId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }
        });
      })
    },
     
    termGetByWordEng: function (word) {
      return new Promise(function (resolve, reject) {

        // Find one specific document
        termEnglish.findOne({wordEnglish: word }, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }
        });
      })
    },
    
    
    termAddEng: function (newItem) {
      return new Promise(function (resolve, reject) {

        termEnglish.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      })
    },
    
    termEditAddDefEng: function (word, definition) {
      
      return new Promise(function (resolve, reject) {

        termEnglish.updateOne({wordEnglish: word}, {$push: {definitions: definition}}, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }

        });
      })
    },

    termEditIncreYesEng: function (Item) {
      return new Promise(function (resolve, reject) {

        termEnglish.findByIdAndUpdate(Item._id, {"helpYes": Item.helpYes + 1}, { new: true }, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }

        });
      })
    },

    termEditIncreNoEng: function (Item) {
      return new Promise(function (resolve, reject) {

        termEnglish.findByIdAndUpdate(Item._id, {"helpNo": Item.helpNo + 1}, { new: true }, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }

        });
      })
    },
    
    termEditIncreLikeEng: function (definitionId, Item) {
      return new Promise(function (resolve, reject) {

        termEnglish.findById(Item._id, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {

           for (i = 0; i < item.definitions.length; i++){
               
             if (item.definitions[i]._id == definitionId){
                item.definitions[i].likes += 1;
              }
           }            
             
           item.save((err) => {
             if(err) return reject("Error Saving");
             else return  resolve(item);
           });

          } else {
            return reject('Not found');
          }

        });
      })
    },
    
    // ########################################################### //
    // ************** Non-English term requests METHODS ********** //
  
    termGetAllNon: function () {
      return new Promise(function (resolve, reject) {

        // Fetch all documents
        termNonEnglish.find()
          .sort({ wordEnglish: 'asc'})
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
             
            // Found, a collection will be returned
            return resolve(items);
          });
      })
    },

    termGetByIdNon: function (itemId) {
      return new Promise(function (resolve, reject) {

        // Find one specific document
        termNonEnglish.findById(itemId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }
        });
      })
    },
    
    termGetByWordNon: function (word) {
      return new Promise(function (resolve, reject) {
         
        // Find one specific document
        termNonEnglish.findOne({wordNonEnglish: word}, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }
        });
      })
    },

   termAddNon: function (newItem) {
    return new Promise( function (resolve, reject) {

    termNonEnglish.create(newItem, (error, item) => {
      if (error) {
        // Cannot add item
        return reject(error.message);
      }
      //Added object will be returned
      return resolve(item);
    });
   });
  },
    
    termEditAddDefNon: function (word,definition) {
      return new Promise(function (resolve, reject) {

        termNonEnglish.updateOne({wordNonEnglish: word}, {$push: {definitions: definition}}, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }

        });
      })
    },

    termEditIncreYesNon: function (Item) {
      return new Promise(function (resolve, reject) {

        termNonEnglish.findByIdAndUpdate(Item._id, {"helpYes": Item.helpYes + 1}, { new: true }, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }

        });
      })
    },

    termEditIncreNoNon: function (Item) {
      return new Promise(function (resolve, reject) {

        termNonEnglish.findByIdAndUpdate(Item._id, {"helpNo": Item.helpNo + 1}, { new: true }, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }

        });
      })
    },
     

    termEditIncreLikeNon: function (definitionId, Item) {
      return new Promise(function (resolve, reject) {

        termNonEnglish.findById(Item._id, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            
            for (i = 0; i < item.definitions.length; i++){
               
              if (item.definitions[i]._id == definitionId){
                item.definitions[i].likes += 1;
              }
            }            

            item.save((err) => {
              if(err) return reject("Error Saving");
              else return  resolve(item);
            });

          } else {
            return reject('Not found');
          }

        });
      })
    },
     
  } // return statement that encloses all the function members

} // module.exports
