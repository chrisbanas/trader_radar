// Check if the user is on a mobile device
function isMobileDevice() {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/;
  return mobileRegex.test(navigator.userAgent);
}

// Function to show the alert
function showMobileAlert() {
  alert("Please use a desktop device to access this app.");
}

// // Redirect to www.traderradar.net if bad URL
// if (window.location.href !== "https://www.traderradar.net") {
//   window.location.href = "https://www.traderradar.net";
// }

// Add the alert logic
if (isMobileDevice()) {
  showMobileAlert();
}

// -------------------------------------------------------------

// Main fuctions to render the app

import mainTreemap from "./scripts/treemap";
mainTreemap()

import mainTicker from "./scripts/ticker_tape";
mainTicker()

import updateTime from "./scripts/time";
updateTime()

// Update the time every second
setInterval(updateTime, 1000);

import updateTitle from "./scripts/title";
updateTitle()

// import mainSearch from "./scripts/searchbar";
// document.getElementById("search").addEventListener("click", function (event) {
//     mainSearch(event);
// });

import startSearch from "./scripts/searchbar";
startSearch()
