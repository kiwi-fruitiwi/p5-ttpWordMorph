/* a particle with a lifetime */
class TransientParticle extends Particle {
    super(x, y) {
        this.pos = new p5.Vector(x, y)
        this.lifetime = random(50, 100)
        this.img = loadImage('data/64.png')
    }


    finished() {
        return this.lifetime <= 0
    }

    update() {
        super.update()
        this.lifetime -= random(0.1, 0.6)
    }


    show() {
        stroke(this.hue, 100, 100, 100)
        fill(this.hue, 100, 100, this.lifetime)
        circle(this.pos.x, this.pos.y, this.r*2)
    }
}