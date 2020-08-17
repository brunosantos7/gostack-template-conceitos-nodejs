const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();

  const newRepository = {
    id, title, url, techs, likes: 0
  }

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  delete request.body.likes;

  let elementIndex = repositories.findIndex(repository => repository.id == id);

  if (elementIndex < 0) {
    return response.status(400).json({ erro: "Id does not exist." });
  }

  let repositoryToUpdate = repositories[elementIndex];

  const newRepositoryData = {
    ...repositoryToUpdate, ...request.body
  }

  repositories[elementIndex] = newRepositoryData;

  return response.json(newRepositoryData);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  let elementIndex = repositories.findIndex(repository => repository.id == id);

  if (elementIndex < 0) {
    return response.status(400).json({ erro: "Id does not exist." });
  }

  repositories.splice(elementIndex, 1);

  return response.status(204).json({});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  let elementIndex = repositories.findIndex(repository => repository.id == id);

  if (elementIndex < 0) {
    return response.status(400).json({ erro: "Id does not exist." });
  }

  let repositoryToUpdate = repositories[elementIndex];
  repositoryToUpdate.likes++;

  repositories[elementIndex] = repositoryToUpdate;

  return response.json(repositoryToUpdate);
});

module.exports = app;
