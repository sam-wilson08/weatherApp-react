import { useState } from "react";
import "./index.css"; // Import the CSS file
import { Message } from "./header/Message";
import { Loader } from "./searchBar/Loader";
import { Search } from "./searchBar/Search";
import { CityAPI } from "./CityAPI";
import { Header } from "./header/Header";

export default function App2() {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [searchClicked, setSearchClicked] = useState();
  const [locationEntered, setLocationEntered] = useState();
  const [isLoading, setIsLoading] = useState(false);
 
  const handleSearch = () => {
    setSearchClicked(true);
    setLocationEntered(true);
  };

  return (
    <div>
      <Header />
      <Message />
      <div className="search_load_container">
        <Search onSearch={handleSearch} city={city} setCity={setCity} />
        {isLoading && <Loader />}
      </div>
      <CityAPI
        city={city}
        longitude={longitude}
        latitude={latitude}
        setLongitude={setLongitude}
        setLatitude={setLatitude}
        setForecastData={setForecastData}
        forecastData={forecastData}
        searchClicked={searchClicked}
        setSearchClicked={setSearchClicked}
        setLocationEntered={setLocationEntered}
        locationEntered={locationEntered}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}


