import React from 'react';
import useLocalStorage from '../utils/useLocalStorage';
import overview from '../utils/overview';
import { slugify } from '../utils/slugify';

import Link from 'next/link';

export default function Home() {
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
      {Object.entries(overview).map((item, countryIndex) => (
        <div key={countryIndex}>
          <h5>{item[0]}</h5>
          {item[1].map((city, cityIndex) => {
            const href = `/flights/${slugify(item[0])}/${slugify(city)}`

            return (
              <div key={`${countryIndex}-${cityIndex}`}>
                <Link href={href}>
                  <div>{city}</div>
                </Link>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
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
