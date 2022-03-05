/**
 *  @author Kiwi
 *  @date 2022.03.04
 *
 *
 * ☐ text morphing: morph cycle → cyclic pointsList in setup
 *    better to just do 1,2,3,4,5,6,7,8,9,0
 *    I guess we could do a randomization feature with one button switch
 * ☐ add instruction divs: small caps
 *    right click → toggle wordSnap / 'magnetics'
 *        disable context actions
 */

let bpdots, consolas
let vehicles = []
let points = []

let arrival // flag for whether 'going home' is turned on


function preload() {
    bpdots = loadFont('data/bpdots.otf')
    consolas = loadFont('data/consola.ttf')
}


function setup() {
    createCanvas(600, 300)
    colorMode(HSB, 360, 100, 100, 100)

    points = addLiya()
    // points = addGiantTwo()
    // points = addHBLiya()
    // points = addTwosDay()
    console.log(points.length)

    /** populate vehicles array with their coordinates from textToPoints */
    for (let i = 0; i < points.length; i++) {
        let pt = points[i]
        let vehicle = new Vehicle(pt.x, pt.y)
        vehicles.push(vehicle)
    }

    recolor()
    arrival = false
}


/**
 * displays new words via a change in the points array
 * @param inputPts the new points array to replace the current one
 */
function alterPoints(inputPts) {
    /** pseudocode → remember we have access to points and vehicles
     *
     *  does total number of points remain constant across machines?
     *  doesn't matter → compare lengths
     *      if newWord.vehicleCount > old:
     *          iterate through, assigning new targets to current vehicles
     *          add new at the end
     *      else if newWord.vehicleCount < old:
     *          iterate through
     *          truncate
     *      else if they are the same:
     *          iterate and assign
     */

    const currentVehicleCount = vehicles.length
    const newPtsCount = inputPts.length

    console.log(`new: ${newPtsCount}, current: ${currentVehicleCount}`)
    if (newPtsCount >= currentVehicleCount) {
        /* iterate through new points, assigning new v.target.pos.x/y */
        let stopIndex = 0
        for (let i in vehicles) {

            let v = vehicles[i]
            v.target.x = inputPts[i].x
            v.target.y = inputPts[i].y
            stopIndex = parseInt(i) // unsure why this is needed
        }

        /* add extra points; stopPoint lets us pick up where we left off */
        /* note that if the counts are the same, this code does not execute */
        let difference = newPtsCount-currentVehicleCount
        for (let i=0; i<difference; i++) {
            let stopPoint = inputPts[stopIndex+i]
            vehicles.push(new Vehicle(stopPoint.x, stopPoint.y))

            // console.log(`i:${i}, stopIndex+i: ${stopIndex+i}`)
        }
    } else { /* currentVehicleCount > newPtsCount so we need to delete! */
        /*  */
        let stopIndex = 0
        for (let i in inputPts) {
            let v = vehicles[i]
            v.target.x = inputPts[i].x
            v.target.y = inputPts[i].y
            stopIndex = i
        }

        vehicles = vehicles.slice(0, stopIndex)
    }

    recolor()
}



/** returns text point locations for "happy birthday, Liya!" centered
 *  237 points
 */
function addHBLiya() {
    let pts = bpdots.textToPoints('happy birthday,', 90, 100, 48, {
        sampleFactor: 0.01, // increase for more points
        // simplifyThreshold: 0 // increase to remove collinear points
    })

    pts = pts.concat(bpdots.textToPoints('Liya!', 200, 175, 72, {
        sampleFactor: 0.02, // increase for more points
    }))

    return pts
}


/** returns text point locations for "happy twosday! 2.22.22 2:22pm", centered
 *  313 points
 */
function addTwosDay() {
    let pts = bpdots.textToPoints('happy twosday!', 100, 100, 48, {
        sampleFactor: 0.01, // increase for more points
        // simplifyThreshold: 0 // increase to remove collinear points
    })

    pts = pts.concat(bpdots.textToPoints('2.22.22 2:22pm', 90, 175, 48, {
        sampleFactor: 0.06, // increase for more points
    }))

    return pts
}


/** returns text point locations for "Liya", centered
 *  313 points
 */
function addLiya() {
    return bpdots.textToPoints('Liya 💖', 50, 200, 224, {
        sampleFactor: 0.015, // increase for more points
        // simplifyThreshold: 0 // increase to remove collinear points
    })
}


/** returns text point locations for "happy birthday, Liya!" centered
 *  237 points
 */
function addGiantTwo() {
    return consolas.textToPoints('2', 200, 280, 384, {
        sampleFactor: 0.1, // increase for more points
        // simplifyThreshold: 0 // increase to remove collinear points
    })
}


function draw() {
    background(236, 37, 25)
    /** display all points and behaviors */
    for (let i = 0; i < vehicles.length; i++) {
        let v = vehicles[i]
        v.fleeFromMouse()
        v.update()
        v.wrap()
        v.show()

        if (arrival)
            v.returnToTextOrigin()
    }
}


function keyPressed() {
    /* begin song */
    if (key === 's') {
        if (!arrival)
            arrival = true
        else arrival = false
    }


    /* convert sketch display between different layouts */
    if (key === '1') {
        alterPoints(addGiantTwo())
        recolor()
    }

    if (key === '2') {
        alterPoints(addHBLiya())
        recolor()
    }

    if (key === '3') {
        alterPoints(addTwosDay())
        recolor()
    }

    if (key === '4') {
        alterPoints(addLiya())
        recolor()
    }


    /* debugging output */
    if (key === 'l') {
        console.log(vehicles.length)
    }


    /* stop sketch */
    if (key === 'z') {
        noLoop()
    }


    /* arrival! +recolor */
    if (key === 'v') {
        arrival = true
    }


    /* recolor in ascending rainbow :p */
    if (key === 'r') {
        for (let index in vehicles) {
            vehicles[index].hue = index*2%360
        }
    }
}


/** assign a rainbow of colors to our vehicles
 */
function recolor() {
    for (let index in vehicles) {
        vehicles[index].hue =
            map(parseInt(index), 0, vehicles.length, 0, 330)
    }
}