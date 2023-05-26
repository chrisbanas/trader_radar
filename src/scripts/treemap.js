const apiKey = "8660568d82eaea759bb0ec8e463033d2";
let canvas = d3.select('#treemapcanvas');


// here is the main entry function
export default async function mainTreemap() {
  const indexSelector = document.getElementById("index");
  const sizeSelector = document.getElementById("size-by");

  const defaultIndexValue = "sp500";
  const defaultSizeValue = "marketCap";

  indexSelector.value = defaultIndexValue;
  sizeSelector.value = defaultSizeValue;

  const stockDataArray = await fetchStockData(defaultIndexValue);
  const root = getStockTreeMapRoot(stockDataArray);

  drawTreeMap(root, defaultSizeValue);

  // this is for the select index dropdown
  indexSelector.addEventListener("change", async function () {
    const indexValue = indexSelector.value;
    const sizeValue = sizeSelector.value;
    const stockDataArray = await fetchStockData(indexValue);
    const root = getStockTreeMapRoot(stockDataArray);
    drawStockTreeMap(root, sizeValue);
  });

  // this is for the select size-by dropdown
  sizeSelector.addEventListener("change", async function () {
    const sizeValue = sizeSelector.value;
    const indexValue = indexSelector.value;
    const stockDataArray = await fetchStockData(indexValue);
    const root = getStockTreeMapRoot(stockDataArray);
    drawStockTreeMap(root, sizeValue);
  });
}


// function to fetch stock data
async function fetchStockData(indexValue) {
  const indexData = await fetch(`https://financialmodelingprep.com/api/v3/${indexValue}_constituent?apikey=${apiKey}`)
    .then(response => response.json());
  const symbols = indexData.map(stock => stock.symbol).join(',');
  const quotesData = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${apiKey}`)
    .then(response => response.json());
  const stockDataMap = {};
  indexData.forEach(stock => {
    stockDataMap[stock.symbol] = {
      name: stock.symbol,
      sector: stock.sector,
      fullName: stock.name,
      subSector: stock.subSector,
      marketCap: quotesData.find(quote => quote.symbol === stock.symbol).marketCap,
      changesPercentage: quotesData.find(quote => quote.symbol === stock.symbol).changesPercentage,
      volume: quotesData.find(quote => quote.symbol === stock.symbol).volume,
      avgVolume: quotesData.find(quote => quote.symbol === stock.symbol).avgVolume,
      sharesOutstanding: quotesData.find(quote => quote.symbol === stock.symbol).sharesOutstanding,
      price: quotesData.find(quote => quote.symbol === stock.symbol).price,
      changeValue: quotesData.find(quote => quote.symbol === stock.symbol).change,
      dayLow: quotesData.find(quote => quote.symbol === stock.symbol).dayLow,
      dayHigh: quotesData.find(quote => quote.symbol === stock.symbol).dayHigh,
      yearHigh: quotesData.find(quote => quote.symbol === stock.symbol).yearHigh,
      yearLow: quotesData.find(quote => quote.symbol === stock.symbol).yearLow,
      priceAvg50: quotesData.find(quote => quote.symbol === stock.symbol).priceAvg50,
      priceAvg200: quotesData.find(quote => quote.symbol === stock.symbol).priceAvg200,
      open: quotesData.find(quote => quote.symbol === stock.symbol).open,
      previousClose: quotesData.find(quote => quote.symbol === stock.symbol).previousClose,
      eps: quotesData.find(quote => quote.symbol === stock.symbol).eps,
      pe: quotesData.find(quote => quote.symbol === stock.symbol).pe
    };
  });
  return Object.values(stockDataMap);
}

// function to get stock root for treemap
function getStockTreeMapRoot(stockDataArray) {
  const root = {
    name: "stock",
    children: []
  };
  const sectors = {};
  stockDataArray.forEach(stock => {
    const sector = stock.sector;
    if (!sectors[sector]) {
      sectors[sector] = {
        name: sector,
        children: []
      };
    }
    sectors[sector].children.push(stock);
  });
  Object.values(sectors).forEach(sector => {
    root.children.push(sector);
  });
  return root;
}

// function to draw the trees
function drawStockTreeMap(root, defaultSizeValue) {
  d3.selectAll('g').remove();
  drawTreeMap(root, defaultSizeValue);
}






// ↑ this is the data api pull and format for the draw treemap
//-------------------------------------------------------------------------------------------------------------
// ↓ this is the draw treemap which creates the treemap for display








//function to draw the treemap
let drawTreeMap = (stockData, size) => {

  // sorts the hierarchy so that the largest marketcap stocks are at the top
  let hierarchy = d3.hierarchy(stockData, (node) => {
    return node['children'];
  }).sum((node) => {
    return node[size];
  }).sort((node1, node2) => {
    return node2['value'] - node1['value']; // this has to be set to value and not marketCap as the hierarcy fucntion is renaming it value
  });
  // .size is the size of our canvas in the scss file
  let generateTreeMap = d3.treemap()
    .tile(d3.treemapBinary)
    .size([canvas.node().clientWidth, canvas.node().clientHeight])
    .paddingOuter(7)
    .paddingTop(43)
    .paddingInner(2)
    .round(true);

  // this uses d3 to generate the treemap
  generateTreeMap(hierarchy);

  let stockTiles = hierarchy.leaves();

  // create a new div for the details when mouse over
  let detailsDiv = d3.select('body')
    .append('div')
    .attr('class', 'details')
    .style('display', 'none');

  // creates g elements inside the canvas. g elements are group tags. and sets the size of the element to an x and y axias. Click and mouseover events are defined here
  let block = canvas.selectAll('g')
    .data(stockTiles)
    .enter()
    .append('g')
    .attr('transform', (stock) => {
      return 'translate(' + stock['x0'] + ', ' + stock['y0'] + ')'
    })
    .each(function (stock) {
      // Save the original transform of the group element. Used in the popup
      d3.select(this).attr('data-original-transform', d3.select(this).attr('transform'));
      d3.select(this).attr('data-name', stock['data']['name']);
      d3.select(this).attr('data-fullName', stock['data']['fullName']);
      d3.select(this).attr('data-marketCap', stock['data']['marketCap'].toLocaleString('en-US'));
      d3.select(this).attr('data-price', stock['data']['price'].toFixed(2));
      d3.select(this).attr('data-changeValue', stock['data']['changeValue'].toFixed(2));
      d3.select(this).attr('data-changesPercentage', stock['data']['changesPercentage'].toFixed(2));
      d3.select(this).attr('data-dayLow', stock['data']['dayLow'].toFixed(2));
      d3.select(this).attr('data-dayHigh', stock['data']['dayHigh'].toFixed(2));
      d3.select(this).attr('data-yearHigh', stock['data']['yearHigh'].toFixed(2));
      d3.select(this).attr('data-yearLow', stock['data']['yearLow'].toFixed(2));
      d3.select(this).attr('data-priceAvg50', stock['data']['priceAvg50'].toFixed(2));
      d3.select(this).attr('data-priceAvg200', stock['data']['priceAvg200'].toFixed(2));
      d3.select(this).attr('data-open', stock['data']['open'].toFixed(2));
      d3.select(this).attr('data-previousClose', stock['data']['previousClose'].toFixed(2));
      d3.select(this).attr('data-eps', stock['data']['eps'].toFixed(2));
      d3.select(this).attr('data-pe', stock['data']['pe'].toFixed(2));
      d3.select(this).attr('data-x0', stock['x0'] + 27); // use this to set the postion of the popup
      d3.select(this).attr('data-y0', stock['y0'] + 20); // use this to set the postion of the popup
      d3.select(this).attr('data-x0', stock['x1'] + 40); // use this to set the postion of the popup
      d3.select(this).attr('data-y0', stock['y1']); // use this to set the postion of the popup

      // Calculate the scaling factor based on the area of the tile. This is used in the click/zoom
      let area = (stock['x1'] - stock['x0']) * (stock['y1'] - stock['y0']);
      let scale = Math.sqrt(160000 / area);
      d3.select(this).attr('data-scale', scale);
    })
    // hover over function that displays stock info
    .on('mouseover', function (stock) {
      detailsDiv.html(
        `<strong>${d3.select(this).attr('data-fullName')}</strong>
        <br>
        <br>
        Ticker: ${d3.select(this).attr('data-name')}
        <br>
        Market Cap: ${d3.select(this).attr('data-marketCap')}
        <br>
        Price: ${d3.select(this).attr('data-price')}
        <br>
        Change: ${d3.select(this).attr('data-changeValue')}
        <br>
        Change %: ${d3.select(this).attr('data-changesPercentage')}%
        <br>
        Low: ${d3.select(this).attr('data-dayLow')}
        <br>
        High: ${d3.select(this).attr('data-dayHigh')}
        <br>
        Open: ${d3.select(this).attr('data-open')}
        <br>
        Previous Close: ${d3.select(this).attr('data-previousClose')}
        <br>
        Yr High: ${d3.select(this).attr('data-yearHigh')}
        <br>
        Yr Low: ${d3.select(this).attr('data-yearLow')}
        <br>
        50 Day Avg: ${d3.select(this).attr('data-priceAvg50')}
        <br>
        200 Day Avg: ${d3.select(this).attr('data-priceAvg200')}
        <br>
        EPS: ${d3.select(this).attr('data-eps')}
        <br>
        PE: ${d3.select(this).attr('data-pe')}
        `
      );
      // This is where you can style the popup on mouseover
      detailsDiv.style('display', 'block')
        .style('padding', '10px')
        .style('background-color', '#E2FFFF')
        .style('border', '1px solid #ccc')
        .style('border-radius', '5px')
        .style("font-size", "16px")
        .style("font-family", "'Roboto Slab', serif")
        .style("font-weight", "bold")
        .style('box-shadow', '0px 0px 5px rgba(0, 0, 0, 0.1)')
        .style('left', d3.select(this).attr('data-x0') + 'px')
        .style('top', d3.select(this).attr('data-y0') + 'px');
    })
    .on('mouseout', function () {
      detailsDiv.style('display', 'none');
      d3.select(this).select('.hover-text').remove();
    })
    // click function that pulls a stock to the middle of the screen
    .on('click', function (stock) {
      let originalTransform = d3.select(this).attr('data-original-transform');

      let scale = d3.select(this).attr('data-scale');

      // Move the selected block to the end of the canvas (in terms of rendering order). This puts it in the absolute front.
      let node = d3.select(this).node();
      node.parentNode.appendChild(node);

      // If the tile has not been selected yet, color it and zoom in
      if (d3.select(this).classed('selected') === false) {
        // Color the selected tile
        d3.select(this)
          .select('rect')
          .transition()
          .duration(750)
          .style('fill', 'orange');

        // Scale the selected block by a factor based on the area of the tile
        d3.select(this)
          .each(function () {
            // Store the original fill color of the rect
            const rect = d3.select(this).select('rect');
            rect.attr('data-original-fill', rect.style('fill'));
          })
          .transition()
          .duration(750)
          .attr('transform', d3.zoomIdentity
            .translate(550, 350) // (x, y) on the whole canvas or screen
            .scale(scale));

        d3.select(this).classed('selected', true);
      }
      // If the tile has already been selected, un-color it and zoom out
      else {
        // Un-color the tile
        d3.select(this)
          .select('rect')
          .transition()
          .duration(750)
          .style('fill', function () {
            // Retrieve the original fill color of the rect
            return d3.select(this).attr('data-original-fill');
          });
        // Reset the tile to its original size and position
        d3.select(this)
          .transition()
          .duration(750)
          .attr('transform', originalTransform);

        d3.select(this).classed('selected', false);
      }
    });


  // all g elements now have a class called tile, and color has been set to each category. These will turn into market sectors
  block.append('rect')
    .attr('class', 'tile')
    // this is where we can set the fill color by daily percentage change
    .attr("fill", (stock) => {
      return stock['data']['changesPercentage'] < -3 ? '#f63538' :
        stock['data']['changesPercentage'] < -2 ? '#bf4045' :
          stock['data']['changesPercentage'] < -1 ? '#f77c80' :
            stock['data']['changesPercentage'] > -1 && stock['data']['changesPercentage'] < 0 ? '#f77c80' :
              stock['data']['changesPercentage'] < 1 ? '#42bd7f' :
                stock['data']['changesPercentage'] < 2 ? '#2f9e4f' :
                  stock['data']['changesPercentage'] < 3 ? '#35764e' :
                    '#35764e';
    }).attr("data-name", (stock) => {
      return stock['data']['name'];
    }).attr('data-sector', (stock) => {
      return stock['data']['sector'];
    }).attr(`data-${size}`, (stock) => {
      return stock["data"][size];
    }).attr('width', (stock) => {
      return stock['x1'] - stock['x0'];
    }).attr('height', (stock) => {
      return stock['y1'] - stock['y0'];
    });

  // this resets the text so that we can re-render the titles. This must be abover all block.append text or it will break
  canvas.selectAll("text").remove();



  // title feature for each sector
  canvas
    .selectAll("titles")
    .data(hierarchy.children)
    .enter()
    .append("text")
    .attr('class', 'title')
    .attr("x", (sector) => (sector.x0 + 7))
    .attr("y", (sector) => (sector.y0 + 30))
    .text(function (sector) { return sector.data.name })
    .attr("font-size", "19px")
    .style("fill", "white")

  // sets the stock ticker attributes for each tile
  block.append('text')
    .text((stock) => {
      return stock['data']['name'];
    })
    .attr('class', 'label')
    .attr('x', (stock) => (stock['x1'] - stock['x0']) / 3)
    .attr('y', (stock) => ((stock['y1'] - stock['y0']) / 2))
    .style('fill', 'white')
    .attr('font-size', (stock) => `${Math.min((stock['x1'] - stock['x0']) / 10, (stock['y1'] - stock['y0']) / 10)}px`);

  // sets the daily percentage change for each tile under the stock ticker. y is being offset so it dosen't layer on top of the stock ticker
  block.append('text')
    .text((stock) => {
      return `${stock['data']['changesPercentage'].toFixed(2)}%`;
    })
    .attr('class', 'label')
    .attr('x', (stock) => (stock['x1'] - stock['x0']) / 3)
    .attr('y', (stock) => (((stock['y1'] - stock['y0']) / 2) + ((stock['y1'] - stock['y0']) / 12.5)))
    .style('fill', 'white')
    .attr('font-size', (stock) => `${Math.min((stock['x1'] - stock['x0']) / 10, (stock['y1'] - stock['y0']) / 10)}px`);

  // sets the company logo for each stock tile. Can't get around 404 because this is not a fetch.
  // default image - currently this does not work
  const defaultImage = "https://neighborhoodnode-seed.s3.us-west-1.amazonaws.com/blank_logo.png";

  block.append('image')
    .attr('xlink:href', (stock) => `https://financialmodelingprep.com/image-stock/${stock['data']['name']}.png`)
    .on("error", function () {
      d3.select(this).attr("xlink:href", defaultImage);
    })
    .attr('class', 'label')
    .attr('x', (stock) => (stock['x1'] - stock['x0']) / 3)
    .attr('y', (stock) => (((stock['y1'] - stock['y0']) / 2) + ((stock['y1'] - stock['y0']) / 12.5)))
    .attr('width', (stock) => (stock['x1'] - stock['x0']) / 3)
    .attr('height', (stock) => (stock['y1'] - stock['y0']) / 3);

  //Instructions title
  canvas.append("text")
    .attr('class', 'instructions-title')
    .attr("x", 850)
    .attr("y", 30)
    .text("Hover over a tile to see detailed information and click on a tile to zoom in")
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-family", "'Roboto Slab', serif")

}
