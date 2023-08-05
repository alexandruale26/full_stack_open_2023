require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/contacts");

morgan.token("body", (req, res) => {
  if (req.method === "POST") return JSON.stringify(req.body);
});

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get("/info", (_, response) => {
  Person.find({}).then((persons) => {
    const respHtml = `
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>
  `;

    response.send(respHtml);
  });
});

app.get("/api/persons", (_, response) => {
  Person.find({}).then((persons) => {
    console.log(persons);
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (body.name.length === 0 || body.number.length === 0) {
    return response.status(400).json({ error: "missing content" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((newPerson) => response.json(newPerson));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(400).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") return response.status(400).send({ error: "malformatted id" });

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});