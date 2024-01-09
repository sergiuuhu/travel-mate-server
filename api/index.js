import express from "express";
import bodyParser from "body-parser";

import { airports } from "./airports.js"
import { searchFlights, letsGo } from "./extra.js"

const app = express();

let airportIndex = 0;

app.use(express.static('public'))

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

app.get("/fetch", async (req, res) => {
    const airportCode = airports[airportIndex]['code'];

    const flightsAdded = await letsGo(airportCode);

    airportIndex = airports[airportIndex + 1] ? airportIndex + 1 : 0;

    res.send(`${flightsAdded} flights added from ${airportCode}.`);
});

app.get("/flights/:country", async (req, res) => {
    const airportCodes = airports.filter(o => o.country === req.params.country).map(o => o.code)

    const flights = await searchFlights(airportCodes);

    res.json(flights);
});

export default app;