// import 'dotenv/config'
// import axios from 'axios';
import moment from 'moment';
import { createClient } from "@supabase/supabase-js";
import { airports } from "./_airports.js"

const supabaseUrl = `https://${process.env.SUPA_ID}.supabase.co`;
const supabaseKey = process.env.SUPA_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getFlights = async (params) => {
    const url = 'https://api.tequila.kiwi.com/v2/search';
    const headers = {
        'accept': 'application/json',
        'apikey': process.env.KIWI_API_KEY // Assuming you use an environment variable for the API key
    };

    const queryParams = new URLSearchParams(params);
    const fullUrl = `${url}?${queryParams.toString()}`;

    try {
        const response = await fetch(fullUrl, { headers });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error:', error.message);

        throw error;
    }
};

export const generateDates = (weeks = 1) => {
    const dates = [];

    const today = new Date();
    let current_date = new Date(today);
    const end_date = new Date(today);
    end_date.setDate(today.getDate() + weeks * 7); // Adding 6 weeks

    while (current_date < end_date) {
        if (current_date.getDay() === 6) {  // Friday
            const saturday = formatDate(current_date);
            const sunday = formatDate(new Date(current_date.getTime() + 1 * 24 * 60 * 60 * 1000));  // Adding 1 day
            const dateRange = { 'date_from': saturday, 'date_to': sunday };
            dates.push(dateRange);
        }

        if (current_date.getDay() === 5) {  // Friday
            const friday = formatDate(current_date);
            const sunday = formatDate(new Date(current_date.getTime() + 2 * 24 * 60 * 60 * 1000));  // Adding 2 days
            const dateRange = { 'date_from': friday, 'date_to': sunday };
            dates.push(dateRange);
        }

        if (current_date.getDay() === 4) {  // Thursday
            const thursday = formatDate(current_date);
            const sunday = formatDate(new Date(current_date.getTime() + 3 * 24 * 60 * 60 * 1000));  // Adding 3 days
            const dateRange = { 'date_from': thursday, 'date_to': sunday };
            dates.push(dateRange);
        }

        current_date.setDate(current_date.getDate() + 1);
    }

    return dates;
}

export const generateFlightOptions = (flyFrom, weeks = 1, options = {
    'max_stopovers': 0,
    'sort': 'price',
    'limit': 10, // Max is 1000
    'adults': 1,
    'max_fly_duration': 3,
    'price_from': 0,
    'price_to': 100,
    'max_stopovers': 0,
    // 'max_sector_stopovers': 0,
    'curr': 'EUR',
    'locale': 'en',
    'ret_from_diff_city': false,
    'ret_to_diff_city': false

}) => {
    // curr: AED, AFN, ALL, AMD, ANG, AOA, ARS, AUD, AWG, AZN, BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND, BOB, BRL, BSD, BTC, BTN, BWP, BYN, BZD, CAD, CDF, CHF, CLF, CLP, CNY, COP, CRC, CUC, CUP, CVE, CZK, DJF, DKK, DOP, DZD, EEK, EGP, ERN, ETB, EUR, FJD, FKP, GBP, GEL, GGP, GHS, GIP, GMD, GNF, GTQ, GYD, HKD, HNL, HRK, HTG, HUF, IDR, ILS, IMP, INR, IQD, IRR, ISK, JEP, JMD, JOD, JPY, KES, KGS, KHR, KMF, KPW, KRW, KWD, KYD, KZT, LAK, LBP, LKR, LRD, LSL, LTL, LVL, LYD, MAD, MDL, MGA, MKD, MMK, MNT, MOP, MRO, MTL, MUR, MVR, MWK, MXN, MYR, MZN, NAD, NGN, NIO, NOK, NPR, NZD, OMR, PAB, PEN, PGK, PHP, PKR, PLN, PYG, QAR, QUN, RON, RSD, RUB, RWF, SAR, SBD, SCR, SDG, SEK, SGD, SHP, SLL, SOS, SRD, STD, SVC, SYP, SZL, THB, TJS, TMT, TND, TOP, TRY, TTD, TWD, TZS, UAH, UGX, USD, UYU, UZS, VEF, VND, VUV, WST, XAF, XCD, XOF, XPF, YER, ZAR, ZMK, ZMW, ZWL
    // locale: ae, ag, ar, at, au, be, bg, bh, br, by, ca, ca-fr, ch, cl, cn, co, ct, cz, da, de, dk, ec, ee, el, en, es, fi, fr, gb, gr, hk, hr, hu, id, ie, il, in, is, it, ja, jo, jp, ko, kr, kw, kz, lt, mx, my, nl, no, nz, om, pe, ph, pl, pt, qa, ro, rs, ru, sa, se, sg, sk, sr, sv, th, tr, tw, ua, uk, us, vn, za

    const params = {
        'fly_from': flyFrom,
        'fly_to': "",
        ...options
    };

    const dates = generateDates(weeks);
    const flightOptions = [];

    for (const dateRange of dates) {
        const flightOption = {
            ...params,
            date_from: dateRange.date_from,
            date_to: dateRange.date_from,
            return_from: dateRange.date_to,
            return_to: dateRange.date_to,
        };
        flightOptions.push(flightOption);
    }

    return flightOptions;
}

const formatFlightData = (flight) => {
    const flight1 = flight['route'][0];
    const flight2 = flight['route'][1];

    const mainObject = {
        // 'kiwi_id': flight['id'],
        // 'combination_id': flight['combination_id'],
        'price_eur': flight['price'],
        // 'flight1_country_from': flight1['countryFrom']['name'],
        'flight1_city_from': flight1['cityFrom'],
        'flight1_fly_from': flight1['flyFrom'],
        // 'flight1_country_to': flight1['countryTo']['name'],
        'flight1_city_to': flight1['cityTo'],
        'flight1_fly_to': flight1['flyTo'],
        'flight1_departure_time': flight1['local_departure'],
        'flight1_arrival_time': flight1['local_arrival'],
        'flight1_duration': calculateDuration(flight1['utc_departure'], flight1['utc_arrival']),
        'flight1_airline': flight1['airline'],
        // 'flight2_country_from': flight2['countryFrom']['name'],
        'flight2_city_from': flight2['cityFrom'],
        'flight2_fly_from': flight2['flyFrom'],
        // 'flight2_country_to': flight2['countryTo']['name'],
        'flight2_city_to': flight2['cityTo'],
        'flight2_fly_to': flight2['flyTo'],
        'flight2_departure_time': flight2['local_departure'],
        'flight2_arrival_time': flight2['local_arrival'],
        'flight2_duration': calculateDuration(flight2['utc_departure'], flight2['utc_arrival']),
        'flight2_airline': flight2['airline'],
        'availability': flight['availability']['seats'],
        'booking_link': flight['deep_link']
        // 'layovers': flight['route'].length - 1
    };

    return mainObject;
}

export const getAirlineLogo = (airline) => {
    return `https://images.kiwi.com/airlines/32x32/${airline}.png?default=airline.png`
}

export const formatFlightDataList = (flights) => {
    const formattedData = flights.map(flight => formatFlightData(flight));
    return formattedData;
}

export const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export const transformTimestamp = (dateString) => {
    const timestamp = moment(dateString, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const formattedTimestamp = timestamp.format('MMM DD, YYYY, d HH:mm');
    return formattedTimestamp;
}

export const calculateDuration = (utcDeparture, utcArrival) => {
    const departureTime = new Date(utcDeparture);
    const arrivalTime = new Date(utcArrival);

    const durationMillis = arrivalTime - departureTime;

    // Calculate hours and minutes
    const hours = Math.floor(durationMillis / (1000 * 60 * 60));
    const minutes = Math.floor((durationMillis % (1000 * 60 * 60)) / (1000 * 60));

    // Format the result
    const formattedDuration = `${hours}h ${String(minutes).padStart(2, '0')}'`;

    return formattedDuration;
}

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const searchFlights = async (airportCodes) => {
    const { data, error } = await supabase
        .from('flights')
        .select()
        .in('flight1_fly_from', airportCodes)

    return data;
}

export const letsGo = async () => {
    const airportIndexRows = await supabase.from('variables').select('value').eq('key', 'airportIndex');
    const numberOfWeeksRows = await supabase.from('variables').select('value').eq('key', 'numberOfWeeks');

    const airportIndex = parseInt(airportIndexRows.data[0].value);
    const weeks = parseInt(numberOfWeeksRows.data[0].value);

    const flyFrom = airports[airportIndex]['code'];

    const flightOptions = generateFlightOptions(flyFrom, weeks);

    let allFlights = [];

    for (const option of flightOptions) {
        const flights = await getFlights(option)

        allFlights = [...allFlights, ...flights]

        await delay(1000);
    }

    const formatted = allFlights.filter(o => o['route'] && o['route'].length === 2).map(o => formatFlightData(o));

    const dates = generateDates(weeks);

    const dateTo = dates[0]['date_to'];
    const dayStart = moment(dateTo, "DD/MM/YYYY").subtract(1, 'day').toISOString()
    const dayEnd = moment(dateTo, "DD/MM/YYYY").add(1, 'day').toISOString()

    const deletion = await supabase
        .from('flights')
        .delete()
        .eq('flight1_fly_from', flyFrom)
        .gt('flight2_arrival_time', dayStart)
        .lt('flight2_arrival_time', dayEnd);

    console.log("deletion", deletion, dayStart, dayEnd)

    const creation = await supabase
        .from('flights')
        .insert(formatted)

    // console.log("creation", creation)

    const newNmberOfWeeks = weeks >= 6 ? 1 : weeks + 1
    await supabase.from('variables').update({ value: newNmberOfWeeks, updated_at: moment().toISOString() }).eq('key', 'numberOfWeeks')

    if (newNmberOfWeeks === 1) {
        const newAirportIndex = airports[airportIndex + 1] ? airportIndex + 1 : 0;
        await supabase.from('variables').update({ value: newAirportIndex, updated_at: moment().toISOString() }).eq('key', 'airportIndex')
    }

    return formatted.length;
}
