import {
    DIRECTION_RIGHT,
    DIRECTION_LEFT,
    keys,
    OBJ_TYPE_PLAYER,
    SCREEN_HEIGHT,
    SCREEN_WIDTH
} from '../common/globals.js'
import { colliding } from '../common/utils.js'
import { sprites } from '../systems/imageLoader.js'

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

        this.direction = DIRECTION_RIGHT

        this.sprite = sprites["marcusIdleRight"]
        this.spriteName = "marcusIdleRight"
        this.elapsed = 0
        this.frame = 0
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
        if (!this.sprite) return
        c.drawImage(
            this.sprite.sprite,
            this.frame * this.w,
            0,
            this.sprite.sprite.width / this.sprite.frames,
            this.sprite.sprite.height,
            this.x - camera.x,
            this.y - camera.y,
            this.sprite.sprite.width / this.sprite.frames,
            this.sprite.sprite.height
        )

        if (this.sprite.frames > 1) {
            this.elapsed++
        }

        if (this.elapsed % 10 === 0) {
            if (this.frame < this.sprite.frames - 1)
                this.frame++
            else
                this.frame = 0
        }
    }

    update(solidObjects, camera) {
        if (
            keys.a.pressed
            && Math.abs(this.xVel) < this.maxVel
        ) {
            this.direction = DIRECTION_LEFT
            // If 'a' key is pressed and the speed
            // didn't reach limit accelerate to the left
            this.xVel -= this.acc
        } else if (
            keys.d.pressed
            && Math.abs(this.xVel) < this.maxVel
        ) {
            this.direction = DIRECTION_RIGHT
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
        this.x = Math.round(this.x)

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
        // Move vertically
        this.y += this.yVel
        this.y = Math.round(this.y)
        // Always set airborne true, it will be reversed
        // if there is collision with an object below.
        // This enables falling when going off a platform.
        // this.airborne = true

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


        // Move the camera
        camera.x = this.x - SCREEN_WIDTH / 2 + this.w / 2
        camera.y = this.y - SCREEN_HEIGHT / 2 + this.h / 2


        // Updating sprite
        let directionName = ""
        let actionName = ""

        if (this.direction === DIRECTION_LEFT) {
            directionName = "Left"
        } else {
            directionName = "Right"
        }

        if (this.airborne) {
            if (this.yVel < 0) {
                actionName = "Rising"
            } else {
                actionName = "Falling"
            }
        } else if (this.xVel === 0) {
            actionName = "Idle"
        } else if (this.xVel !== 0) {
            actionName = "Walking"
        }

        if ("marcus" + actionName + directionName !== this.spriteName) {
            this.spriteName = "marcus" + actionName + directionName
            this.frame = 0
            this.elapsed = 0
        }

        this.sprite = sprites["marcus" + actionName + directionName]
        if (this.sprite) {
            this.w = this.sprite.sprite.width / this.sprite.frames
            this.h = this.sprite.sprite.height
        }

        // Check if standing on something
        const testObjs = solidObjects.filter(obj => {
            return colliding({ left: this.left, right: this.right, top: this.top, bottom: this.bottom + 2 }, obj.rect)
        })
        if (testObjs.length === 0) {
            this.airborne = true
        }
    }
}
