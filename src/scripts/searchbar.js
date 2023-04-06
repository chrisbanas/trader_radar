const apiKey = "8660568d82eaea759bb0ec8e463033d2";
const form = document.querySelector('form');
const input = document.querySelector('#input');
const clearButton = document.querySelector('#clear-button');
const searchButton = document.getElementById("search");

// ------------------------------------------------------------------------------------------------------

// Pull the company profile data
async function performSearch(searchTerm) {

    const apiUrl = `https://financialmodelingprep.com/api/v3/profile/${searchTerm}?apikey=${apiKey}`;

    return await fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const searchResults = JSON.stringify(data);
            const searchResultsObj = JSON.parse(searchResults);
            return searchResultsObj;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}

// Pull the company news data
async function getStockNews(tickers) {
    const apiUrl = `https://financialmodelingprep.com/api/v3/stock_news?tickers=${tickers}&apikey=${apiKey}`;
    return await fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const searchResults = JSON.stringify(data);
            const searchResultsObj = JSON.parse(searchResults);
            return searchResultsObj;
        })
        .catch(error => {
            console.error(error);
            return error;
        });;
}

// get historical price for chart. Timeseries is for how many days we want to return
async function getHistoricalPrice(tickers) {
    const apiUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${tickers}?timeseries=180&apikey=${apiKey}`;
    return await fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const searchResults = JSON.stringify(data);
            const searchResultsObj = JSON.parse(searchResults);
            return searchResultsObj;
        })
        .catch(error => {
            console.error(error);
            return error;
        });;
}

// ------------------------------------------------------------------------------------------------------


// Add a click event listener to the clear button
clearButton.addEventListener('click', function () {
    input.value = ''; // Clear the input value
    // clear out the search
    document.getElementById("search-results").style.display = "none";
    document.getElementById("candle-chart").style.display = "none";
    // redisplay the treemap
    document.getElementById("filters").style.display = "flex";
    document.getElementById("description").style.display = "flex";
    document.getElementById("treemapcanvas").style.display = "flex";
});


export default async function startSearch() {

    searchButton.addEventListener("click", function (searchHit) {
        searchHit.preventDefault();
        if (input.value.length <= 0 || input.value.length > 5) {
            alert('Please enter a correct stock ticker');
            return;
        } else {
            mainSearch(searchHit);
        }
    });

}

async function mainSearch(searchHit) {
    searchHit.preventDefault(); // this is needed to prevent unwanted search

    // get search query
    const searchQuery = document.getElementById("input").value;

    // perform search and get company data
    const companyData = await performSearch(searchQuery);



    // perform search and get news data
    const news = await getStockNews(searchQuery);
    const limitedNews = news.slice(0, 5);


    // fetch chart data check to see if there is already a chart if so clear then redisplay
    const chartElement = document.getElementById("candle-chart")
    const historicalPrice = await getHistoricalPrice(searchQuery);


    if (companyData.length === 0) {
        document.getElementById("candle-chart").style.display = "none";
        // searchCompanyDataContainer.innerHTML = "<p class='no-results'>No results found.</p>";
    }

    if (chartElement) {
        chartElement.remove();
    }

    drawCandlestickChart(historicalPrice.historical)

    // clear out other elements on page
    document.getElementById("filters").style.display = "none";
    document.getElementById("description").style.display = "none";
    document.getElementById("treemapcanvas").style.display = "none";

    // redisplay search
    document.getElementById("search-results").style.display = "flex";

    // update search company data container with search results
    const searchCompanyDataContainer = document.getElementById("search-results");
    searchCompanyDataContainer.innerHTML = "";

    // display company data
    const companyDataList = document.createElement("ul");

    companyDataList.classList.add("results-list");

    // Inside the news
    const listItem = document.createElement("li");

    listItem.classList.add("result-item");


    // create logo and name element and style the div container
    const logoAndName = document.createElement("div");
    logoAndName.style.display = "flex";
    logoAndName.style.alignItems = "center";
    logoAndName.style.justifyContent = "center";
    logoAndName.style.padding = "20px";

    // stule the company image
    const logo = document.createElement("img");
    logo.style.marginRight = "30px"

    // style the company name
    const name = document.createElement("a");
    name.style.fontSize = "20px";
    name.style.fontFamily = "'Roboto Slab', serif";
    name.style.fontWeight = "bold"
    name.style.marginRight = "2px";



    // adding and appending html elements around the page for company profile
    logoAndName.classList.add("logo-and-name");
    logo.src = companyData[0].image;
    logo.classList.add("logo");
    name.href = companyData[0].website;
    name.textContent = companyData[0].companyName;
    name.classList.add("name");
    name.style.textDecoration = "none";
    name.style.color = "#000000";
    logoAndName.appendChild(logo);
    logoAndName.appendChild(name);
    listItem.appendChild(logoAndName);

    name.addEventListener("mouseover", () => {
        name.style.textDecoration = "underline";
    });
    name.addEventListener("mouseout", () => {
        name.style.textDecoration = "none";
    });


    // create price and style
    const price = document.createElement("div");

    // get the price change from yesterday
    const priceChange = companyData[0].price - historicalPrice.historical[0].open;

    // adding and appending the price html elements on the page
    price.textContent = "$" + companyData[0].price;
    price.classList.add("price");


    // add the up or down class based on price change
    if (priceChange < 0) {
        price.style.color = "red";
    } else if (priceChange >= 0) {
        price.style.color = "green"
    }

    listItem.appendChild(price);
    companyDataList.appendChild(listItem);




    // add news and style
    const newsList = document.createElement("ul");
    newsList.style.fontFamily = "'Roboto Slab', serif";
    newsList.style.fontWeight = "bold"
    newsList.style.display = "flex";
    newsList.style.alignItems = "center";
    newsList.style.justifyContent = "space-around";
    newsList.style.fontSize = "15px";
    newsList.style.padding = "20px";
    newsList.style.paddingRight = "30px";
    newsList.style.paddingLeft = "30px"


    // how the news list items are mapped and added to the HTML of the page
    newsList.classList.add("news-list");

    for (const article of limitedNews) {
        const newsItem = document.createElement("li");
        newsItem.classList.add("news-item");

        const title = document.createElement("a");
        title.href = article.url;
        title.textContent = article.title;
        title.classList.add("news-title");
        title.style.fontSize = '20px';
        title.style.color = "black";
        title.style.fontWeight = "bold";
        title.style.textDecoration = "none";
        // Add underline on hover
        title.style.transition = "text-decoration 0.3s";
        title.addEventListener("mouseover", () => {
            title.style.textDecoration = "underline";
        });
        title.addEventListener("mouseout", () => {
            title.style.textDecoration = "none";
        });

        const summary = document.createElement("p");
        summary.textContent = article.text;
        summary.classList.add("news-summary");
        summary.style.fontSize = '13px';


        const date = document.createElement("p");
        date.textContent = article.publishedDate.slice(0, 10);
        date.classList.add("news-date");

        newsItem.appendChild(title);
        newsItem.appendChild(summary);
        newsItem.appendChild(date);

        newsList.appendChild(newsItem);


        // news item styles
        // title.classList.style.marginBottom = "10px"
        // newsList.style.marginRight = "10px"

    }

    listItem.appendChild(newsList);
    companyDataList.appendChild(listItem);


    searchCompanyDataContainer.appendChild(companyDataList);

}

// ------------------------------------------------------------------------------------------------------

// draw the chart
function drawCandlestickChart(data) {
    // set the dimensions and margins of the graph
    const margin = { top: 65, right: 20, bottom: 90, left: 100 };
    const width = 1500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // set the ranges
    const x = d3.scaleBand().range([0, width]).padding(0.2);
    const y = d3.scaleLinear().range([height, 0]);

    // create the svg element
    const svg = d3
        .select("body")
        .append("svg")
        .attr("id", "candle-chart") // Add the id attribute
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "#f5f5f5")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add horizontal gridlines
    svg
        .append("g")
        .attr("class", "grid")
        .call(
            d3
                .axisLeft(y)
                .tickSize(-width)
                .tickFormat("")
        );

    // add vertical gridlines
    svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3
                .axisBottom(x)
                .tickSize(-height)
                .tickFormat("")
        );

    // format the data
    data.forEach(function (stock) {
        stock.date = `${new Date(stock.date).getMonth() + 1}/${new Date(stock.date).getDate()}`;
        stock.open = +stock.open;
        stock.high = +stock.high;
        stock.low = +stock.low;
        stock.close = +stock.close;
    });

    // reverse the order of the data array so it charts oldest on x0 and newest on x1
    data.reverse();

    // set the domains
    x.domain(
        data.map(function (stock) {
            return stock.date;
        })
    );
    y.domain([
        d3.min(data, function (stock) {
            return stock.low;
        }),
        d3.max(data, function (stock) {
            return stock.high;
        }),
    ]);

    // draw the custom x axis with labels for every 30 days
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3
                .axisBottom(x)
                .tickValues(
                    x.domain().filter(function (date, day) {
                        return day % 30 === 0;
                    })
                )
        )
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -9)
        .attr("y", 0)
        .style("text-anchor", "end");

    // draw the x-axis label
    svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom / 2)
        .style("text-anchor", "middle")
        .text("Date");

    // draw the y axis
    svg.append("g").call(d3.axisLeft(y));

    // draw the y-axis label
    svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left / 2)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Price");

    // draw the candlesticks
    svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (stock) {
            return x(stock.date);
        })
        .attr("y", function (stock) {
            return y(Math.max(stock.open, stock.close));
        })
        .attr("width", x.bandwidth())
        .attr("height", function (stock) {
            return y(Math.min(stock.open, stock.close)) - y(Math.max(stock.open, stock.close));
        })
        .attr("fill", function (stock) {
            return stock.open > stock.close ? "red" : "green";
        });


    // add chart title
    svg
        .append("text")
        .attr("class", "chart-subtitle")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2 + 25)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Day Stock Prices");


}
