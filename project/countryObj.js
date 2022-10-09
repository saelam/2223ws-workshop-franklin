class Country {

    constructor() {
        this._name = "";
        this._index = "";
        this._arrayOfData = [];
        this._arrayOfPoints = [];
        this._arrayOfSum = [];
        this._overMe = false;
        this._isSelected = false;

        this._color = color(186, 30, 104);
        this._colorIsOver = color(252, 251, 254);

        this._stepX = (width - 150) / (yearsDisplayed - 1);
        this._xBorder = 75;
    }



    /* calculate each coordinate of every year */
    calculatePoints(xLine) {
        this._stepX = (width - 150) / (yearsDisplayed - 1);
        this._arrayOfPoints = [];

        for (let year = 0; year < yearsDisplayed; year++) {
            let valueX;
            /* old way of calculating x coordinate */
            /* valueX = this._xBorder + (year) * this._stepX; */
            if (yearsDisplayed === 1) {
                valueX = 75;
            } else {
                valueX = map(this._arrayOfData[year].x - 1957, 0, yearsDisplayed - 1, 75, width - 75);
            }

            let valueY = map(this._arrayOfData[year].y, 0, highestValueY, xLine, topY);
            let currentPoint = createVector(valueX, valueY);
            this._arrayOfPoints.push(currentPoint);
            arrayOfDataPoints.push(this._arrayOfData[year].y)
        }
        if (autoScale) {
            this.hideExtremeCases();
        }
    }

    calculateSumVectors() {
        this._arrayOfSum = [];
        for (let date = 0; date < sumOfLaunchDataByCountry.rows.length; date ++) {
            let valueX;
            let valueY;
            valueX = sumOfLaunchDataByCountry.rows[date].arr[0];
            valueY = sumOfLaunchDataByCountry.rows[date].arr[this._index];
            let currentVector = createVector(valueX, valueY);
            this._arrayOfSum.push(currentVector)
        }
    }

    hideExtremeCases() {
        thisCountryHighestValue = Math.max(...arrayOfDataPoints);
        if (thisCountryHighestValue > highestValueY) {
            for (let year = 0; year < yearsDisplayed; year++) {
                this._arrayOfPoints[year].y = 20000;
            }
        }
        arrayOfDataPoints = [];
    }

    drawNumRocketLaunch() {
        push();
        for (let year = 0; year < yearsDisplayed; year++) {
            this.changeOpacityBasedOnValue();
            this.drawPoints(year);
            this.drawLinesBetweenPoints(year);
        }
        pop();
    }

    drawPoints(year) {
        push();
        stroke(this._color);
        if (this._overMe || this._isSelected) {
            fill(this._color);
            strokeWeight(2);
        } else {
            fill(this._color);
            strokeWeight(0.5);
        }
        ellipse(this._arrayOfPoints[year].x, this._arrayOfPoints[year].y, 3, 3);
        pop();
    }

    drawLinesBetweenPoints(year) {
        stroke(this._color);
        if (year > 0) {
            line(this._arrayOfPoints[year - 1].x, this._arrayOfPoints[year - 1].y, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y);
        }
    }

    changeOpacityBasedOnValue() {
        if (this.isAnySelected() && !this._isSelected) {
            /* more transparent colors */
            this.setColorAlpha(10);
        } else if (this.isAnySelected() && this._isSelected) {
            this.setColorAlpha("ff");
        } else {
            this.setColorAlpha("aa");
        }
    }

    is_overMe() {
        push();
        let ifAny = false;
        for (let year = 0; year < yearsDisplayed; year++) {
            let distance = dist(mouseX, mouseY, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y);
            if (distance < 20) {
                fill(200);
                textSize(24);
                let descriptionText;

                /* create dynamic description, based on value, singular or plural */
                if ((this._arrayOfData[year].y * 1).toFixed(0) != 1) {
                    descriptionText = "Space Flights";
                } else {
                    descriptionText = "Space Flight"
                }
                text((this._arrayOfData[year].y * 1).toFixed(0) + " " /* add whitespace between value and text */ + descriptionText, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y - 70);
                text(this._name, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y - 45);
                text(this._arrayOfData[year].x, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y - 20);
                ifAny = true;
            }
        }
        this._overMe = ifAny;
        pop();
    };

    setOthersSelectedFalse() {
        /* run through all countries and set _isSelected as false but not on this object */
        for (let i = 0; i < arrayOfCountries.length; i++) {
            if (arrayOfCountries[i]._name != this._name) {
                arrayOfCountries[i]._isSelected = false;
            }
        }
    }


    isAnySelected() {
        let isAny = false;
        for (let i = 0; i < arrayOfCountries.length; i++) {
            if (arrayOfCountries[i]._isSelected) {
                isAny = true;
            }
        }
        return isAny;
    }

    setColorAlpha(alphaValue) {
        this._color = this._color.slice(0, -2);
        this._color = this._color + alphaValue;
    }

    toggleSelectCountry(selectorName) {
        if (this._name === selectorName) {
            this._isSelected = !this._isSelected;
        }
    }
} // end of class

