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

import mainSearch from "./scripts/searchbar";
document.getElementById("search").addEventListener("click", function (event) {
    mainSearch(event);
});
