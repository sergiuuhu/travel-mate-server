import React from 'react';
import useLocalStorage from './utils/useLocalStorage';

export default function Home() {
 const [ipInfo, setIpInfo] = useLocalStorage('ipInfo', null);
 
  useEffect(() => {
   if (!ipInfo) {
    getIpInfo();
   }
  }, []);

  const getIpInfo = async () => {
    fetch("https://ipinfo.io?token=522b56be4488da")
      .then((response) => response.json())
      .then((data) => {
       console.log(data)
       seIpInfo(data);
      })
      .catch((err) => console.log(err));
  };

  return <div>Home</div>;
}
