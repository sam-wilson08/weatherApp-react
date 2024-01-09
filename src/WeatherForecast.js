
export function WeatherForecast({ data }) {
  const [datePart, timePart] = data.time.split("T");
  let [hour, minute] = timePart.split(":");

  let weatherEmoji = null;

  if (Number(hour) < 5 || Number(hour) > 20) {
    // Night time
    weatherEmoji = "🌙";
  } else if (Number(hour) < 8) {
    // Early morning
    weatherEmoji = data.precipitationProbability > 50 ? "🌧️" : "🌅";
  } else if (Number(hour) < 12) {
    // Morning
    weatherEmoji =
      data.temperature > 25
        ? "🌞"
        : data.precipitationProbability > 50
          ? "🌧️"
          : "☁️";
  } else if (Number(hour) < 18) {
    // Afternoon
    weatherEmoji =
      data.temperature > 20
        ? "☀️"
        : data.precipitationProbability > 50
          ? "⛈️"
          : "🌤️";
  } else {
    // Evening
    weatherEmoji =
      data.temperature > 15
        ? "🌄"
        : data.precipitationProbability > 50
          ? "🌧️"
          : "🌇";
  }

  return (
    <div
      className="box"
      style={{
        backgroundColor: Number(hour) < 5 || Number(hour) > 20 ? "#363332" : "#f7d940",
        color: Number(hour) < 5 || Number(hour) > 20 ? "white" : "black",
      }}
    >
      <div className="weather-info">
        <h2>
          {Number(hour) === 0
            ? "12am"
            : Number(hour) === 12
              ? "12pm"
              : Number(hour) < 12
                ? `${Number(hour)}am`
                : `${Number(hour) - 12}pm`}
        </h2>
        {weatherEmoji && <span>{weatherEmoji}</span>}
      </div>

      <p>Temp: {data.temperature.toFixed(0)}°C</p>
      <p>Wind (km/h): {data.windspeed.toFixed(0)}</p>
      <p>Rain Prob: {data.precipitationProbability}%</p>
    </div>
  );
}
