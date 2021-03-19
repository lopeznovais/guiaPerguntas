const express = require("express");
const app = express();
const connection = require("./database/database");
const Question = require("./models/Question");
const Answer = require("./models/Answer");

connection
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  Question.findAll({ raw: true, order: [["id", "DESC"]] }).then((questions) => {
    res.render("index", { questions: questions });
  });
});

app.get("/question", (req, res) => {
  res.render("ask");
});

app.post("/savequestion", (req, res) => {
  var title = req.body.title;
  var description = req.body.description;
  Question.create({
    title: title,
    description: description,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/question/:id", (req, res) => {
  var id = req.params.id;
  Question.findOne({
    where: { id: id },
  }).then((question) => {
    if (question != undefined) {
      Answer.findAll({
        where: { questionId: id },
        order: [["id", "DESC"]],
      }).then((answers) => {
        res.render("question", {
          question: question,
          answers: answers,
        });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/answer", (req, res) => {
  var body = req.body.body;
  var questionId = req.body.question;
  Answer.create({
    body: body,
    questionId: questionId,
  }).then(() => {
    res.redirect("/question/" + questionId);
  });
});

app.listen(8080, () => {
  console.log("Servidor rodando");
});
