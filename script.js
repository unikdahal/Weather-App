const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const API_KEY = "13cf27984ccb393acb7c43c8b037b8d9";

let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromLocalStorage();

function switchTab(tab) {
  if (tab === currentTab) {
    return;
  } else {
    currentTab.classList.remove("current-tab");
    currentTab = tab;
    currentTab.classList.add("current-tab");
    

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      getFromLocalStorage();
    }
  }
}

// Check if the user has granted access to location
function getFromLocalStorage() {
  const localCoords = sessionStorage.getItem("user-coords");
  if (!localCoords) {
    grantAccessContainer.classList.add("active");
  } else {
    const coords = JSON.parse(localCoords);
    fetchUserWeather(coords);
  }
}

async function fetchUserWeather(coords) {
  const { latitude, longitude } = coords;
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(data) {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDescription]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-clouds]");

  cityName.innerText = data?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  desc.innerText = data?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  temp.innerText = `${data?.main?.temp} °C`
  windSpeed.innerText = `${data?.wind?.speed} m/s`;
  humidity.innerText = `${data?.main?.humidity}%`;
  cloudiness.innerText = `${data?.clouds?.all}%`;
}

userTab.addEventListener('click', () => {
  switchTab(userTab);
});

searchTab.addEventListener('click', () => {
  switchTab(searchTab);
});

const grantAccessBtn = document.querySelector("[data-grantAccess]");

grantAccessBtn.addEventListener("click", () => {
  getLocation();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const coords = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  sessionStorage.setItem("user-coords", JSON.stringify(coords));
  fetchUserWeather(coords);
}

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value === "") {
    alert("Please enter a city name");
  } else {
    fetchCustomWeather(searchInput.value);
  }
});

async function fetchCustomWeather(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    alert("Please enter a valid city name");
  }
}
