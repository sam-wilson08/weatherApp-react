import { useState, useEffect } from "react";

export default function App2() {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  const handleSearch = () => {
    setSearchClicked(true);
    console.log("search clicked");
    console.log(latitude);
    console.log(longitude);
    console.log(forecastData);
  };

  return (
    <div>
      <Header/>
      <Search onSearch={handleSearch} city={city} setCity={setCity} />
      <Address
        city={city}
        longitude={longitude}
        latitude={latitude}
        setLongitude={setLongitude}
        setLatitude={setLatitude}
        setForecastData={setForecastData}
        forecastData={forecastData}
        searchClicked={searchClicked}
        setSearchClicked={setSearchClicked}
      />
    </div>
  );
}

function Header() {
  return (
    <div className="header_container">
      <div className="header">
        <h1>WeatherApp 🌦️</h1>
      </div>
    </div>
  );
}

function Address({
  city,
  setLatitude,
  setLongitude,
  longitude,
  latitude,
  setForecastData,
  forecastData,
  searchClicked,
  setSearchClicked,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchForecast() {
      try {
        if (searchClicked) {
          setIsLoading(true);

          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${city}&lang=en&limit=10&type=city&filter=countrycode:gb&apiKey=3ba5aabbd94c40a3bf642d19bb476be1`
          );

          if (!res.ok) {
            throw new Error("Something went wrong with fetching forecast");
          }

          const data = await res.json();
          // console.log(data); // Log the response data

          if (data.Response === "False") {
            throw new Error("Forecast not found");
          }

          setLatitude(data.features[0].properties.lat);
          setLongitude(data.features[0].properties.lon);
          setSearchClicked(false); // Reset the searchClicked state after updating data
        }
      } catch (err) {
        // console.log(err.message);
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchForecast();
  }, [city, searchClicked]);

  return (
    <div>
      <Test
        latitude={latitude}
        longitude={longitude}
        setError={setError}
        setForecastData={setForecastData}
        forecastData={forecastData}
      />
    </div>
  );
}


function Test({
  latitude,
  longitude,
  setError,
  setForecastData,
  forecastData,
}) {
  const [isLoading, setIsLoading] = useState(false);
  // const [query, setQuery] = useState("");

  let updatedForecastData;

  const date = new Date();
  date.setDate(date.getDate());

  const [dayHolders, setDayHolders] = useState([false, false, false]);

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
        // console.log(err.message);
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchForecast();
  }, [latitude, longitude]);

  function Loader() {
    return <p className="loader">Loading...</p>;
  }

  function handleDayHolder(index) {
    setDayHolders((prevDayHolders) =>
      prevDayHolders.map((holder, i) => (i === index ? !holder : false))
    );
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
            <DayHolder
              key={index}
              onClick={() => handleDayHolder(index)}
              day={day}
            />
          ))}
        </div>
        {isLoading && <Loader />}
        <List
          forecastData={forecastData}
          dayHolders={dayHolders}
          day={days.find((_, index) => dayHolders[index])}
        />
      </div>
    </div>
  );
}

function Search({ onSearch, city, setCity }) {
  const handleClick = () => {
    onSearch();
  };
  return (
    <div className="search_container">
      <input
        type="text"
        placeholder="Enter a UK City.."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      ></input>
      <button onClick={handleClick}>Search</button>
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function WeatherForecast({ data }) {
  const [datePart, timePart] = data.time.split("T");
  let [hour, minute] = timePart.split(":");



  return (
    <div
      className="box"
      style={{
        backgroundColor:
          Number(hour) < 5 || Number(hour) > 20 ? "white" : "#f7d940",
      }}
    >
      <div class="weather-info">
        <h2>
          {Number(hour) < 10
            ? hour[1] + "am"
            : hour === "12"
            ? hour + "pm"
            : Number(hour) > 12
            ? Number(hour) - 12 + "pm"
            : hour + "am"}
        </h2>
        {
          data.precipitationProbability > 10 ? (
            <span>🌧️</span>
          ) : data.temperature > 10 && data.precipitationProbability < 10 ? (
            <span>🌞</span>
          ) : data.temperature > 10 && data.precipitationProbability > 9 ? (
            <span>🌦️</span>
          ) : null /* Handle the case when none of the conditions are met */
        }
      </div>

      <p>Temp: {data.temperature.toFixed(0)}°C</p>
      <p>Wind (km/h): {data.windspeed}</p>
      <p>Chance of Rain: {data.precipitationProbability}%</p>
    </div>
  );
}

function List({ forecastData, dayHolders, day }) {
  const hoursPerDay = 24;
  const dayArrays = [];

  for (let i = 0; i < dayHolders.length; i++) {
    if (dayHolders[i]) {
      const startIndex = i * hoursPerDay;
      const endIndex = startIndex + hoursPerDay;
      const dayData = forecastData.slice(startIndex, endIndex);
      dayArrays.push(
        <ul key={i}>
          {dayData.map((item, innerIndex) => (
            <WeatherForecast key={innerIndex} data={item} />
          ))}
        </ul>
      );
    }
  }

  return (
    <div>
      <div className="box-chosen-day">
        <h2>{day}</h2>
      </div>
      <div className="forecast-container-box">
        <div className="forecast-container">{dayArrays}</div>
      </div>
    </div>
  );
}

function DayHolder({ onClick, day }) {
  return (
    <div className="box-day" onClick={onClick}>
      <h1>{day} </h1>
    </div>
  );
}
