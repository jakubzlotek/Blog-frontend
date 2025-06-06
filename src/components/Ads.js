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
    <div className="sticky top-24 bg-white rounded-xl mb-4">
      <h2 className="text-lg font-semibold mb-4 text-blue-700">Sponsored</h2>
      <ul className="flex flex-col gap-4">
        {ads.map((ad) => (
          <li key={ad.id} className="w-full">
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 hover:bg-gray-50 rounded-lg p-4 transition"
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-20 h-20 rounded-lg flex-shrink-0 object-contain bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate">{ad.title}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-1">
                  <span>{ad.category}</span>
                  <span className="text-green-700 font-bold ml-2">${ad.price}</span>
                </div>
                <p className="text-gray-600 text-sm truncate">{ad.description}</p>
                {ad.rating && (
                  <span className="text-yellow-600 text-sm">
                    ⭐ {ad.rating.rate} ({ad.rating.count})
                  </span>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
// ...existing code...