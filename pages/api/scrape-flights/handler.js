import { airports } from "../_airports.js"
import { letsGo } from "../_extra.js"

export const config = {
    runtime: 'edge',
};


export default async function handler() {
    const airportIndex = Math.floor(Math.random() * airports.length);

    const airportCode = airports[airportIndex]['code'];

    const flightsAdded = await letsGo(airportCode);

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