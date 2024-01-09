import { airports } from "./airports.js"
import { letsGo } from "./extra.js"

export const config = {
    runtime: 'edge',
};

let airportIndex = 0;

export default async function handler() {
    const airportCode = airports[airportIndex]['code'];

    const flightsAdded = await letsGo(airportCode);

    airportIndex = airports[airportIndex + 1] ? airportIndex + 1 : 0;

    return new Response(
        JSON.stringify({
            message: `${flightsAdded} flights added from ${airportCode}.`
        }),
        {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        },
    );
}