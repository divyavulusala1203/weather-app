import "./App.css";

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
      className="weather-result"
      aria-label={`Weather in ${accessibleLocation}`}
    >
      <h2>{city}</h2>

      {locationDetails && (
        <p className="location-details">{locationDetails}</p>
      )}

      <p className="current-temperature">{temperature}°C</p>
      <p className="current-condition">{condition}</p>
    </section>
  );
}