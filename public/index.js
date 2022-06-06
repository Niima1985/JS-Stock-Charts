// create a function that convert a stock symbol into a color and use this color into dataset objects
function getColor(stock) {
    if(stock === "GME"){
        return  'rgba(153, 102, 255, 1)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return  'rgba(75, 192, 192, 1)'
    }
}

async function main() {
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');


    // write a fetch request based on twelvedata documentation and pass four stock symbols GME, MSFT, DIS, and BNTX. and use the api key 
    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=9f80c22699eb417393e0c9b31ff25eb3`)
    const mockData = await response.json();
    //console.log(result);

    
    // using destructuring syntax can turn the object into an array and set it into a new variable declaration 

    const { GME, MSFT, DIS, BNTX } = mockData;
    const stocks = [GME, MSFT, DIS, BNTX];
    

    stocks.forEach(stock => stock.values.reverse())

    // Time Chart
    //
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),// using map we can collect an array of the properties(.datetime) in each value object
            // .map to turn an array of stock objects (getting from API) into an array of dataset objects (create by using Canvas.JS)
            datasets: stocks.map(stock => ({
                label: stock.meta.symbol, // meta.symbol represents each line of one stock
                data: stock.values.map(value => parseFloat(value.high)),// using .map over an array of values(value.high) and convert it from a string into a number using parseFloat 
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });

    // High Chart
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol), 
            datasets: [{
                label: 'Highest',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    findHighest(stock.values)
                ))
            }]
        }
    });

    // Average Chart
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Average',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    calculateAverage(stock.values)
                ))
            }]
        }
    });

}
function findHighest(values) {
    let highest = 0;
    values.forEach(value => {
        if (parseFloat(value.high) > highest) {
            highest = value.high
        }
    })
    return highest
}

function calculateAverage(values) {
    let total = 0;
    values.forEach(value => {
        total += parseFloat(value.high)
    })
    return total / values.length
}

main()

