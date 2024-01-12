import React from 'react';
import useLocalStorage from '../utils/useLocalStorage';

export default function Home({ flights }) {
  const [isReady, setIsReady] = React.useState(false);
  const [ipInfo, setIpInfo] = useLocalStorage('ipInfo', {});

  React.useEffect(() => {
    setTimeout(() => setIsReady(true), 1250);

    // new Sticksy('.js-sticky-widget');
  }, []);

  React.useEffect(() => {
    if (isReady && (!ipInfo || !Object.keys(ipInfo).length)) {
      getIpInfo()
        .then((ipInfo) => setIpInfo(ipInfo))
        .catch((error) => console.error(error));
    }
  }, [isReady, ipInfo]);

  if (!isReady) {
    return <BrandedOverlay />
  }

  return (
    <div className='page'>
      <div className='page-left'>
        {flights.map((o, i) => (
          <div key={i}>{o[0]} ({o[1]})</div>
        ))}
      </div>
      <div className='page-right'>
        Right
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const flights = await fetchFlights()

  return { props: { flights } }
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
  fetch(`https://ipinfo.io?token=${process.env.NEXT_PUBLIC_IP_INFO_TOKEN}`)
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
  fetch(`${process.env.NEXT_PUBLIC_PUBLIC_BASE_URL}/api/fetch-flights`, { next: { revalidate: 60 } })
    .then((response) => response.json())
    .then((data) => {
      if (!data.error) {
        const newObj = {};
        for (const flight of data) {
          if (!newObj[flight['country_from']]) newObj[flight['country_from']] = []
          newObj[flight['country_from']].push(flight)
        }
        resolve(Object.entries(newObj).sort((a, b) => b[1].length - a[1].length).map(o => ({ 0: o[0], 1: o[1].length })));
      } else {
        reject(new Error(data.error));
      }
    })
    .catch((err) => reject(err));
});
