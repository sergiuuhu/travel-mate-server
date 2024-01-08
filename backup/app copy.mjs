import express from "express";
import bodyParser from "body-parser";
import {
  fetchStory,
  translate,
  getAudio,
  createStory,
  cronMinute,
  generateAudio,
  signIn,
  userData,
} from "./extra.mjs";

const app = express();

app.use(
  bodyParser.urlencoded({ extended: true, limit: "1mb", parameterLimit: 50000 })
);

if (process.env.NODE_ENV === "production") {
  app.use(bodyParser.json({ limit: "1mb" }));
}

app.set("port", process.env.PORT || 8081);

app.get("/hello", (req, res) => {
  res.send("World");
});

app.get("/categories", async (req, res) => {
  res.send({
    categories
  });
});

app.post("/create", async (req, res) => {
  const story = await createStory(req.body);

  res.send(story);
});

app.get("/story/:slug", async (req, res) => {
  const story = await fetchStory(req.params.slug);

  res.send(story);
});

app.get("/cron/minute", async (req, res) => {
  const status = await cronMinute();

  res.send(status);
});

app.get("/audio/generate/:story/:card/:text", async (req, res) => {
  const response = await generateAudio(
    req.params.story,
    req.params.card,
    decodeURIComponent(req.params.text)
  );

  res.send(response);
});

app.post("/audio", async (req, res) => {
  const { storySlug, cardNumbers, narratorIsMale, listenerIsMale } = req.body;

  const audioObject = await getAudio(
    storySlug,
    cardNumbers,
    narratorIsMale,
    listenerIsMale
  );

  res.send({ audio: audioObject });
});

app.post("/translate", async (req, res) => {
  const translations = await translate(req.body.text, req.body.target_lang);

  res.send({ translations });
});

app.listen(app.get("port"), function () {
  console.log(
    "Express app travel-mate-server is running on port",
    app.get("port")
  );
});