require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const { errorHandler, formatter } = require("./middleware");

const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(morgan(formatter));

app.get("/", (req, res) => {
  res.send("<h1>Here we are!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
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
    .catch((error) => {
      console.log("AAAA");
      console.log(error.name);
      return next(error);
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: "Name is missing" }); //.end();
  }
  if (!body.number) {
    return res.status(400).json({ error: "Number is missing" }).end();
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    console.log(
      `added ${savedPerson.name} number ${savedPerson.number} to phonebook`
    );
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  const time = new Date();
  const weekday = time.toLocaleString("default", { weekday: "short" });
  const month = time.toLocaleString("default", { month: "short" });

  Person.find({}).then((persons) => {
    console.log(persons.length);
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

app.use(errorHandler);

const PORT = process.env.PORT; // || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
