export default async function updateTime() {

    // Market holidays - this is how they are formated in the response from the public api
    let marketHolidays = ["New Year's Day", "Martin Luther King, Jr. Day", "Washington's Birthday", "Good Friday", "Memorial Day", "Juneteenth", "Independence Day", "Labor Day", "Thanksgiving Day", "Christmas Day"];

    // clock options
    let options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/New_York',
    };

    // Fetch current NYC time from the World Time API
    let timeResponse = await fetch('https://worldtimeapi.org/api/timezone/America/New_York');
    let currentTime = await timeResponse.json();
    let dt = new Date(currentTime.datetime);

    // create a new date string
    let dateTimeString = dt.toLocaleString('en-US', options);
    dateTimeString = dateTimeString.replace(/([A-Z]+) Standard Time$/, '$1');

    // Date string and year used for api fetch and check if it is a market holiday.
    let dtString = dt.toISOString().split('T')[0];  // Outputs "2023-04-07" format
    let year = dt.getFullYear().toString(); // get current year as string

    // Fetch public holidays for the current year
    let holidaysResponse = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/US`);
    let holidays = await holidaysResponse.json();

    // Check if the current day is a market holiday
    let isMarketHoliday = holidays.some(holiday => marketHolidays.includes(holiday.name) && holiday.date === dtString);

    // Calculate time left until the market opens or closes. Markets use EST or NYC time
    let openTime = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), 13, 30, 0)); // Market opens at 9:30 AM EST (which is 1:30 PM UTC)
    let closeTime = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), 20, 0, 0)); // Market closes at 4:00 PM EST (which is 8:00 PM UTC)
    let timeDiff = openTime - dt;
    let timeLeft = '';

    // sets the open or close message
    if (isMarketHoliday) {
        timeLeft = 'Market is closed';
    }
    else if (timeDiff > 0) { // Market is not open yet
        timeLeft = Math.floor(timeDiff / 1000 / 60 / 60) + ' hr ' + Math.floor((timeDiff / 1000 / 60) % 60) + ' min until open';
    } else if (dt < closeTime) { // Market is open
        timeDiff = closeTime - dt;
        timeLeft = Math.floor(timeDiff / 1000 / 60 / 60) + ' hr ' + Math.floor((timeDiff / 1000 / 60) % 60) + ' min until close';
    } else { // Market is closed
        timeLeft = 'Market is closed';
    }

    // sets the color to green on open and red on closed. Using NYC time
    let nyTime = new Date(currentTime.datetime).toLocaleString("en-US", { timeZone: "America/New_York" });
    let nyHour = new Date(nyTime).getHours();

    if (!isMarketHoliday && nyHour >= 9 && nyHour < 16) {
        // Market is open - set text color to green
        dateTimeString += ' EST  |  ' + timeLeft;
        document.getElementById("datetime").style.color = "green";
    } else {
        // Market is closed - set text color to red
        dateTimeString += ' EST  |  ' + timeLeft;
        document.getElementById("datetime").style.color = "red";
    }

    document.getElementById("datetime").innerHTML = dateTimeString;
}
