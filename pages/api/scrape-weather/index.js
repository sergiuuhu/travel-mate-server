import moment from 'moment';
import cheerio from 'cheerio';

import { getSupabase } from "../_extra";

const supabase = getSupabase();

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const urlParams = new URL(request.url).searchParams;
        const query = Object.fromEntries(urlParams);

        // Fetch HTML content from the web page using fetch
        const response = await fetch(query.url);
        const html = await response.text();

        // Extract data using cheerio
        const $ = cheerio.load(html);

        const location = $('.header-loc').text().trim().split(',')[0];
        const month = $('.map-dropdown:nth-of-type(1) h2').text().trim();
        const year = $('.map-dropdown:nth-of-type(2) h2').text().trim();

        const dayPanelObjects = [];

        $('.monthly-daypanel').each((index, dayPanel) => {
            const day = parseInt($(dayPanel).find('.date').text().trim());
            const high = parseInt($(dayPanel).find('.high').text().trim());
            const low = parseInt($(dayPanel).find('.low').text().trim());
            const svg = $(dayPanel).find('svg');
            const description = svg ? svg.attr('alt') : '';
            const icon = svg && svg.attr('data-src') ? svg.attr('data-src').replace('/images', '') : '';

            if (index < 10 && day > 20) {
                return;
            }

            if (index > 20 && day < 10) {
                return;
            }

            const panelObject = {
                city_name: location,
                date: moment(`${day}/${month}/${year}`, "D/MMMM/YYYY").format("YYYY-MM-DD"),
                high,
                low,
                description,
                icon,
            };

            dayPanelObjects.push(panelObject);
        });

        const data = {};

        dayPanelObjects.forEach((item) => {
            const { date, ...rest } = item;
            data[date] = rest;
        });

        const dates = Object.keys(data);

        await supabase
            .from("weather")
            .delete()
            .eq("city_name", location)
            .in("date", dates)

        await supabase
            .from("weather")
            .insert(dayPanelObjects)

        return new Response(
            JSON.stringify({
                location,
                month,
                year,
                data
            }),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            },
        );
    } catch (error) {
        console.error('Error:', error.message);

        return new Response(
            "Something went wrong.",
            {
                status: 500,
                headers: {
                    'content-type': 'application/json',
                },
            },
        );
    }
}
