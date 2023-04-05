export default async function updateTitle() {

    const indexSelector = document.getElementById("index");
    const sizeSelector = document.getElementById("size-by");
    const titleElement = document.getElementById('description');

    const defaultIndexValue = "sp500";
    const defaultSizeValue = "marketCap";

    indexSelector.value = defaultIndexValue;
    sizeSelector.value = defaultSizeValue;

    // this is for the select index dropdown
    function updateTitleFromIndex() {
        const indexValue = indexSelector.value;
        const sizeValue = sizeSelector.value;
        return indexValue === "sp500" && sizeValue === "marketCap" ? titleElement.innerText = "S&P 500 index stocks categorized by industries. Size represents market cap." :
            indexValue === "sp500" && sizeValue === "volume" ? titleElement.innerText = "S&P 500 index stocks categorized by industries. Size represents volume." :
                indexValue === "sp500" && sizeValue === "avgVolume" ? titleElement.innerText = "S&P 500 index stocks categorized by industries. Size represents average volume." :
                    indexValue === "sp500" && sizeValue === "sharesOutstanding" ? titleElement.innerText = "S&P 500 index stocks categorized by industries. Size represents shares outstanding." :
                        indexValue === "dowjones" && sizeValue === "marketCap" ? titleElement.innerText = "Dow Jones index stocks categorized by industries. Size represents market cap." :
                            indexValue === "dowjones" && sizeValue === "volume" ? titleElement.innerText = "Dow Jones index stocks categorized by industries. Size represents volume." :
                                indexValue === "dowjones" && sizeValue === "avgVolume" ? titleElement.innerText = "Dow Jones index stocks categorized by industries. Size represents average volume." :
                                    indexValue === "dowjones" && sizeValue === "sharesOutstanding" ? titleElement.innerText = "Dow Jones index stocks categorized by industries. Size represents shares outstanding." :
                                        indexValue === "nasdaq" && sizeValue === "marketCap" ? titleElement.innerText = "NASDAQ index stocks categorized by industries. Size represents market cap." :
                                            indexValue === "nasdaq" && sizeValue === "volume" ? titleElement.innerText = "NASDAQ index stocks categorized by industries. Size represents volume." :
                                                indexValue === "nasdaq" && sizeValue === "avgVolume" ? titleElement.innerText = "NASDAQ index stocks categorized by industries. Size represents average volume." :
                                                    indexValue === "nasdaq" && sizeValue === "sharesOutstanding" ? titleElement.innerText = "NASDAQ index stocks categorized by industries. Size represents shares outstanding." : titleElement.innerText = `${indexValue} index stocks categorized by industries. Size represents ${sizeValue}.`;
    }

    // this is for the select size-by dropdown
    function updateTitleFromSize() {
        const sizeValue = sizeSelector.value;
        const indexValue = indexSelector.value;
        return indexValue === "sp500" && sizeValue === "marketCap" ? titleElement.innerText = "S&P 500 index stocks categorized by industries. Size represents market cap." :
            indexValue === "sp500" && sizeValue === "volume" ? titleElement.innerText = "S&P 500 index stocks categorized by industries. Size represents volume." :
                indexValue === "sp500" && sizeValue === "avgVolume" ? titleElement.innerText = "S&P 500 index stocks categorized by industries. Size represents average volume." :
                    indexValue === "sp500" && sizeValue === "sharesOutstanding" ? titleElement.innerText = "S&P 500 index stocks categorized by industries. Size represents shares outstanding." :
                        indexValue === "dowjones" && sizeValue === "marketCap" ? titleElement.innerText = "Dow Jones index stocks categorized by industries. Size represents market cap." :
                            indexValue === "dowjones" && sizeValue === "volume" ? titleElement.innerText = "Dow Jones index stocks categorized by industries. Size represents volume." :
                                indexValue === "dowjones" && sizeValue === "avgVolume" ? titleElement.innerText = "Dow Jones index stocks categorized by industries. Size represents average volume." :
                                    indexValue === "dowjones" && sizeValue === "sharesOutstanding" ? titleElement.innerText = "Dow Jones index stocks categorized by industries. Size represents shares outstanding." :
                                        indexValue === "nasdaq" && sizeValue === "marketCap" ? titleElement.innerText = "NASDAQ index stocks categorized by industries. Size represents market cap." :
                                            indexValue === "nasdaq" && sizeValue === "volume" ? titleElement.innerText = "NASDAQ index stocks categorized by industries. Size represents volume." :
                                                indexValue === "nasdaq" && sizeValue === "avgVolume" ? titleElement.innerText = "NASDAQ index stocks categorized by industries. Size represents average volume." :
                                                    indexValue === "nasdaq" && sizeValue === "sharesOutstanding" ? titleElement.innerText = "NASDAQ index stocks categorized by industries. Size represents shares outstanding." : titleElement.innerText = `${indexValue} index stocks categorized by industries. Size represents ${sizeValue}.`;

    }

    // call the event listener functions to set the default title text
    updateTitleFromIndex();
    updateTitleFromSize();

    indexSelector.addEventListener("change", updateTitleFromIndex);
    sizeSelector.addEventListener("change", updateTitleFromSize);
}
