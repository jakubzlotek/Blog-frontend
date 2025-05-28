// src/components/Ads.js
import React, { useEffect, useState } from 'react';

const Ads = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/ads')
      .then(response => response.json())
      .then(data => setAds(data))
      .catch(error => console.error('Błąd podczas pobierania reklam:', error));
  }, []);

  return (
    <div>
      <h2>Reklamy</h2>
      <ul>
        {ads.map(ad => (
          <li key={ad.id}>
            <a href={ad.link} target="_blank" rel="noopener noreferrer">
              <img src={ad.image} alt={ad.title} width="200" />
              <p>{ad.title}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ads;