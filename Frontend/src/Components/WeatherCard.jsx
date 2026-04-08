import { useState, useEffect } from "react";
import axios from "axios";

export default function WeatherCard() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [timeOfDay, setTimeOfDay] = useState("day");
    const [forecast, setForecast] = useState([]);

    const getWeather = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/weather",
                { params: { city } }
            );
            setWeather(res.data);
            
            // Forecast
            const forecast = [
                { day: "Mon", temp: Math.round(res.data.main.temp + Math.random() * 5 - 2), icon: "01d" },
                { day: "Tue", temp: Math.round(res.data.main.temp + Math.random() * 5 - 2), icon: "02d" },
                { day: "Wed", temp: Math.round(res.data.main.temp + Math.random() * 5 - 2), icon: "03d" },
                { day: "Thu", temp: Math.round(res.data.main.temp + Math.random() * 5 - 2), icon: "04d" },
                { day: "Fri", temp: Math.round(res.data.main.temp + Math.random() * 5 - 2), icon: "09d" },
                { day: "Sat", temp: Math.round(res.data.main.temp + Math.random() * 5 - 2), icon: "10d" },
                { day: "Sun", temp: Math.round(res.data.main.temp + Math.random() * 5 - 2), icon: "01d" },
            ];
            setForecast(forecast);
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
                                            points="20,100 60,70 100,80 140,50 180,60 220,40 260,65"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.6)"
                                            strokeWidth="2"
                                        />
                                        {[20, 60, 100, 140, 180, 220, 260].map((x, i) => (
                                            <circle
                                                key={i}
                                                cx={x}
                                                cy={[100, 70, 80, 50, 60, 40, 65][i]}
                                                r="4"
                                                fill="white"
                                            />
                                        ))}
                                    </svg>
                                    <div className="chart-labels">
                                        <span>8th</span>
                                        <span>9th</span>
                                        <span>10th</span>
                                        <span>11th</span>
                                        <span>12th</span>
                                        <span>13th</span>
                                        <span>14th</span>
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
        </div>
    );
}