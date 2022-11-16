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

const cors = require('cors');
app.use(cors({
    origin: "https://localhost:3000"
}));


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

  console.log("Listening on web server or localhost:3000");
});





app.get("/", function(req, res){

  res.sendFile(path.join(__dirname, "views/index.html"));
});



/*
 * REST routes for all questions
 *
 */
app.route("/questions")
.get(function(req, res){

  //Find all posts in database and pass to view to display
  Question.find({}, function(err, foundQuestions){

    if( err )
      res.send(err);
    else
      res.send(foundQuestions);
  });
})
.post(function(req, res){

  //Create question document to save to database
  let questionToAdd = new Question({

    level: req.body.level,
    category: req.body.category,
    question: req.body.question,
    choices: req.body.choices,
    answer: req.body.answer
  });

  //saves questionToAdd into Questions collection in db
  questionToAdd.save( function(err){

    if( err )
      res.send(err);
    else
      res.send("Added new question.");
  });
})
.delete(function(req, res){

  Question.deleteMany(function(err){

    if( err )
      res.send(err);
    else
      res.send("Deleted all questions.");
  })
});



/*
 * REST routes for individual questions
 *
 */
 app.route("/questions/:questionId")
 .get(function(req, res){

   //Find post in database and pass to view to display
   Question.findOne({_id:req.params.questionId}, function(err, foundQuestion){

     if( err || foundQuestion == null )
       res.send("Question not found.");
     else
       res.send(foundQuestion);
   });
 })
 .patch(function(req, res){

   Question.update(

     {_id:req.params.questionId},
     { $set : req.body },
     function(err){

      if( err )
        res.send(err);
      else
        res.send("Updated.");

     });
 })
 .delete(function(req, res){

   Question.deleteOne(

    {_id:req.params.questionId},
    function(err){

       if( err )
         res.send(err);
       else
         res.send("Deleted question.");
    });
 });




 //Get random question of a specified level
 app.get("/randomQuestion/:questionLevel", function(req, res){

   let level = req.params.questionLevel; //Blue, Green, Yellow, Red, Purple

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
