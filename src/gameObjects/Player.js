import {
    keys,
    OBJ_TYPE_PLAYER,
    SCREEN_HEIGHT,
    SCREEN_WIDTH
} from '../common/globals.js'
import { colliding } from '../common/utils.js'

export class Player {
    constructor(x, y) {
        this.w = 8
        this.h = 10

        this.x = x
        this.y = y

        this.xVel = 0
        this.yVel = 0
        this.maxVel = 2

        this.acc = 0.1

        this.airborne = false
        this.type = [OBJ_TYPE_PLAYER]


    }

    get top() { return this.y }
    get bottom() { return this.y + this.h }
    get left() { return this.x }
    get right() { return this.x + this.w }

    set top(v) { this.y = v }
    set bottom(v) { this.y = v - this.h }
    set left(v) { this.x = v }
    set right(v) { this.x = v - this.w }

    get rect() {
        return {
            top: this.top,
            bottom: this.bottom,
            left: this.left,
            right: this.right,
        }
    }

    draw(c, camera) {
        c.fillStyle = 'white'
        c.fillRect(
            this.x - camera.x, this.y - camera.y,
            this.w, this.h
        )
    }

    update(solidObjects, camera) {
        if (
            keys.a.pressed
            && Math.abs(this.xVel) < this.maxVel
        ) {
            // If 'a' key is pressed and the speed
            // didn't reach limit accelerate to the left
            this.xVel -= this.acc
        } else if (
            keys.d.pressed
            && Math.abs(this.xVel) < this.maxVel
        ) {
            // If 'd' key is pressed and the speed
            // didn't reach limit accelerate to the right
            this.xVel += this.acc
        } else if (this.xVel < 0) {
            // Slow down
            this.xVel += this.acc
        } else if (this.xVel > 0) {
            // Slow down
            this.xVel -= this.acc
        }

        if (this.airborne)
            if (this.yVel < this.maxVel)
                // If airborne and speed didn't reach limit
                // accelerate down
                this.yVel += this.acc

        if (
            keys.space.pressed
            && !this.airborne
        ) {
            // Jump
            this.yVel = -3
            this.airborne = true
        }

        // Round position because floats doesn't work
        // very precise
        this.xVel = Number(this.xVel.toFixed(2))
        this.yVel = Number(this.yVel.toFixed(2))

        // Placeholder for colliding objects
        let objs = []

        // Move horizontally
        this.x += this.xVel
        this.x = Number(this.x)

        // Get all colliding objects
        objs = solidObjects.filter(obj =>
            colliding(this.rect, obj.rect))
        objs.forEach(obj => {
            // For each colliding object define
            // the direction in which player is going,
            // stick to the object and stop the player.
            if (
                this.xVel > 0
                && this.right > obj.rect.left
            ) {
                this.xVel = 0
                this.right = obj.rect.left
            }
            else if (
                this.xVel < 0
                && this.left < obj.rect.right
            ) {
                this.xVel = 0
                this.left = obj.rect.right
            }
        })

        this.x = Math.round(this.x)

        // Move vertically
        this.y += this.yVel
        // Always set airborne true, it will be reversed
        // if there is collision with an object below.
        // This enables falling when going off a platform.
        this.airborne = true

        // Get all colliding objects
        objs = solidObjects.filter(obj =>
            colliding(this.rect, obj.rect))
        objs.forEach(obj => {
            // For each colliding object stick to that
            // object and stop the player.
            if (
                this.yVel > 0
                && this.bottom > obj.rect.top
            ) {
                // If it's something the player
                // landed on, turn of airborne to enable
                // jumping again.
                this.bottom = obj.rect.top
                this.yVel = 0
                this.airborne = false
            }
            else if (
                this.yVel < 0
                && this.top < obj.rect.bottom
            ) {
                this.top = obj.rect.bottom
                this.yVel = 0
            }
        })

        this.y = Math.round(this.y)

        // Move the camera
        camera.x = this.x - SCREEN_WIDTH / 2 + this.w / 2
        camera.y = this.y - SCREEN_HEIGHT / 2 + this.h / 2
    }
}
