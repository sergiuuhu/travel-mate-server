import { airports } from "../_airports.js"
import { searchFlights } from "../_extra.js"

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const urlParams = new URL(request.url).searchParams;
    const query = Object.fromEntries(urlParams);

    const airportCodes = airports.filter(o => o.country === query.country).map(o => o.code)

    const flights = await searchFlights(airportCodes);

    return new Response(
        JSON.stringify(flights),
        {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        },
    );
}