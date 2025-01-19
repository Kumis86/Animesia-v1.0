"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Define the type for anime data
type Anime = {
  id: number;
  title: string;
  image: string;
  synopsis: string;
};

export default function AnimeList() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);

  // Fetch Anime Data
  useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch("https://api.jikan.moe/v4/anime");
        if (!response.ok) {
          throw new Error("Failed to fetch anime data");
        }
        const data = await response.json();
        const animeData = data.data.map((anime: any) => ({
          id: anime.mal_id,
          title: anime.title,
          image: anime.images.jpg.large_image_url,
          synopsis: anime.synopsis,
        }));
        setAnimeList(animeData);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    }

    fetchAnime();
  }, []);

  // Filter Anime Berdasarkan Pencarian
  useEffect(() => {
    setFilteredAnime(
      animeList.filter((anime) =>
        anime.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, animeList]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Tambahkan Link pada h1 dengan efek transisi */}
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-500 cursor-pointer transition-transform duration-300 hover:scale-110">
              Animesia
            </h1>
          </Link>
          <input
            type="text"
            placeholder="Cari anime..."
            className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Anime List */}
      <main className="container mx-auto p-8">
        <h2 className="text-2xl font-bold mb-8 text-blue-500">Semua Anime</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAnime.length > 0 ? (
            filteredAnime.map((anime) => (
              <div
                key={anime.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105 hover:border-2 hover:border-blue-500"
              >
                <div className="relative group">
                  <Image
                    src={anime.image}
                    alt={anime.title}
                    width={300}
                    height={400}
                    className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">
                    {anime.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {anime.synopsis || "Sinopsis tidak tersedia"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-300">Anime tidak ditemukan.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-center p-4 mt-8">
        <p>© 2025 Animesia. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
