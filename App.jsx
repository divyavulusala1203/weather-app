import { useState } from "react";

export default function App() {
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cityName = city.trim();
    if (!cityName) {
      setMessage("Enter a city name.");
      return;
    }

    setMessage(`Weather lookup for ${cityName} is not connected yet.`);
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>Weather App</h1>
        <p>Enter a city to get started.</p>

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
