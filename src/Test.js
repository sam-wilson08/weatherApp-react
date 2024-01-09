import { useState, useEffect } from "react";
import { DayHolder, DisplayDays } from "./DisplayDays";
import { List } from "./List";

export function Test({
  latitude,
  longitude,
  setError,
  setForecastData,
  forecastData,
  searchClicked,
  locationEntered,
}) {
  const [isLoading, setIsLoading] = useState(false);
  let updatedForecastData;

  const date = new Date();
  date.setDate(date.getDate());

  const [dayHolders, setDayHolders] = useState([false, false, false]);
  const [dayClicked, setDayClicked] = useState(false);

  useEffect(() => {
    async function fetchForecast() {
      try {
        setIsLoading(true);

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,windspeed_10m`
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching forecast");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Forecast not found");

        updatedForecastData = data.hourly.time.map((time, index) => ({
          time,
          temperature: data.hourly.temperature_2m[index],
          windspeed: data.hourly.windspeed_10m[index],
          precipitationProbability:
            data.hourly.precipitation_probability[index],
        }));

        setForecastData(updatedForecastData);
      } catch (err) {

        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchForecast();
  }, [latitude, longitude]);

  const [activeDayIndex, setActiveDayIndex] = useState(null);

  function handleDayHolder(index) {
    setDayHolders((prevDayHolders) =>
      prevDayHolders.map((holder, i) => (i === index ? !holder : false))
    );

    setDayClicked(true);
    setActiveDayIndex(index);
  }

  const days = [
    date.toDateString(),
    new Date(date.getTime() + 24 * 60 * 60 * 1000).toDateString(),
    new Date(date.getTime() + 48 * 60 * 60 * 1000).toDateString(),
  ];

  return (
    <div>
      <div className="App">
        <div className="date-forecast-container">
          {days.map((day, index) => (
            <DisplayDays
              key={index}
              onClick={() => handleDayHolder(index)}
              day={day}
              setDayClicked={setDayClicked}
              dayClicked={dayClicked}
              isActive={activeDayIndex === index}
            />
          ))}
        </div>

        <List
          forecastData={forecastData}
          dayHolders={dayHolders}
          day={days.find((_, index) => dayHolders[index])}
          searchClicked={searchClicked}
          locationEntered={locationEntered}
          dayClicked={dayClicked}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
