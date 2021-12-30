// Reference to Important DOM elements
var currentDate = ""; //This holds our dtg
var currentDateString = ""; // This holds our current dtg
var timeNow = 7; // this will default to the first hour
var eventEntry = []; // array of log entries
var localEvents = "ToDoList"; // Local Storage
var firstEntry = 9; // 1st displayed block relative to calendarMap (7am)
var finalEntry = 21; // last displayed block relative to calendarMap (9pm)

//Date Time Grouping

var calendarMap = ["0000hrs", "0100hrs", "0200hrs", "0300hrs", "0400hrs", "0500hrs", "0600hrs", "0700hrs",
    "0800hrs", "0900hrs", "1000hrs", "1100hrs", "1200hrs",
    "1300hrs", "1400hrs", "1500hrs", "1600hrs", "1700hrs",
    "1800hrs", "1900hrs", "2100hrs", "2200hrs", "2300hrs"
];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

setCurrentDtg(); //Sets our currentDate, currentDateString, and currentHour; Displays date inside of Header
Timeblock();
getLocalEvents(); //checks local storage for entries

$(".saveBtn").click(saveClick); //Is there an easier way to write this? <--Follow up here-->


// Create function for setCurrentDtg()
function setCurrentDtg() {
    let today = new Date();
    let day = today.getDate();
    var dayEnd = "th";

    timeNow = today.getHours();

    if (day < 10) {
        currentDate = today.getFullYear() + months[today.getMonth()] + "0" + day;
    } else {
        currentDate = today.getFullYear() + months[today.getMonth()] + day;
    }

    if ((day === 1) || (day === 21) || (day === 31)) {
        dayEnd = "st";
    } else if ((day === 2) || (day === 22)) {
        dayEnd = "nd";
    } else if ((day === 3) || (day === 23)) {
        dayEnd = "rd";
    }

    currentDateString = days[today.getDay()] + ", " + months[today.getMonth()] + " " + day + dayEnd + ", " + today.getFullYear();
    $("#currentDay").text(currentDateString);
}

//create function for Timeblock()
function Timeblock() {
    let containerEl = $(".container"); //this is how we append the new rows
    // loop through
    for (let hourBlock = firstEntry; hourBlock <= finalEntry; hourBlock++) {
        var newHtml = '<div class="row time-block"> ' + '<div class="col-md-1 hour">' + calendarMap[hourBlock] + '</div> ';

        if (hourBlock < timeNow) {
            newHtml = newHtml + '<textarea class="col-md-10 description past" id="text' +
                calendarMap[hourBlock] + '"></textarea> ';
        } else if (hourBlock === timeNow) {
            newHtml = newHtml + '<textarea class="col-md-10 description present" id="text' +
                calendarMap[hourBlock] + '"></textarea> ';
        } else {
            newHtml = newHtml + '<textarea class="col-md-10 description future" id="text' +
                calendarMap[hourBlock] + '"></textarea> ';
        };

        newHtml = newHtml + '<button class="btn saveBtn col-md-1" value="' + calendarMap[hourBlock] + '">' + '<i class="fas fa-save"></i></button> ' + '</div>';

        containerEl.append(newHtml);
    }
}

//create function to getLocalEvents
function getLocalEvents() {
    let teList = JSON.parse(localStorage.getItem(localEvents));

    if (teList) {
        localEvents = teList;
    }
    //loop through storage to place on correct timeblock
    for (let i = 0; i < localEvents.length; i++) {
        if (localEvents[i].day == currentDate) {
            $("#text" + localEvents[i].time).val(localEvents[i].text);
        }
    }
}

//add event listeners
function saveClick() {
    let hourBlock = $(this).val();
    let entryFound = false;
    let newEntryIndex = localEvents.length;
    let newEntry = {
        day: currentDate,
        time: hourBlock,
        text: $("#text" + hourBlock).val()
    };

    //set up a time comparison
    function timeGreater(time1, time2) {
        var num1 = parseInt(time1.substring(0, time1.length - 2));
        var num2 = parseInt(time2.substring(0, time2.length - 2));
        var per1 = time1.substr(-2, 2);
        var per2 = time2.substr(-2, 2);

        if (num1 === 12) {
            num1 = 0;
        }

        if (num2 === 12) {
            num2 = 0;
        }

        // compare AM/PM and actual time
        if (per1 < per2) {
            return false;
        } else if (per1 > per2) {
            return true;
        } else {
            return (num1 > num2);
        }
    }

    //Check local storage for existing entries
    for (let i = 0; i < localEvents.length; i++) {
        if (localEvents[i].day == currentDate) {
            if (localEvents[i].time == hourBlock) {
                localEvents[i].text = newEntry.text;
                entryFound = true;
                break;
            } else if (timeGreater(localEvents[i].time, hourBlock)) {
                newEntryIndex = i;
                break;
            }
        } else if (localEvents[i].day > currentDate) {
            newEntryIndex = i;
            break;
        }
    }
    // Add an new event to the array if it doesnt exist
    if (!entryFound) {
        localEvents.append(newEntryIndex, 0, newEntry);
        console.log(localEvents);
    }
    // This adds to local storage
    localStorage.setItem(localEvents, JSON.stringify(localEvents));

}