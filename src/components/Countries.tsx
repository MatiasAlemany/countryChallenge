import { useState, useEffect } from "react";
import { Trash, Star } from "lucide-react";

interface Country {
  name: {
    common: string;
  };
  region: string;
  flag: string;
  cca3: string;
}

const Countries = () => {
  // State variables to manage countries data, loading state, error message,
  // search input, and favorites list
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch countries data from the API
  // and handle loading and error states
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error("Error al obtener los países");
        }
        const data: Country[] = await response.json();
        setCountries(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter countries based on search input
  const filteredCountries = countries.filter(
    (country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase()) ||
      country.region.toLowerCase().includes(search.toLowerCase())
  );

  // Handle delete and favorite actions
  const handleDelete = (cca3: string) => {
    setCountries(countries.filter((country) => country.cca3 !== cca3));
  };

  // Handle adding/removing favorites
  // and update the favorites state accordingly
  const handleFavorites = (cca3: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(cca3)) {
        return prevFavorites.filter((id) => id !== cca3);
      } else {
        return [...prevFavorites, cca3];
      }
    });
  };

  if (loading) return <p>Loading countries...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-sefif font-bold mb-4 text-center">
        COUNTRIES LIST
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Looking for a country?
        </label>
        <input
          type="text"
          placeholder="Search your country here"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ul className="space-y-4">
        {search.trim() !== "" ? ( 
        filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <li
              key={country.cca3}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold">{country.name.common}</p>
                <p className="text-sm text-gray-500">{country.region}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(country.cca3)}
                  title="Delete country"
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleFavorites(country.cca3)}
                  title="Choose your favorite"
                  className="text-yellow-500 hover:text-yellow-600 transition"
                >
                  <Star
                    className="w-5 h-5"
                    fill={favorites.includes(country.cca3) ? "gold" : "none"}
                  />
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No countries found.</p>
        )) : null}
      </ul>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Your Favorites
        </h3>
        <ul className="grid grid-cols-2 gap-3">
          {favorites.length > 0 ? (
            favorites.map((cca3) => {
              const country = countries.find((c) => c.cca3 === cca3);
              return country ? (
                <li
                  key={country.cca3}
                  className="bg-blue-100 text-blue-800 p-2 rounded-md shadow flex justify-between items-center"
                >
                  <span>
                    {country.flag} {country.name.common}
                  </span>
                  <button
                    onClick={() => handleFavorites(country.cca3)}
                    title="Choose your favorite"
                    className="text-yellow-500 hover:text-yellow-600 transition"
                  >
                    <Star
                      className="w-5 h-5"
                      fill={favorites.includes(country.cca3) ? "gold" : "none"}
                    />
                  </button>
                </li>
              ) : null;
            })
          ) : (
            <p className="text-center text-gray-500 col-span-2">
              No tienes países favoritos.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Countries;
