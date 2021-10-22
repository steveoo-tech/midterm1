const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const studentRouter = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");

// didn't know if you wanted the logs in one file or seperate so here is the code for doing it in one file.

// // create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
//   flags: "a",
// });

// // setup the logger
// app.use(morgan("combined", { stream: accessLogStream }));

//code for having the logs in seperate files.
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

const Student = require("./models/studentModel");

const db = mongoose.connect("mongodb://localhost/studentAPI");

app.use("/api", studentRouter);

studentRouter.use(bodyParser.json());
studentRouter.use(bodyParser.urlencoded({ extended: true }));

studentRouter.use("/students/:studentId", (req, res, next) => {
  Student.findById(req.params.studentId, (err, student) => {
    if (err) {
      return res.send(err);
    }
    if (student) {
      req.book = book;
      return next();
    }
    return res.sendStatus(404);
  });
});

studentRouter
  .route("/students")
  .post((req, res) => {
    const student = new Student(req.body);
    student.save();
    return res.status(201).json(student);
  })
  .get((req, res) => {
    const query = {};

    Student.find(query, (err, students) => {
      if (err) {
        return res.send(err);
      }
      return res.json(students);
    });
  });

studentRouter
  .route("/students/:studentId")

  .delete((req, res) => {
    const { student } = req;
    req.student.remove((err) => {
      if (err) {
        return res.send(student);
      }
      return res.json(student);
    });
  })

  .patch((req, res) => {
    const { student } = req;

    if (req.body._id) {
      delete req.body._id;
    } else {
      console.log("ID was not inserted");
    }
    //console.log(req.student);
    Object.entries(req.body).forEach((item) => {
      console.log(item);
      const key = item[0];
      const value = item[1];
      student[key] = value;
    });
    req.student.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(student);
    });
  })

  .put((req, res) => {
    const { student } = req;
    student.date = req.body.date;
    student.courseNumber = req.body.courseNumber;
    student.time = req.body.time;
    student.location = req.body.location;
    student.save();
    return res.json(student);
  })
  .get((req, res) => res.json(student));

app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
