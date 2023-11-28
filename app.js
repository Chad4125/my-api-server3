const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cron = require('node-cron');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/weatherDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const WeatherData = mongoose.model('WeatherData', {
  //temperature: Number,
  //description: String,
  data: String,
  timestamp: { type: Date, default: Date.now },
});



// Function to fetch weather data from the API
const fetchWeatherData = async () => {
  try {
    const response = await axios.get(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=WLm8yF801DZP%2FnyNRjzZxFL1FugM0JS%2FJxo35T927rUJTTkWqV57Q2UjLQGgKPHsRG6VsKJlxEGJQBSwKNggbg%3D%3D&pageNo=1&numOfRows=1000&dataType=XML&base_date=20231128&base_time=1800&nx=55&ny=127`
    );
    // const { main, weather } = response.data;
    // const temperature = main.temp;
    // const description = weather[0].description;

    console.log(response);

    const data = response;

    // Save data to MongoDB
    const weatherData = new WeatherData({ data });
    await weatherData.save();

    console.log('Weather data fetched and saved:', weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
  }
};

// Schedule the job to fetch weather data every hour (you can adjust the cron schedule as needed)
cron.schedule('*/5 * * * * *', fetchWeatherData);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});