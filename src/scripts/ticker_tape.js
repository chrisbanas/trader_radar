const apiKey = "8660568d82eaea759bb0ec8e463033d2";

// here is the main entry function
export default async function mainTicker() {
    const indexSelector = document.getElementById("index");
    const defaultIndexValue = "sp500";
    indexSelector.value = defaultIndexValue;
    updateStockTicker(defaultIndexValue);

    indexSelector.addEventListener("change", async function () {
        const indexValue = indexSelector.value;
        updateStockTicker(indexValue);
    });
}

// function to fetch stock data
async function fetchStockData(indexValue) {
    const indexData = await fetch(`https://financialmodelingprep.com/api/v3/${indexValue}_constituent?apikey=${apiKey}`)
        .then(response => response.json());
    const symbols = indexData.map(stock => stock.symbol).join(',');
    const quotesData = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${apiKey}`)
        .then(response => response.json());

    // Combine the index and quotes data to get all the stocks and their current prices
    const stocksData = indexData.map(stock => {
        const quoteData = quotesData.find(quote => quote.symbol === stock.symbol);
        return {
            symbol: stock.symbol,
            changesPercentage: quoteData ? quoteData.changesPercentage : null,
            price: quoteData ? quoteData.price : null
        };
    });

    // Sort the array alphabetically by symbol
    stocksData.sort((a, b) => a.symbol.localeCompare(b.symbol));

    return stocksData;
}

// function to update the stock ticker
async function updateStockTicker(indexValue) {
    const stocksData = await fetchStockData(indexValue);
    const ticker = document.querySelector('#ticker');

    // Clear the ticker
    ticker.innerHTML = '';

    // Add a <p> element for each stock
    stocksData.forEach(stock => {
        const p = document.createElement('p');
        p.textContent = `${stock.symbol}: ${stock.price ? stock.price.toFixed(2) : 'N/A'}`; // display symbol and price with 2 decimal places

        // Set the color based on the change percentage
        if (stock.changesPercentage < 0) {
            p.classList.add('negative');
        } else if (stock.changesPercentage >= 0) {
            p.classList.add('positive');
        }

        ticker.appendChild(p);
    });

    // Scroll the ticker to the left
    setInterval(() => {
        const ticker = document.querySelector('#ticker');
        ticker.scrollLeft += 2; // adjust scroll
    }, 100); // adjust scroll interval
}
