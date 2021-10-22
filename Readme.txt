This app is connected to a mongo database which I imported and is full of student information. date, courseNumber, time, 
location. All of the student data is being pulled from 
studentJson.js. This app uses  PUT, POST, PATCH, GET, DELETE. 

============================================================
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const studentRouter = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
=============================================================

	=> Used the new ES6 feature const to set express, and express router to constant variables. 
    => I also used const to require mongoose, body parser, and fs setting them all to constant variables.

=============================================================
    let demoLogger = (req, res, next) => {
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let forwarded = req.headers["x-forwarded-for"];
  let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
  let log = `[${formatted_date}] ${method}:${url} ${ip}`;
  console.log(log);
  fs.writeFileSync(
    `./logs/reader${Math.random() * 100}.txt`,
    log + "\n",
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  next();
};

app.use(demoLogger);

========================================================

	=> Used new ES6 arrow function in my “demoLogger” function and in my fs.writeFileSync function when handling the errors.
	=> Used template literals in my “demoLogger” function 

========================================================

app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});

===========================================================

 => Used an ES6 Arrow Function to get the data and send the message "Welcome to my API" when you hit the "/" page.

===============================================================

API Design:
When you access the local host it will bring you to the “/” page which you will see “Welcome to my api.” The express router is assigned to a constant variable which is called “studentRouter.” When you type “/api” in the url you are connected to the express router. When you type in the url “api/students” it will bring you to the list of student information which is stored in my mongo database which is structured in the studentModel.js. 

Get: Gets the student data from my mongodb and responds a JSON file if there are no errors. If there are errors is will use res.send() for the responding text.

Post:  Posts that data to /students. It’s going to add all the student information within the database and make a new record in our database. The steps are to create a new student object, save the student with student.save() and set a response status of of 201.

Put: The put method contains the Id so it can identify which record to be updated with the new data in the request body. Assigned req to a constant variable of “student” and used “student” constant to get new data from the request and save it. This method returns a JSON file.

Patch: Added logic to update the info which is coming from the request’s body. I removed the Id from the request’s body since we don’t want it to update the Id and I did a console.log(“ID was not inserted”). I saved the updated student info at the end of the patch parameter function with req.student.save(). Furthermore, I checked for errors and if there are none then return the student.  

Delete: The delete method removes one record from the database using the Id. I used req.student.remove() in the delete method and gave the remove method a parameter function. 



