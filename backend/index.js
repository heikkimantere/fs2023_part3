require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const { errorHandler, formatter, unknownEndpoint } = require("./middleware");

const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(morgan(formatter));

app.get("/", (req, res) => {
  res.send("<h1>Here we are!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      console.log(
        `added ${savedPerson.name} number ${savedPerson.number} to phonebook`
      );
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  const time = new Date();
  const weekday = time.toLocaleString("default", { weekday: "short" });
  const month = time.toLocaleString("default", { month: "short" });

  Person.find({}).then((persons) => {
    res.send(`<div>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>
  ${weekday} 
  ${month} 
  ${time.getDate()} 
  ${time.getFullYear()} 
  ${time.toTimeString()}</p>
  </div>`);
  });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT; // || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
