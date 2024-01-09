import { WeatherForecast } from "./WeatherForecast";

export function List({
  forecastData,
  dayHolders,
  locationEntered,
  dayClicked,
  }) {
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
      <div className="forecast-container-box">
        <div
          className="forecast-container"
          style={locationEntered && dayClicked ? { opacity: 100 } : {}}
        >
          {dayArrays}
        </div>
      </div>
    </div>
  );
}
