<h1 id="title" style="color: white; font-size: 65px; font-family: 'Roboto Slab', serif; margin-left: 15px; font-weight: 100;">
    <a href="https://www.traderradar.net/" style="text-decoration: none; color: inherit;">Trader Radar</a>
</h1>

 <!-- ![Home Page](./assets/trader_radar_home.JPG) -->

# Background

Trader Radar is a visual and interactive representation of how various stocks or financial instruments are performing in the market. It combines a stock heat map, a stock search function, a candlestick chart, live market clock, and stock ticker tape to provide valuable insights and aid in decision-making.

---------------------

## Technologies, Libraries, APIs

- **Vanilla JavaScript:** Trader Radar is a single page app.
- **HTML 5/CSS 3:** The markup and styling languages used to create the user interface of the heat map.
- **Charting libraries:** Used for creating the stock heat map and candle stick chart from [D3](https://d3js.org/)
    - [D3 Treemap](https://observablehq.com/@d3/treemap)
    - [D3 Candle Stick Chart](https://observablehq.com/@d3/candlestick-chart)
- **Financial data APIs:** data from [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs/)
    - [List of S&P 500 Companies](https://site.financialmodelingprep.com/developer/docs/list-of-sp-500-companies-api/)
    - [List of Dow Jones Companies](https://site.financialmodelingprep.com/developer/docs/list-of-nasdaq-companies-api/)
    - [List of NASDAQ Companies](https://site.financialmodelingprep.com/developer/docs/list-of-dow-companies-api/)
    - [Current Stock Data](https://site.financialmodelingprep.com/developer/docs/stock-api/)
    - [Companiy Stats](https://site.financialmodelingprep.com/developer/docs/companies-key-stats-free-api/)
    - [Stock News](https://site.financialmodelingprep.com/developer/docs/stock-news-api/)
    - [Historical Stock Data](https://site.financialmodelingprep.com/developer/docs/historical-stock-data-free-api/#Historical-Daily-Prices)
- **Public Holiday API**
    - [Nager](https://date.nager.at/Api)
- **Google Fonts**
- **Font Awesome**
- **JavaScript Vanilla DOM API:** A popular JavaScript library that simplifies DOM manipulation and event handling.
- **Webpack and Babel:** To bundle and transpile the source JavaScript code.
- **NPM:** to manage project dependencies.
- **Bootstrap:** A front-end framework that provides a responsive grid system and UI components for building user interfaces.
- **Google Domains** For custom domain management
- **Hosting** Github Pages

---------------------

# Features




## Treemap

The heat map is designed using a treemap algorithm which was first introduced by [Ben Shneiderman](https://www.cs.umd.edu/hcil/treemap-history/), in the 1990s. The treemap is then generated using the [D3 Treemap](https://observablehq.com/@d3/treemap) charting library.

It allows users to filter and sort the data based market index, volume, average volumne, shares outstanding, and market cap, has a click to zoom which allows a drill down into the tiniest of cells, and a tooltip upon hovering for additional stock detail.

Each cell in the heat map is color-coded based on the stock's performance, with different shades of color representing different levels of performance, and the stocks grouped by industry.

![Heat Map](./assets/heatmap.JPG)

### Treemap Data Structure
The data for the treemap is built by combining two API calls from [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs/) and then custom structured with a root node, then child nodes of the stock industry, then those have child nodes with each stock, and then those have child nodes with the stock information.

```mathematica
Root (Stock Index Data)
└── Stock Industry 1
    └── Stock 1.1
        └── Stock Information 1.1.1
        └── Stock Information 1.1.2
    └── Stock 1.2
        └── Stock Information 1.2.1
        └── Stock Information 1.2.2
└── Stock Industry 2
    └── Stock 2.1
        └── Stock Information 2.1.1
        └── Stock Information 2.1.2
    └── Stock 2.2
        └── Stock Information 2.2.1
        └── Stock Information 2.2.2
└── Stock Industry 3
    └── Stock 3.1
        └── Stock Information 3.1.1
        └── Stock Information 3.1.2
    └── Stock 3.2
        └── Stock Information 3.2.1
        └── Stock Information 3.2.2
```

## Candle Stick Chart

The chart shows the daily low, high, open, and close of a stock. Each “candle” represents a single trading day. A specialized x-axis is used to avoid gaps on the weekend when the markets are closed. The candlestick chart is generated using the [D3 Candle Stick Chart](https://observablehq.com/@d3/candlestick-chart) charting library.


![Candle Stick Chart](./assets/candle.jpg)

## Stock Search

## Ticker Tape

## Market Clock


## Wiki



---------------------
***© Trader Radar***
