import React from 'react';

export default function City({ flights }) {

    console.log(flights)

    // ✈️ Fri 09:05 | 🏠 Sat 20:00

    return (
        <div className='page'>

        </div>
    )
}

export async function getServerSideProps(context) {
    const { country, city } = context.params;
    const flights = await fetchFlights(country, city)

    return { props: { flights } }
}

const fetchFlights = (country, city) => new Promise((resolve, reject) => {
    fetch(`${process.env.NEXT_PUBLIC_PUBLIC_BASE_URL}/api/search-city?country=${country}&city=${city}`, { next: { revalidate: 60 } })
        .then((response) => response.json())
        .then((data) => {
            resolve(data);
        })
        .catch((err) => reject(err));
});
