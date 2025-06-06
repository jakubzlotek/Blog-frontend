import { useState, useEffect } from 'react';

export default function TemperatureWidget() {
  const [temp, setTemp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeatherByIP() {
      try {
        // 1. Get user's IP address
        const ipRes = await fetch('https://api.ipify.org?format=json');
        if (!ipRes.ok) throw new Error('Nie udało się pobrać IP');
        const { ip } = await ipRes.json();

        // 2. Geolocate IP
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!geoRes.ok) throw new Error('Nie udało się pobrać lokalizacji');
        const geo = await geoRes.json();
        const { latitude, longitude } = geo;
        if (!latitude || !longitude) throw new Error('Brak współrzędnych lokalizacji');

        // 3. Fetch weather
        const url = `http://wttr.in/${latitude},${longitude}?format=%t`;
        const weatherRes = await fetch(url);
        if (!weatherRes.ok) throw new Error('Błąd podczas pobierania pogody');
        const data = await weatherRes.text();
        const temperature = data.replace('+', '').replace('°C', '').trim();
        setTemp(temperature);
      } catch (err) {
        console.error(err);
        setError('Nie udało się pobrać pogody na podstawie IP');
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherByIP();
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