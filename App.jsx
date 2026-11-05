import { useState } from "react";
import WeatherCard from "./WeatherCard";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cityName = city.trim();

    if (!cityName) {
      setMessage("Enter a city name.");
      setWeather(null);
      return;
    }

    setMessage("Demo data only — live weather lookup is not connected.");
    setWeather({
      city: cityName,
      temperature: 24,
      condition: "Sunny",
    });
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>Weather App</h1>
        <p>Enter a city to see a sample weather card.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="city">City</label>
          <input
            id="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="e.g. Mumbai"
          />
          <button type="submit">Check weather</button>
        </form>

        {message && <p role="status">{message}</p>}

        {weather && (
          <WeatherCard
            city={weather.city}
            temperature={weather.temperature}
            condition={weather.condition}
          />
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
    width: "min(100%, 420px)",
    padding: "32px",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 8px 30px #17324d22",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
};
