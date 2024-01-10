import React from 'react';
import { useRouter } from 'next/router'

export default async function City() {
  const router = useRouter()

  const flights = await getData(router.query.city);

  return <div>{flights.length} flights found.</div>;
}

async function getData(city) {
  const res = await fetch(`/api/fetch/${city}`, { next: { revalidate: 28800 } });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
