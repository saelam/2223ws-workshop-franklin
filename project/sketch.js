let launchDataByCountry;
let colorsOfEachCountry;
let rocketLaunches;
let eventsData;
const minLaunches = 30; /* Minimum number of launches per country to it to be displayed */
const arrayOfCountries = [];
const arrayOfEvents = [];
const arrayOfLegendItems = [];
let currentYear;
let xLine;
let numYears; /* to be reassigned in the beginning of setup */
let yearsDisplayed;
const topY = 250;
let lineMaxX, lineMinX;
let playButton, pauseButton;
let animationState;
let font;
let legendUdSSR, legendUSA, legendChina, legendRussia, legendBrazil, legendAustralia, legendEurope, legendAsia;

function preload() {
  font = loadFont('fonts/OpenSans-Regular.ttf');
  launchDataByCountry = loadTable(
    "data/launches_by_year.csv",
    "csv",
    "header"
  );
  colorsOfEachCountry = loadTable(
    "data/colors_of_each_country.csv",
    "csv",
    "header"
  );
  rocketLaunches = loadTable("data/rocket_launches.csv", "csv", "header");
  eventsData = loadTable("data/special_events.csv", "csv", "header");
}

function setup() {
  createCanvas(1400, 900); /* size of canvas in x and y direction */
  textFont(font);
  frameRate(60);
  let currentCountry;
  let currentEvent;
  playButton = new Button('play');
  pauseButton = new Button('pause');
  addLegendItems();
  legendUdSSR._selected = true;
  /*  , legendUSA, legendChina, legendRussia, legendBrazil, legendAustralia, legendEurope, legendAsia; */
  currentYear = 0;
  xLine = height - 100;
  numYears = launchDataByCountry.rows.length; /* 61 */
  yearsDisplayed = 1; /* assign number of points to number of rows in original csv */
  if (yearsDisplayed > launchDataByCountry.rows.length || yearsDisplayed < 1) {
    console.error("You entered too many years, resetting value...")
    yearsDisplayed = launchDataByCountry.rows.length; /* 61 */
  }

  /* Run through all columns except first column of header row & Create Country objects */
  for (let currentColumn = 1; currentColumn < launchDataByCountry.getColumnCount(); currentColumn++) {
    currentCountry = new Country();
    currentCountry._name = launchDataByCountry.columns[currentColumn]; /* add name of country to object */
    currentCountry._index = currentColumn;
    arrayOfCountries.push(currentCountry);
  }

  /* Run through all columns of color csv file and assign that color to country objects */
  for (let currentColumn = 0; currentColumn < colorsOfEachCountry.getColumnCount(); currentColumn++) {
    arrayOfCountries[currentColumn]._color = "#" + colorsOfEachCountry.rows[0].arr[currentColumn]; /* assign color from csv to country object */
  }

  /* add new value to array of data to each country */
  for (let currentRow = 0; currentRow < launchDataByCountry.getRowCount(); currentRow++) {
    let _date = launchDataByCountry.rows[currentRow].arr[0]; /* get date of current row */

    /* run through all columns in current row */
    for (let currentColumn = 1; currentColumn < launchDataByCountry.getColumnCount(); currentColumn++) {
      let _rocket_launches = launchDataByCountry.rows[currentRow].arr[currentColumn]; /* get number of rocket launches on current cell */
      let _vector = createVector(_date, _rocket_launches); /* create a vector with current date and current number of rocket launches */

      /* index gets subtracted by 1, because of the date column */
      arrayOfCountries[currentColumn - 1]._arrayOfData.push(_vector); /* assign vector to countries array of data */
    }
  }

  for (let country = 0; country < arrayOfCountries.length; country++) {
    //calculates the pixel position of each year in the country
    arrayOfCountries[country].calculatePoints(xLine);
  }

  for (let i = 0; i < eventsData.rows.length; i++) {
    currentEvent = new Marker();
    currentEvent._name = eventsData.rows[i].obj.Country;
    currentEvent._index = i;
    currentEvent._date = eventsData.rows[i].obj.Date;
    currentEvent._decimalYear = eventsData.rows[i].obj.Position;
    currentEvent._description = eventsData.rows[i].obj.Event;
    currentEvent._crew = eventsData.rows[i].obj.Crew
    currentEvent.calculatePositionX(xLine);
    arrayOfEvents.push(currentEvent)
  }
}

function addLegendItems() {
  legendUdSSR = new LegendItem("UdSSR", "udssr");
  legendUSA = new LegendItem("USA", "usa");
  legendChina = new LegendItem("China", "china");
  legendRussia = new LegendItem("Russia", "russia");
  legendBrazil = new LegendItem("Brazil", "brazil");
  legendAustralia = new LegendItem("Australia", "australia");
  legendEurope = new LegendItem("Europe", "europe");
  legendAsia = new LegendItem("Asia", "asia");
}

function draw() {
  /* set animation every frame */
  if (frameCount % 1 === 0 && animationState) {
    /* exponential growth */
    setYearsDisplayed((yearsDisplayed * 1.005) + 0.05)
  }
  background("#0f0326"); /* color of background of canvas */

  /*   fill(255);
    textSize(30);
    pop();
    text("Rocket launches throughout history", 50, 50)
    push();
    textSize(15);
    text("First Launch date: " + rocketLaunches.rows[0].obj.date, 50, 75);
    
    text("current year: " + currentYear, 50, 100) */
  /* run through countries */
  let currentYear = round(yearsDisplayed + 1956, 0);
  push();
  fill(255)
  text("1957", 72, 820)
  textAlign(RIGHT)
  text(currentYear, width - 72, 820)
  pop();
  for (let country = 0; country < arrayOfCountries.length; country++) {
    /* call draw function inside each object */
    arrayOfCountries[country].drawNumRocketLaunch(xLine);
  }
  /* run through events markers */
  for (let event = 0; event < arrayOfEvents.length; event++) {
    /* call draw function inside each object */
    arrayOfEvents[event].drawMarker(xLine);
  }
  push();
  noStroke();
  fill("#0f0326");
  rect(width - 72, 200, 200, 1000);
  pop();
}


function mouseReleased() {
  /* playButton.mouseClicked(); */
  for (let country = 0; country < arrayOfCountries.length; country++) {
    arrayOfCountries[country].clickOverMe();
  }
  for (let event = 0; event < arrayOfEvents.length; event++) {
    arrayOfEvents[event].clickOverMe();
  }

}

function skipBackward() {
  setYearsDisplayed(1)
}

function skipPrevious() {
  setYearsDisplayed(floor(yearsDisplayed) - 1);
}

/* can't have "play" function, leads to a conflict */
function playAnimation() {
  setYearsDisplayed("continue");
  animationState = true;
  playButton.hide();
  pauseButton.show();
}

function pause() {
  animationState = false;
  playButton.show();
  pauseButton.hide();
}

function toggle() {
  if (animationState) {
    pause();
  } else {
    playAnimation();
  }
}

function skipNext() {
  setYearsDisplayed(floor(yearsDisplayed) + 1);
}

function skipForward() {
  setYearsDisplayed("max");
}

/* accept as argument number of years or text (such as max) */
function setYearsDisplayed(years) {

  /* was max number of years asked? */
  /* or */
  /* was the maximum reached? */
  if (years === "max" || years >= launchDataByCountry.rows.length) {

    /* set maximum number of years */
    years = launchDataByCountry.rows.length;

    /* stop animation */
    pause();
  }

  /* did user ask for less than 1 year to be displayed? */
  else if (years < 1) {

    /* force 1 year to be displayed */
    years = 1;
  }

  /* did user ask to continue animation? */
  else if (years === "continue") {

    /* was the maximum number of years reched beforehand? */
    /* or */
    /* is there currently only one year being displayed? */
    if (yearsDisplayed >= launchDataByCountry.rows.length || yearsDisplayed === 1) {

      /* reset number of years to display */
      years = 1;
    }


    /* is the before mentioned not the case? */
    else {

      /* set years to be seen the same value that was already there */
      years = yearsDisplayed;
    }
  }
  /* sync argument that was entered with number of years to be displayed */
  yearsDisplayed = years;

  /* recalculate arrays of points */
  calculateAllPoints();
}

function calculateAllPoints() {

  /* run through array of countries */
  for (let country = 0; country < arrayOfCountries.length; country++) {

    /* calculate the x-y-position of each country */
    arrayOfCountries[country].calculatePoints(xLine);
  }

  /* run through array of events */
  for (let i = 0; i < arrayOfEvents.length; i++) {

    /* calculate the x-position of each event marker */
    arrayOfEvents[i].calculatePositionX(xLine);
  }
}

/* is any key pressed */
function keyReleased() {

  /* is spacebar pressed? */
  if (keyCode === 32) {
    /* turn animation on if it was off and viceversa */
    toggle();
  }

  /* is pgup button pressed? */
  else if (keyCode === 33) {
    skipBackward();
  }

  /* is pgdn button pressed? */
  else if (keyCode === 34) {
    skipForward();
  }

  /* is right arrow pressed? */
  else if (keyCode === 39) {
    skipNext();
  }

  /* is left arrow pressed? */
  else if (keyCode === 37) {
    skipPrevious();
  }

}


/* 
Hochschule für Gestaltung - Schwäbisch Gmünd
Grundlagen im medialen Raum - Projektarbeit
Anton Pelezki 
Carina Senger 
Luca Mário Ziegler Félix  
Tim Niedermeier 
 */
