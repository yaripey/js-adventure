export class TestPlatform {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    get rect() {
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.h,
            right: this.x + this.w
        }
    }

    draw(c, camera) {
        c.fillStyle = 'red'
        c.fillRect(this.x - camera.x, this.y - camera.y, this.w, this.h)
    }
}
