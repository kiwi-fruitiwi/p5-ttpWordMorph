/**
 *  @author Kiwi
 *  @date 2022.03.04
 *
 * ☐ wand with particle emitter for cursor
 * ☐ one additional scene while removing big 'Liya'
 * ☒ text morphing: morph cycle → cyclic pointsList in setup
 *    better to just do 1,2,3,4,5,6,7,8,9,0
 *    I guess we could do a randomization feature with one button switch
 * ☒ add instruction divs: small caps
 *    right click → toggle wordSnap / 'magnetics'
 *        disable context actions
 */

/**
 *  coding plan from scratch
 *  basic physics system
 *     particle constructor
 *         random starting pos
 *         velocity
 *         acceleration
 *         radius
 *         target or 'home' vector
 *         maxspeed, maxforce
 *     update, applyforce, show
 *     create 300 particles → test with gravity vector
 *     edges, wrap
 *
 *  steering behaviors
 *     seek ← steering vector = desired - velocity
 *     arrive ← seek with distance force map
 *     fleeFromMouse ← flee.mult(2) within distance d=70
 *     returnToTextOrigin ← apply arrive force to home
 *
 *  heyPressed: noLoop, log particles.length, flip arrival
 *
 *  functions to create textToPoints pts to particles
 *     setup fonts: bpdots, consola
 *  hue in particle.js
 *     colorByIndex ← map hue to number of particles
 *     colorByHomePos ← map hue to home.pos.x
 *
 *  alterPoints: textMorph
 *     compare lengths of particles vs new points
 *     two cases: ≥, <
 *
 *  additions
 *     scene cycle
 *     instruction divs
 */

let bpdots, consolas
let vehicles = []
let points = []

let arrival // flag for whether 'going home' is turned on
let instructions

function preload() {
    bpdots = loadFont('data/bpdots.otf')
    consolas = loadFont('data/consola.ttf')
}


function setup() {
    let cnv = createCanvas(600, 300)
    noCursor()
    cnv.parent('#canvas')

    colorMode(HSB, 360, 100, 100, 100)

    instructions = select('#ins')
    instructions.html(`<pre>
        [1,2,3,4] → switch scenes
        s → toggle magnetics
        z → freeze sketch
        </pre>`)
    // instructions.parent('main')

    points = addBigLiya()
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

    colorByIndex()
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
        let stopIndex = 0
        for (let i in inputPts) {
            let v = vehicles[i]
            v.target.x = inputPts[i].x
            v.target.y = inputPts[i].y
            stopIndex = i
        }

        vehicles = vehicles.slice(0, stopIndex)
    }

    colorByIndex()
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
function addBigLiya() {
    return consolas.textToPoints('Liya', 50, 200, 224, {
        sampleFactor: 0.2, // increase for more points
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
    fill(0, 0, 100, 70)
    stroke(0, 0, 100)
    circle(mouseX, mouseY, 10)


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
    /* toggle arrival */
    if (key === 's') {
        if (!arrival)
            arrival = true
        else arrival = false
    }


    /* convert sketch display between different layouts */
    if (key === '1') {
        alterPoints(addGiantTwo())
        colorByIndex()
    }

    if (key === '2') {
        alterPoints(addHBLiya())
        colorByIndex()
    }

    if (key === '3') {
        alterPoints(addTwosDay())
        colorByIndex()
    }

    if (key === '4') {
        alterPoints(addBigLiya())
        colorByPosX()
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


/** assign a rainbow of colors to our vehicles based on index
 */
function colorByIndex() {
    for (let index in vehicles) {
        vehicles[index].hue =
            map(parseInt(index), 0, vehicles.length, 0, 330)
    }
}


/** assign a rainbow of colors to our vehicles based on x position of target
 */
function colorByPosX() {
    for (let index in vehicles) {
        vehicles[index].hue =
            map(vehicles[index].target.x, 75, width-75, 0, 345)
    }
}