export default function updateTime() {
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

    let dt = new Date();
    let dateTimeString = dt.toLocaleString('en-US', options);
    dateTimeString = dateTimeString.replace(/([A-Z]+) Standard Time$/, '$1');

    // Calculate time left until the market opens or closes
    let openTime = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), 13, 30, 0)); // Market opens at 9:30 AM EST (which is 1:30 PM UTC)
    let closeTime = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), 20, 0, 0)); // Market closes at 4:00 PM EST (which is 8:00 PM UTC)
    let timeDiff = openTime - dt;
    let timeLeft = '';

    if (timeDiff > 0) { // Market is not open yet
        timeLeft = Math.floor(timeDiff / 1000 / 60 / 60) + ' hr ' + Math.floor((timeDiff / 1000 / 60) % 60) + ' min until open';
    } else if (dt < closeTime) { // Market is open
        timeDiff = closeTime - dt;
        timeLeft = Math.floor(timeDiff / 1000 / 60 / 60) + ' hr ' + Math.floor((timeDiff / 1000 / 60) % 60) + ' min until close';
    } else { // Market is closed
        timeLeft = 'Market is closed';
    }

    let nyTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    let nyHour = new Date(nyTime).getHours();

    if (nyHour >= 9 && nyHour < 16) {
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
