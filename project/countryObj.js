class Country {

    constructor () {
        this._name = "";
        this._index = "";
        this._arrayOfData = [];
        this._arrayOfPoints = [];
        this._overMe = false;
        this._is_isSelected = false;

        this._color = color(255, 150, 100, 150);
        this._colorIsOver = color(255, 255, 255);

        this._maxYears = numYears;
        this._stepX = (width - 150) / this._maxYears;
        this._xBorder = 75;
    }

    // calculates the pixel position of each year in the country
    calculatePoints (xLine) {
        for (let year = 0; year < numYears; year++) {
            let valueX = this._xBorder + (year) * this._stepX;
            let valueY = map (this._arrayOfData[year].y, 0, 2468,  xLine, 600);
            let currentPoint = createVector (valueX,valueY);
            this._arrayOfPoints.push(currentPoint);
        }
    };


    drawNumRocketLaunch(xLine) {
        this.is_overMe();

        for (let year = 0; year < numYears; year++) {
            if (this._overMe || this._isSelected) {
                fill(this._colorIsOver);
                stroke(this._colorIsOver);
                strokeWeight (3);
            } else {
                fill(this._color);
                stroke(this._color);
                strokeWeight (1);
            }
            
            ellipse(this._arrayOfPoints[year].x, this._arrayOfPoints[year].y, 3,3);

            // for lines between points
            stroke(this._color);
            if (year > 0) line(this._arrayOfPoints[year-1].x, this._arrayOfPoints[year-1].y, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y);

            if (this._isSelected) {
                fill(200);
                textSize(18);
                noStroke();
                /* text( this._name, this._arrayOfPoints[this._arrayOfData.length-1].x+5, this._arrayOfPoints[this._arrayOfData.length-1].y); */
            }
        }
    };

    displayBall(year) {
        fill(250, 150, 150, 50);
        noStroke();
        if (this._arrayOfPoints[year].y < 1127){ // 1140
            // drawing dates
            let mySize = round(map (this._arrayOfPoints[year].y, 1200, 150,  1, 500));
            ellipse(this._arrayOfPoints[year].x, this._arrayOfPoints[year].y, mySize, mySize);

            // text
            fill(200);
            noStroke();
            textAlign(CENTER);
            textSize(10);
            text( this.myCode, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y-5);
            text( year+1960, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y+15);
        }
    }

    is_overMe () {
        let ifAny = false;
        for (let year = 0; year < numYears; year++) {
            let distance = dist(mouseX, mouseY, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y);
            if (distance < 5) {
                fill(200);
                textSize(24);
                text( (this._arrayOfData[year].y/ 1000000000000).toFixed(2) + " MoM",       this._arrayOfPoints[year].x, this._arrayOfPoints[year].y-70);
                text( this.myName, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y-45);
                text( this._arrayOfData[year].x, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y-20);
                ifAny = true;
            }
        }
        this._overMe = ifAny;
    };

    clickOverMe () {
        for (let year = 0; year < numYears; year++) {
            let distance = dist(mouseX, mouseY, this._arrayOfPoints[year].x, this._arrayOfPoints[year].y);
            if (distance < 5) this._isSelected = !this._isSelected;
        }
    }

} // end of class

