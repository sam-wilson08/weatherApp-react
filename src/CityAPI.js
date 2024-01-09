import { useState, useEffect, useRef } from "react";
import { Test } from "./Test";

export function CityAPI({
  city,
  setLatitude,
  setLongitude,
  latitude,
  searchClicked,
  setSearchClicked,
  longitude,
  setIsLoading,
  setForecastData,
  locationEntered,
  forecastData,
}) {
  const [error, setError] = useState("");
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    async function fetchForecast() {
      try {
        if (searchClicked) {
          setIsLoading(true);

          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${city}&lang=en&limit=10&type=city&filter=countrycode:gb&apiKey=3ba5aabbd94c40a3bf642d19bb476be1`
          );

          if (!res.ok) {
            throw new Error("No city found");
          }

          const data = await res.json();
          console.log(data); // Log the response data

          if (data.Response === "false") {
            throw new Error("Forecast not found");
          }

          setLatitude(data.features[0].properties.lat);
          setLongitude(data.features[0].properties.lon);
          setSearchClicked(false); // Reset the searchClicked state after updating data
        }
      } catch (err) {
        console.log(err.message);
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchForecast();
  }, [
    city,
    searchClicked,
    setLatitude,
    setLongitude,
    setSearchClicked,
    setIsLoading,
  ]);

  return (
    <div>
      <Test
        latitude={latitude}
        longitude={longitude}
        setError={setError}
        setForecastData={setForecastData}
        forecastData={forecastData}
        searchClicked={searchClicked}
        locationEntered={locationEntered}
      />
    </div>
  );
}
