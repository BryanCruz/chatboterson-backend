"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { fallback, gameLoop, reset, finish } = require("./service");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/", (request, response) => {
  const intentName = request.body.queryResult.intent.displayName;
  const { parameters } = request.body.queryResult;
  
  const intentFns = {
    "inicio - yes": reset,
    "inicio - yes - jogo": gameLoop,
    "inicio - yes - jogo - repeat": reset,
    "inicio - yes - jogo - cancel": finish
  };

  const intentFn = intentFns[intentName] || fallback;

  response.json(intentFn(parameters));
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
