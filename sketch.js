/**
 *  @author Kiwi
 *  @date 2022.03.04
 *
 * does total number of points remain constant across machines?
 * doesn't matter → compare lengths
 *    if newWord.vehicleCount > old:
 *        iterate through, assigning new targets to current vehicles
 *        add new at the end
 *    else if newWord.vehicleCount < old:
 *        iterate through
 *        truncate
 *    else if they are the same:
 *        iterate and assign
 */

let font
let vehicles = []
let points = []

let arrival // flag for whether 'going home' is turned on


function preload() {
    font = loadFont('data/bpdots.otf')
    // font = loadFont('data/consola.ttf')
}


function setup() {
    createCanvas(600, 300)
    colorMode(HSB, 360, 100, 100, 100)

    points = addHBLiya()
    // points = addTwosDay()
    console.log(points.length)

    /** populate vehicles array with their coordinates from textToPoints */
    for (let i = 0; i < points.length; i++) {
        let pt = points[i]
        let vehicle = new Vehicle(pt.x, pt.y)
        vehicles.push(vehicle)
    }

    arrival = false
}


/** returns text point locations for "happy birthday, Liya!" centered
 *  292 points
 */
function addHBLiya() {
    let pts = font.textToPoints('happy birthday,', 90, 100, 48, {
        sampleFactor: 0.01, // increase for more points
        // simplifyThreshold: 0 // increase to remove collinear points
    })

    pts = pts.concat(font.textToPoints('Liya!', 200, 175, 72, {
        sampleFactor: 0.06, // increase for more points
    }))

    return pts
}


/** returns text point locations for "happy twosday! 2.22.22 2:22pm" centered
 *  313 points
 */
function addTwosDay() {
    let pts = font.textToPoints('happy twosday!', 100, 100, 48, {
        sampleFactor: 0.01, // increase for more points
        // simplifyThreshold: 0 // increase to remove collinear points
    })

    pts = pts.concat(font.textToPoints('2.22.22 2:22pm', 90, 175, 48, {
        sampleFactor: 0.06, // increase for more points
    }))

    return pts
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

    /* stop sketch */
    if (key === 'z') {
        noLoop()
    }

    /* arrival! +recolor */
    if (key === 'x') {
        arrival = true

        for (let index in vehicles) {
            vehicles[index].hue =
                map(parseInt(index), 0, vehicles.length, 0, 330)
        }
    }

    /* recolor in ascending rainbow :p */
    if (key === 'c') {
        for (let index in vehicles) {
            vehicles[index].hue = index
        }
    }
}