// ...existing code...
import { useEffect, useState } from "react";

function shuffle(array) {
  // Fisher-Yates shuffle
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
}

export default function Ads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ads?limit=20") // Adjust limit as needed
      .then((res) => res.json())
      .then((data) => {
        const shuffled = shuffle(data);
        setAds(shuffled.slice(0, 3));
        setLoading(false);
      });
  }, []);

  if (loading || !ads.length) return null;

  return (
    <div className="sticky top-24 bg-white rounded-2xl shadow p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 text-blue-700">Sponsored</h2>
      <ul className="flex flex-col gap-4">
        {ads.map((ad) => (
          <li key={ad.id} className="w-full">
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-32 object-cover rounded-lg mb-2 transition-transform group-hover:scale-105"
              />
              <p className="text-center font-medium text-sm line-clamp-2">
                {ad.title}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
// ...existing code...