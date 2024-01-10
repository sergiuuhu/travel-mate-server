import { letsGo } from "../_extra.js"

export const config = {
    runtime: 'edge',
};

export default async function handler() {
    const flightsAdded = await letsGo();

    return new Response(
        JSON.stringify({
            message: `${flightsAdded} flights added.`
        }),
        {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        },
    );
}