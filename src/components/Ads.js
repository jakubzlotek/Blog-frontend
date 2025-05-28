// src/components/Ads.js
import React, { useEffect, useState } from 'react';

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ads')
      .then(response => response.json())
      .then(data => setAds(data))
      .catch(error => console.error('Błąd podczas pobierania reklam:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center my-4">Ładowanie reklam...</div>;
  }

  if (!ads.length) {
    return <div className="text-center my-4 text-gray-400">Brak reklam do wyświetlenia.</div>;
  }

  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold mb-2">Reklamy</h2>
      <ul className="flex flex-wrap gap-4 justify-center">
        {ads.map(ad => (
          <li key={ad.id} className="bg-white rounded shadow p-3 flex flex-col items-center w-56">
            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <img src={ad.image} alt={ad.title} className="w-full h-32 object-cover rounded mb-2" />
              <p className="text-center font-medium">{ad.title}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ads;