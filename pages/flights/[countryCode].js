import React from 'react';
import { useRouter } from 'next/router'
import countries from '../utils/countries';

export default function Country({ flights, country }) {

  return <>✈️ Fri 09:05 | 🏠 Sat 20:00</>
}

export async function getServerSideProps(context) {
  const { countryCode } = context.params;

  const country = countries.find(o => o.code === countryCode)

  console.log(country);

  const flights = await getData(country.code)

  return { props: { flights, country } }
}

async function getData(countryCode) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_BASE_URL}/api/fetch-flights?countryCode=${countryCode}`, { next: { revalidate: 0 } });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
