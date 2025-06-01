import React, { useEffect, useState } from "react";

/**
 * Ads sidebars – pobiera dane z zewnętrznego Fake Store API
 * (https://fakestoreapi.com) i wyświetla połowę po lewej, połowę po prawej
 * stronie ekranu. Umieszczone 5 rem poniżej nawigacji, więc nie zasłaniają UI
 * i pozostają na stałej pozycji podczas scrollowania.
 */
const Ads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // Pobieramy 10 "produktów" z otwartego API
        const res = await fetch("https://fakestoreapi.com/products?limit=6");
        const products = await res.json();

        // Mapujemy je do formatu { id, title, image, link }
        const mapped = products.map((p) => ({
          id: p.id,
          title: p.title,
          image: p.image,
          link: `https://fakestoreapi.com/products/${p.id}`,
        }));

        setAds(mapped);
      } catch (err) {
        console.error("Błąd podczas pobierania reklam:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading || !ads.length) return null;

  // Dzielenie na kolumny
  const mid = Math.ceil(ads.length / 2);
  const leftAds = ads.slice(0, mid);
  const rightAds = ads.slice(mid);

  const AdCard = ({ ad }) => (
    <li className="w-56 bg-white rounded-2xl shadow p-3 flex flex-col items-center">
      <a
        href={ad.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
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
  );

  const sidebarCls =
    "hidden lg:flex fixed top-20 max-h-[calc(100vh-6rem)] overflow-y-auto flex-col gap-4 z-40";

  return (
    <>
      {/* Lewy pasek */}
      <aside className={`${sidebarCls} left-4`}>
        <ul className="flex flex-col gap-4 pb-8 pr-2 scrollbar-thin">
          {leftAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </ul>
      </aside>

      {/* Prawy pasek */}
      <aside className={`${sidebarCls} right-4`}>
        <ul className="flex flex-col gap-4 pb-8 pl-2 scrollbar-thin">
          {rightAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Ads;
