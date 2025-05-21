import { useState, useEffect } from 'react';

export default function TemperatureWidget() {
  const [temp, setTemp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Twoja przeglądarka nie wspiera geolokalizacji');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        const url = `https://wttr.in/${latitude},${longitude}?format=%t`;

        fetch(url)
          .then(res => {
            if (!res.ok) throw new Error('Błąd podczas pobierania pogody');
            return res.text();
          })
          .then(data => {
            const temperature = data.replace('+', '').replace('°C', '').trim();
            setTemp(temperature);
          })
          .catch(err => {
            console.error(err);
            setError('Nie udało się pobrać pogody');
          })
          .finally(() => {
            setLoading(false);
          });
      },
      (geoErr) => {
        console.error(geoErr);
        setError('Brak pozwolenia na dostęp do lokalizacji');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const getEmojiForTemperature = (temperature) => {
    if (temperature === null) return '';
    const tempNum = parseInt(temperature, 10);
    if (tempNum <= 0) return '❄️';
    if (tempNum <= 15) return '🌥️';
    if (tempNum <= 25) return '☀️';
    return '🔥';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md mb-4">
        Ładowanie pogody…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 bg-red-100 text-red-500 rounded-lg shadow-md mb-4">
        {error}
      </div>
    );
  }

  const emoji = getEmojiForTemperature(temp);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg mb-4 flex items-center">
      <div className="text-6xl mr-1">{emoji}</div>
      <div>
        <h2 className="text-xl font-semibold">Obecna temperatura</h2>
        <p className="text-4xl font-bold">{temp}°C</p>
      </div>
    </div>
  );
}