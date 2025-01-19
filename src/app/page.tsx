// src/app/page.tsx
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Define the type for anime data
type Anime = {
  id: number;
  title: string;
  genres: string;
  synopsis: string;
  image: string;
};

export default function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  // Fetch data for popular anime
  useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch("https://api.jikan.moe/v4/top/anime");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.data) {
          setAnimeList(
            data.data.map((anime: any) => ({
              id: anime.mal_id,
              title: anime.title,
              genres: anime.genres.map((genre: any) => genre.name).join(", "),
              synopsis: anime.synopsis || "No synopsis available.",
              image: anime.images.jpg.large_image_url || "/default-image.jpg",
            }))
          );
        }
      } catch (error) {
        console.error("Error saat memuat anime:", error);
      }
    }

    fetchAnime();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 fixed w-full top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-500">Animesia</h1>
          <div className="flex space-x-4 items-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
            <a href="#" className="text-white hover:text-blue-400">
              Home
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              Popular
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              Genres
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mt-16">
        {animeList.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop
            className="w-full h-[70vh] sm:h-[80vh] lg:h-[90vh]"
          >
            {animeList.slice(0, 5).map((anime) => (
              <SwiperSlide key={anime.id}>
                <div
                  className="w-full h-full bg-cover bg-center flex items-center relative"
                  style={{ backgroundImage: `url(${anime.image})` }}
                >
                  {/* Overlay Gradasi Kiri */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r"
                    style={{
                      background: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)`,
                    }}
                  ></div>
                  {/* Overlay Gradasi bawah */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 py-16">
                    <div className="max-w-lg">
                      <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        {anime.title}
                      </h2>
                      <p className="text-blue-400 mb-2 text-sm md:text-base">
                        Genres: {anime.genres}
                      </p>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {anime.synopsis}
                      </p>
                      <Link href="/Anime-list">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                          Explore Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-400">Loading...</p>
        )}
      </section>

      {/* Gradasi Transisi ke Trending Section */}
      <div className="h-16 bg-gradient-to-t from-gray-800 to-gray-900"></div>

      {/* Trending Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-500 mb-8">
            Trending Anime
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {animeList.slice(5, 13).map((anime) => (
              <div
                key={anime.id}
                className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition"
              >
                <Image
                  src={anime.image}
                  alt={anime.title}
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {anime.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {anime.synopsis}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
