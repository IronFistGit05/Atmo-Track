import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY || 'baa023f650136877c18a59e2bc7983a0';

app.use(cors());
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