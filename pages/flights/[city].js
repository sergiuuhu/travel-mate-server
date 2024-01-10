import React from 'react';

export default async function City({ params }) {
  const flights = await getData(params.city);

  return <div>{flights.length} flights found.</div>;
}

async function getData(city) {
  const res = await fetch(`/api/fetch/${city}`, { next: { revalidate: 28800 } });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
