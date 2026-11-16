export default function WeatherCard({
  city,
  region,
  country,
  temperature,
  condition,
}) {
  const locationDetails = [region, country].filter(Boolean).join(", ");
  const accessibleLocation = [city, region, country]
    .filter(Boolean)
    .join(", ");

  return (
    <section
      aria-label={`Weather in ${accessibleLocation}`}
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "#dceeff",
        color: "#17324d",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>{city}</h2>

      {locationDetails && (
        <p style={{ margin: "-8px 0 12px", color: "#45647f" }}>
          {locationDetails}
        </p>
      )}

      <p style={{ fontSize: "32px", margin: "8px 0" }}>
        {temperature}°C
      </p>
      <p>{condition}</p>
    </section>
  );
}