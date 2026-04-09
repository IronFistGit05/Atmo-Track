import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;

// CORS configuration for production
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    // Add your deployed frontend URLs here
    // 'https://your-app-name.vercel.app',
    // 'https://your-app-name.netlify.app',
];
 
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

app.get("/api/weather", async (req, res) => {
    try {
        const city = req.query.city;
        const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await fetch(BASE_URL);
        const data  = await response.json();
        console.log(data);
        res.json(data);
        //console.log(city);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

//

app.listen(PORT, () => {
    console.log(`Atmo Track server running on http://localhost:${PORT}`);
});