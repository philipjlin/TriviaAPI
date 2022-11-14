/*
 * TriviaAPI - Main server
 */
//Env variables
require('dotenv').config();

//Required packages
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//App uses ejs to render views in views folder
//app.set("view engine", "ejs");

//Body parser for requests
app.use(bodyParser.urlencoded({extended: true}));

//Allows use of static files in public directory (css, images)
app.use(express.static(path.join(__dirname, "public")));

//Mongoose
//mongoose.connect("mongodb://localhost:27017/trivia");
mongoose.connect(process.env.MONGODB_ROOT + "trivia");





/******************** DATABASE CODE ********************/
/*
 * Task DOCUMENTS are stored in tasks COLLECTION in tasklist DB
 * Each task has day of the week and task name
 *
 */
//Schema for mongodb database
const questionSchema = new mongoose.Schema({

  level: String,
  category: String,
  question: String,
  choices: [String],
  answer: String
});

//Model for mongodb database
const Question = mongoose.model("Question", questionSchema);  //Create "questions" collection in db

//(Sample) document to add to database
let sampleQuestion = new Question({

  level: "Blue",
  category: "Science",
  question: "What are trees?",
  choices: ["Animals", "Plants", "Bacteria", "Fungi"],
  answer: "Plants"
});





/******************** SERVER ROUTES ********************/
/*
 * LISTEN route
 * process.env.port listens for live server
 * local port 3000 for testing
 *
 */
app.listen(process.env.PORT || "3000", function(req, res){

  console.log("Listening on web server or localhost:3000)");
});





app.route("/questions")
.get(function(req, res){

  //Find all posts in database and pass to view to display
  Question.find({}, function(err, foundQuestions){

    if( err ){

      console.log(err);
      res.send(err);
    }
    else{

      res.send(foundQuestions);
    }
  });
})
.post(function(req, res){

  //Find all posts in database and pass to view to display
  Question.find({}, function(err, foundQuestions){

    if( err ){

      console.log(err);
      res.send(err);
    }
    else{

      res.send(foundQuestions);
    }
  });
})
.delete(function(req, res){

  Question.deleteMany(function(err){

    if( err ){

      res.send(err);
    }
    else{

      res.send("Deleted.");
    }
  })
});

/*
 * GET routes
 *
 */
 //Get random question
 app.get("/question", function(req, res){

   let level = "Blue";

   //Gets random question of selected level
   Question.aggregate([{ $match:{ level: level } }, { $sample:{ size: 1 } }], function(err, foundQuestion){

     if( err ){

       console.log(err);
       res.send(err);
     }
     else{

       res.send(foundQuestion);
     }
   });

 });













/*
 * POST routes
 *
 */
