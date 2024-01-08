import express from "express";
import bodyParser from "body-parser";

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

app.post("/fetch/:airportCode", async (req, res) => {
  const { airportCode } = req.params;

  res.send(airportCode);
});

app.listen(app.get("port"), function () {
  console.log(
    "Express app travel-mate-server is running on port",
    app.get("port")
  );
});