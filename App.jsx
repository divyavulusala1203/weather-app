import { useState } from "react";
import WeatherCard from "./WeatherCard";

function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([56, 57].includes(code)) return "Freezing drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather conditions unavailable";
}

function formatForecastDay(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

function isValidNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const cityName = city.trim();

    if (!cityName) {
      setMessage("Enter a city name.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setWeather(null);

    try {
      const locationUrl = new URL(
        "https://geocoding-api.open-meteo.com/v1/search",
      );
      locationUrl.searchParams.set("name", cityName);
      locationUrl.searchParams.set("count", "1");
      locationUrl.searchParams.set("language", "en");
      locationUrl.searchParams.set("format", "json");

      const locationResponse = await fetch(locationUrl);

      if (!locationResponse.ok) {
        throw new Error("Could not search for that city. Please try again.");
      }

      const locationData = await locationResponse.json();
      const location = locationData.results?.[0];

      if (!location) {
        setMessage(`No city named "${cityName}" was found. Check the spelling.`);
        return;
      }

      const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
      weatherUrl.searchParams.set("latitude", location.latitude);
      weatherUrl.searchParams.set("longitude", location.longitude);
      weatherUrl.searchParams.set("current", "temperature_2m,weather_code");
      weatherUrl.searchParams.set(
        "daily",
        "weather_code,temperature_2m_max,temperature_2m_min",
      );
      weatherUrl.searchParams.set("forecast_days", "6");
      weatherUrl.searchParams.set("timezone", "auto");
      weatherUrl.searchParams.set("temperature_unit", "celsius");

      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error("Could not load weather data. Please try again.");
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;
      const daily = weatherData.daily;

      if (
        !current ||
        !isValidNumber(current.temperature_2m) ||
        !isValidNumber(current.weather_code)
      ) {
        throw new Error(
          "The weather service returned incomplete current conditions.",
        );
      }

      const hasForecastArrays =
        Array.isArray(daily?.time) &&
        Array.isArray(daily?.weather_code) &&
        Array.isArray(daily?.temperature_2m_max) &&
        Array.isArray(daily?.temperature_2m_min);

      if (
        !hasForecastArrays ||
        daily.time.length < 6 ||
        daily.weather_code.length < 6 ||
        daily.temperature_2m_max.length < 6 ||
        daily.temperature_2m_min.length < 6
      ) {
        throw new Error(
          "The weather service returned incomplete forecast data. Please try again.",
        );
      }

      const forecast = daily.time.slice(1, 6).map((date, index) => {
        const dataIndex = index + 1;
        const weatherCode = daily.weather_code[dataIndex];
        const maximum = daily.temperature_2m_max[dataIndex];
        const minimum = daily.temperature_2m_min[dataIndex];

        if (
          typeof date !== "string" ||
          !isValidNumber(weatherCode) ||
          !isValidNumber(maximum) ||
          !isValidNumber(minimum)
        ) {
          throw new Error(
            "One of the forecast days has incomplete data. Please try again.",
          );
        }

        return {
          date,
          condition: getWeatherDescription(weatherCode),
          maximum: Math.round(maximum),
          minimum: Math.round(minimum),
        };
      });

      setWeather({
        city: location.name,
        region: location.admin1 || "",
        country: location.country || "",
        temperature: Math.round(current.temperature_2m),
        condition: getWeatherDescription(current.weather_code),
        forecast,
      });
      setMessage(`Current weather and 5-day forecast for ${location.name}.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading the weather.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>Weather App</h1>
        <p>Enter a city to see its current weather and 5-day forecast.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="city">City</label>
          <input
            id="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="e.g. Mumbai"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Check weather"}
          </button>
        </form>

        {message && <p role="status">{message}</p>}

        {weather && (
          <>
            <WeatherCard
              city={weather.city}
              region={weather.region}
              country={weather.country}
              temperature={weather.temperature}
              condition={weather.condition}
            />

            <section style={styles.forecast} aria-label="5-day forecast">
              <h2>5-day forecast</h2>

              <div style={styles.forecastList}>
                {weather.forecast.map((day) => (
                  <article key={day.date} style={styles.forecastDay}>
                    <strong>{formatForecastDay(day.date)}</strong>
                    <span>{day.condition}</span>
                    <span>
                      High {day.maximum}°C · Low {day.minimum}°C
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    background: "#eef6ff",
  },
  card: {
    width: "min(100%, 560px)",
    padding: "32px",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 8px 30px #17324d22",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  forecast: {
    marginTop: "28px",
  },
  forecastList: {
    display: "grid",
    gap: "10px",
  },
  forecastDay: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "8px",
    padding: "12px",
    borderRadius: "10px",
    background: "#f3f7fc",
  },
};