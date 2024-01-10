import React from 'react';
import useLocalStorage from './utils/useLocalStorage';

export default function Home({ flights, ipInfo }) {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setIsReady(true), 1250);
  }, []);

  if (!isReady) {
    return <BrandedOverlay />
  }

  console.log(flights, ipInfo)

  return <div>Home</div>;
}

export async function getServerSideProps() {
  const flights = await fetchFlights()
  const ipInfo = await getIpInfo()

  return { props: { flights, ipInfo } }
}

const BrandedOverlay = () => {
  return (
    <div className="branded-overlay">
      <img
        src="/logo.png"
        width={80}
        height={80}
        alt="citybreak.pro - Find a cheap city break"
      />
    </div>
  );
};

const getIpInfo = () => new Promise((resolve, reject) => {
  fetch(`https://ipinfo.io?token=${process.env.IP_INFO_TOKEN}`, { next: { revalidate: 604800 } })
    .then((response) => response.json())
    .then((data) => {
      if (!data.error) {
        resolve(data);
      } else {
        reject(new Error(data.error));
      }
    })
    .catch((err) => reject(err));
});

const fetchFlights = () => new Promise((resolve, reject) => {
  fetch(`${process.env.PUBLIC_BASE_URL}/api/fetch-flights`, { next: { revalidate: 28800 } })
    .then((response) => response.json())
    .then((data) => {
      if (!data.error) {
        const newObj = {};
        for (const flight of data) {
          if (!newObj[flight['country_from']]) newObj[flight['country_from']] = []
          newObj[flight['country_from']].push(flight)
        }
        resolve(newObj);
      } else {
        reject(new Error(data.error));
      }
    })
    .catch((err) => reject(err));
});
