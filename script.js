// Function to execute when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the user's current location and call getWeather with the coordinates
  if (navigator.geolocation) {
    // If geolocation is supported, attempt to get user's location
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getWeatherByCoordinates(latitude, longitude);
      },
      function (error) {
        console.error("Error getting user's location:", error);
        // If there's an error getting user's location, fallback to default city
        const defaultCity = "Seattle";
        getWeather(defaultCity);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    // If geolocation is not supported, fallback to default city
    const defaultCity = "Seattle";
    getWeather(defaultCity);
  }
});

// Function to handle location icon click
function handleLocation() {
  if (navigator.geolocation) {
    // If geolocation is supported, attempt to get user's location
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getWeatherByCoordinates(latitude, longitude);
      },
      function (error) {
        console.error("Error getting user's location:", error);
        alert("Error getting user's location. Please try again.");
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    alert("Geolocation is not supported by this browser.");
  }
}

// -------------------------------------------------------------------------------------------

// Function to fetch weather data by coordinates

function getWeatherByCoordinates(latitude, longitude) {
  // API key for OpenWeatherMap API
  const apiKey = "6992a906425b410e527e399687bd1847";

  // Construct URLs for current weather and forecast using coordinates
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  // Fetch current weather data
  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      // Display current weather
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      alert("Error fetching current weather data. Please try again.");
    });

  // Fetch hourly forecast data
  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      // Display hourly forecast
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Please try again.");
    });
}

// -------------------------------------------------------------------------------------------

// Function to get weather data by city name
function getWeather(city) {
  const apiKey = "6992a906425b410e527e399687bd1847";

  // If city name is not provided, show an alert
  if (!city) {
    alert("Please enter a city");
    return;
  }
  // Construct URLs for current weather and forecast using city name
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Fetch current weather data
  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      // Display current weather
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      alert("Error fetching current weather data. Please try again.");
    });

  // Fetch hourly forecast data
  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Please try again.");
    });
}

// Function to search weather data by city name
function searchWeather() {
  const cityInput = document.getElementById("city").value;
  getWeather(cityInput);
}

// ---------------------------------------------------------------------------------------
// Function to display current weather
function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  // Clear previous content
  weatherInfoDiv.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  // If data is not found (404 error), display error message
  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    // Extract relevant data from the response
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15); // Convert temperature to Celsius
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Construct HTML for temperature and weather description
    const temperatureHTML = `<p>${temperature}°C</p>`;
    const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

    // Update DOM elements with weather data
    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    // Change background image based on weather conditions
    if (description.toLowerCase().includes("rain")) {
      document.body.style.backgroundImage = "url('./images/rain.jpg')";
    } else if (description.toLowerCase().includes("clear")) {
      document.body.style.backgroundImage = "url('./images/clearsky.webp')";
    } else if (temperature > 30) {
      document.body.style.backgroundImage = "url('./images/hot.jpg')";
    } else if (temperature < 12) {
      document.body.style.backgroundImage = "url('./images/cold.jpg')";
    } else {
      document.body.style.backgroundImage = "url('./images/normal.jpg')";
    }
    showImage();
  }
}

// --------------------------------------------------------------------------------------------
// function to display hourly forecast
function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block"; // Make the image visible once it's loaded
}
