const express = require("express");
const app = express();
app.use(express.json());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  console.log("req", req.params)
  const time = new Date();
  const weekday = time.toLocaleString('default', { weekday: 'short' });
  const month = time.toLocaleString('default', { month: 'short' });
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

