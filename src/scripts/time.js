export default function updateTime() {

    // A list of all stock market holidays in the format 'Month Date for next 20 yrs'
    let marketHolidays = {
        '2023': ['Jan 2', 'Jan 16', 'Feb 20', 'May 29', 'Jul 4', 'Sep 4', 'Nov 23', 'Dec 25'],
        '2024': ['Jan 1', 'Jan 15', 'Feb 19', 'May 27', 'Jul 4', 'Sep 2', 'Nov 28', 'Dec 25'],
        '2025': ['Jan 1', 'Jan 20', 'Feb 17', 'May 26', 'Jul 4', 'Sep 1', 'Nov 27', 'Dec 25'],
        '2026': ['Jan 1', 'Jan 19', 'Feb 16', 'May 25', 'Jul 3', 'Sep 7', 'Nov 26', 'Dec 25'],
        '2027': ['Jan 1', 'Jan 18', 'Feb 15', 'May 31', 'Jul 5', 'Sep 6', 'Nov 25', 'Dec 24'],
        '2028': ['Jan 2', 'Jan 16', 'Feb 20', 'May 29', 'Jul 4', 'Sep 4', 'Nov 23', 'Dec 25'],
        '2029': ['Jan 1', 'Jan 15', 'Feb 19', 'May 28', 'Jul 4', 'Sep 3', 'Nov 22', 'Dec 25'],
        '2030': ['Jan 1', 'Jan 21', 'Feb 18', 'May 27', 'Jul 4', 'Sep 2', 'Nov 28', 'Dec 25'],
        '2031': ['Jan 1', 'Jan 20', 'Feb 17', 'May 26', 'Jul 4', 'Sep 1', 'Nov 27', 'Dec 25'],
        '2032': ['Jan 1', 'Jan 19', 'Feb 16', 'May 31', 'Jul 5', 'Sep 6', 'Nov 25', 'Dec 24'],
        '2033': ['Jan 1', 'Jan 17', 'Feb 21', 'May 30', 'Jul 4', 'Sep 5', 'Nov 24', 'Dec 26'],
        '2034': ['Jan 2', 'Jan 16', 'Feb 20', 'May 29', 'Jul 4', 'Sep 4', 'Nov 23', 'Dec 25'],
        '2035': ['Jan 1', 'Jan 15', 'Feb 19', 'May 28', 'Jul 4', 'Sep 3', 'Nov 22', 'Dec 25'],
        '2036': ['Jan 1', 'Jan 21', 'Feb 18', 'May 26', 'Jul 4', 'Sep 1', 'Nov 27', 'Dec 26'],
        '2037': ['Jan 1', 'Jan 19', 'Feb 16', 'May 25', 'Jul 3', 'Sep 7', 'Nov 26', 'Dec 25'],
        '2038': ['Jan 1', 'Jan 18', 'Feb 15', 'May 31', 'Jul 5', 'Sep 6', 'Nov 25', 'Dec 24'],
        '2039': ['Jan 2', 'Jan 16', 'Feb 20', 'May 29', 'Jul 4', 'Sep 4', 'Nov 23', 'Dec 25'],
        '2040': ['Jan 1', 'Jan 15', 'Feb 19', 'May 27', 'Jul 4', 'Sep 2', 'Nov 28', 'Dec 25'],
        '2041': ['Jan 1', 'Jan 20', 'Feb 17', 'May 26', 'Jul 4', 'Sep 1', 'Nov 27', 'Dec 25'],
        '2042': ['Jan 1', 'Jan 19', 'Feb 16', 'May 31', 'Jul 5', 'Sep 6', 'Nov 25', 'Dec 24'],
        '2043': ['Jan 1', 'Jan 18', 'Feb 15', 'May 30', 'Jul 4', 'Sep 5', 'Nov 24', 'Dec 26']
    };

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

    // create a new date string
    let dt = new Date();
    let dateTimeString = dt.toLocaleString('en-US', options);
    dateTimeString = dateTimeString.replace(/([A-Z]+) Standard Time$/, '$1');

    // Check if current day is a market holiday
    let dtString = dt.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    let year = dt.getFullYear().toString(); // get current year as string
    let isMarketHoliday = marketHolidays[year].includes(dtString);

    // Calculate time left until the market opens or closes
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


    // sets the color to green on open and red on closed
    let nyTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
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
