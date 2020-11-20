
// ################################################################################
// Web service setup

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());

// ################################################################################
// Data model and persistent store setup

const manager = require("./manager.js");
const m = manager();


// ################################################################################
// Deliver the app's home page to browser clients

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});


// ################################################################################
// Resources available in this web API

app.get("/api", (req, res) => {
  // Here are the resources that are available for users of this web API...
  const links = [];
  // This app's resources...
  links.push({ "rel": "collection", "href": "/api/terms", "methods": "GET,POST,PUT" });
  const linkObject = { 
    "apiName": "terms Web API",
    "apiDescription": "assignment 2 web-api",
    "apiVersion": "1.0", 
    "apiAuthor": "Shervin Tafreshipour",
    "links": links
  };
  res.json(linkObject);
});

// ################################################################################
// Request handlers for data entities (listeners)

// ************ ENGLISH TERMS ************** //

// Get all
app.get("/api/termsEng", (req, res) => {
  // Call the manager method
  m.termGetAllEng()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get Some

app.get("/api/termsEng/search/:pattern", (req, res) => {
  // Call the manager method
  m.termGetSomeByRegEx(req.params.pattern)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get By ID
app.get("/api/termsEng/:id", (req, res) => {
  // Call the manager method
  m.termGetByIdEng(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Get By Word
app.get("/api/termsEng/word/:word", (req, res) => {
  // Call the manager method
  m.termGetByWordEng(req.params.word)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Add new Word
app.post("/api/termsEng", (req, res) => {
  // Call the manager method
  m.termAddEng(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Add definition
app.put("/api/termsEng/def/:word", (req, res) => {
  // Call the manager method
  m.termEditAddDefEng(req.params.word, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Increment 'yes'
app.put("/api/termsEng/yes/", (req, res) => {
  // Call the manager method
  m.termEditIncreYesEng(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Increment 'no'
app.put("/api/termsEng/no/", (req, res) => {
  // Call the manager method
  m.termEditIncreNoEng(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Increment document 'like'
app.put("/api/termsEng/like/:id", (req, res) => {
  // Call the manager method
  m.termEditIncreLikeEng(req.params.id,req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// ************ NON-ENGLISH TERMS ************** //

// Get all
app.get("/api/termsNon", (req, res) => {
  // Call the manager method
  m.termGetAllNon()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get By ID
app.get("/api/termsNon/:id", (req, res) => {
  // Call the manager method
  m.termGetByIdNon(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Get By Word
app.get("/api/termsNon/word/:word", (req, res) => {
  // Call the manager method
  m.termGetByWordNon(req.params.word)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Add new
app.post("/api/termsNon/", (req, res) => {
  // Call the manager method
  m.termAddNon(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Add definition
app.put("/api/termsNon/def/:word", (req, res) => {
  // Call the manager method
  m.termEditAddDefNon(req.params.word, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Increment 'yes'
app.put("/api/termsNon/yes/", (req, res) => {
  // Call the manager method
  m.termEditIncreYesNon(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Increment 'no'
app.put("/api/termsNon/no/", (req, res) => {
  // Call the manager method
  m.termEditIncreNoNon(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Increment document 'like'
app.put("/api/termsNon/like/:id", (req, res) => {
  // Call the manager method
  m.termEditIncreLikeNon(req.params.id, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// ################################################################################
// Resource not found

app.use((req, res) => {
  res.status(404).send("Resource not found");
});

// ################################################################################
// Attempt to connect to the database, and
// tell the app to start listening for requests

m.connect().then(() => {
  app.listen(HTTP_PORT, () => { console.log("Ready to handle requests on port " + HTTP_PORT) });
})
  .catch((err) => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
  });
