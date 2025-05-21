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

  if (loading) return <div>Ładowanie pogody…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-blue-100 rounded shadow">
      Obecna temperatura: <strong>{temp}°C</strong>
    </div>
  );
}