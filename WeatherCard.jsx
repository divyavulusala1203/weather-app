export default function WeatherCard({ city, temperature, condition }) {
  return (
    <section
      aria-label={`Weather in ${city}`}
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "#dceeff",
        color: "#17324d",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>{city}</h2>
      <p style={{ fontSize: "32px", margin: "8px 0" }}>
        {temperature}°C
      </p>
      <p>{condition}</p>
    </section>
  );
}
