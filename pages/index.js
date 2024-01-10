import React from 'react';
import useLocalStorage from './utils/useLocalStorage';

export default function Home() {
  const [isReady, setIsReady] = React.useState(false);
  const [ipInfo, setIpInfo] = useLocalStorage('ipInfo', {});

  React.useEffect(() => {
    setTimeout(() => setIsReady(true), 1400);
  }, []);

  React.useEffect(() => {
    if (isReady && (!ipInfo || !Object.keys(ipInfo).length)) {
      getIpInfo();
    }

    console.log(ipInfo)
  }, [isReady, ipInfo]);


  const getIpInfo = async () => {
    fetch(`https://ipinfo.io?token=${process.env.NEXT_PUBLIC_IP_INFO_TOKEN}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setIpInfo(data);
        }
      })
      .catch((err) => console.log(err));
  };

  return <div>Home</div>;
}
