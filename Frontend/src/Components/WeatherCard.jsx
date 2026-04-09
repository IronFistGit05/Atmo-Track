import { useState } from "react";
import axios from "axios";

export default function WeatherCard() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [chartData, setChartData] = useState([]);

    const getChartData = (forecastData) => {
        return forecastData.list.slice(0, 7).map(item => ({
            temp: Math.round(item.main.temp),
            time: new Date(item.dt_txt).getHours()
        }));
    };

    const processForecast = (data) => {
        const daily = {};

        data.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0];

            // pick first entry of each day
            if (!daily[date]) {
                daily[date] = item;
            }
        });

        return Object.keys(daily)
            .slice(0, 5)
            .map(date => {
                const item = daily[date];

                return {
                    day: new Date(date).toLocaleDateString("en-US", {
                        weekday: "short"
                    }),
                    temp: Math.round(item.main.temp),
                    icon: item.weather[0].icon
                };
            });
    };

    const getWeather = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/weather",
                { params: { city } }
            );
            // current weather
            setWeather(res.data.current);

            // real forecast
            const realForecast = processForecast(res.data.forecast);
            setForecast(realForecast);

            const chart = getChartData(res.data.forecast);
            setChartData(chart);
        } catch (error) {
            console.log(error);
            alert("City not found! Please try again.");
            setCity("");
            setWeather(null);
            setForecast([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            getWeather();
        }
    };

    return (
        <div className={`weather-app`}>
            <div className="weather-container">

                {/* Search Section */}
                <div className="search-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="search-btn" onClick={getWeather}>
                            🔍
                        </button>
                    </div>
                </div>

                {weather ? (
                    <>
                        {/* Main Weather Display */}
                        <div className="main-weather">
                            <div className="current-temp">
                                <h1>{Math.round(weather.main.temp)}°</h1>
                                <div className="location">
                                    <p>{weather.name}, {weather.sys.country}</p>
                                </div>
                            </div>
                            <div className="weather-icon-large">
                                <img
                                    src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                                    alt={weather.weather[0].description}
                                />
                            </div>
                        </div>

                        {/* Weather Details Cards */}
                        <div className="weather-cards">
                            {/* City Forecast Card */}
                            <div className="glass-card forecast-card">
                                <div className="card-header">
                                    <h3>City Forecast</h3>
                                </div>
                                <div className="forecast-grid">
                                    <div className="forecast-item">
                                        <p className="forecast-label">Feels Like</p>
                                        <h2>{Math.round(weather.main.feels_like)}°</h2>
                                        <p className="forecast-time">{weather.weather[0].main}</p>
                                    </div>
                                    <div className="forecast-item">
                                        <p className="forecast-label">High / Low</p>
                                        <h2>{Math.round(weather.main.temp_max)}°</h2>
                                        <p className="forecast-time">{Math.round(weather.main.temp_min)}°</p>
                                    </div>
                                    <div className="forecast-item">
                                        <p className="forecast-label">Pressure</p>
                                        <h2>{weather.main.pressure}</h2>
                                        <p className="forecast-time">hPa</p>
                                    </div>
                                    <div className="forecast-item">
                                        <p className="forecast-label">Visibility</p>
                                        <h2>{(weather.visibility / 1000).toFixed(1)}</h2>
                                        <p className="forecast-time">km</p>
                                    </div>
                                </div>
                            </div>

                            {/* Week Forecast Card */}
                            <div className="glass-card week-forecast-card">
                                <div className="card-header">
                                    <h3>Week Forecast</h3>
                                </div>
                                <div className="week-forecast">
                                    {forecast.map((day, index) => (
                                        <div key={index} className="day-item">
                                            <p>{day.day}</p>
                                            <img
                                                src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                                                alt="weather"
                                            />
                                            <p className="day-temp">{day.temp}°</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Your Day Card */}
                            <div className="glass-card your-day-card">
                                <h3>Your day</h3>
                                <div className="day-stats">
                                    <div className="stat-item">
                                        <div className="stat-icon">💧</div>
                                        <div className="stat-info">
                                            <p className="stat-value">{weather.main.humidity}%</p>
                                            <p className="stat-label">Humidity</p>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-icon">💨</div>
                                        <div className="stat-info">
                                            <p className="stat-value">{weather.wind.speed} m/s</p>
                                            <p className="stat-label">Wind Speed</p>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-icon">☁️</div>
                                        <div className="stat-info">
                                            <p className="stat-value">{weather.clouds.all}%</p>
                                            <p className="stat-label">Cloudiness</p>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-icon">🌅</div>
                                        <div className="stat-info">
                                            <p className="stat-value">
                                                {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <p className="stat-label">Sunrise</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Weather Statistics Card */}
                            <div className="glass-card stats-card">
                                <div className="card-header">
                                    <h3>Weather Statistics</h3>
                                </div>
                                <div className="chart-placeholder">
                                    <svg viewBox="0 0 300 150" className="weather-chart">
                                        <polyline
                                            points={chartData.map((point, i) => {
                                                const x = 20 + i * 40;
                                                const y = 120 - point.temp; // scale temp visually
                                                return `${x},${y}`;
                                            }).join(" ")}
                                            fill="none"
                                            stroke="rgba(255,255,255,0.6)"
                                            strokeWidth="2"
                                        />

                                        {chartData.map((point, i) => {
                                            const x = 20 + i * 40;
                                            const y = 120 - point.temp;

                                            return (
                                                <circle
                                                    key={i}
                                                    cx={x}
                                                    cy={y}
                                                    r="4"
                                                    fill="white"
                                                />
                                            );
                                        })}
                                    </svg>
                                    <div className="chart-labels">
                                        {chartData.map((point, i) => (
                                            <span key={i}>{point.time}:00</span>
                                        ))}
                                    </div>
                                    <div className="temp-range">
                                        <span>32°</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="welcome-screen">
                        <div className="welcome-content">
                            <div className="welcome-icon">🌤️</div>
                            <h2>Welcome to Atmo Track</h2>
                            <p>Search for a city to see the weather</p>
                        </div>
                    </div>
                )}
            </div>
            <footer className="footer">
                <p>© {new Date().getFullYear()} Atmo Track. All rights reserved.</p>
            </footer>
        </div>
    );
}