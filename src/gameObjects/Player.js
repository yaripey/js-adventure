import { keys } from 'src/common/globals.js'
import { colliding } from 'src/common/utils.js'
// export const Player = {
//     w: 50, h: 50,
//     speed: 2,
//     pos: { x: 10, y: 10 },
//     draw: function (c) {
//         c.fillStyle = 'white'
//         c.fillRect(
//             this.pos.x, this.pos.y,
//             this.width, this.height
//         )
//     },
//     update: function () {
//         if (keys.a.pressed) this.pos.x -= this.speed
//         if (keys.d.pressed) this.pos.x += this.speed
//         if (keys.w.pressed) this.pos.y -= this.speed
//         if (keys.s.pressed) this.pos.y += this.speed
//     }
// }

export class Player {
    constructor(x, y) {
        this.w = 5
        this.h = 7
        this.x = x
        this.y = y
        this.xVel = 0
        this.yVel = 0
        this.maxVel = 2
        this.acc = 0.1
        this.airborne = false
    }

    get top() { return this.y }
    get bottom() { return this.y + this.h }
    get left() { return this.x }
    get right() { return this.x + this.w }

    get rect() {
        return {
            top: this.top,
            bottom: this.bottom,
            left: this.left,
            right: this.right,
        }
    }

    set top(v) { this.y = v }
    set bottom(v) { this.y = v - this.h }
    set left(v) { this.x = v }
    set right(v) { this.x = v - this.w }

    // set rect(rect) {
    //     if (rect.left)
    //         this.x = rect.left
    //     else if (rect.right)
    //         this.x = rect.right - this.w

    //     if (rect.top)
    //         this.y = rect.top
    //     else if (rect.bottom)
    //         this.y = rect.bottom - this.h
    // }

    // set [rect](v) {
    //     console.log('test')
    // }

    draw(c) {
        c.fillStyle = 'white'
        c.fillRect(
            this.x, this.y,
            this.w, this.h
        )
    }

    update(solidObjects) {
        if (
            keys.a.pressed
            && Math.abs(this.xVel) < this.maxVel
        ) this.xVel -= this.acc
        else if (
            keys.d.pressed
            && Math.abs(this.xVel) < this.maxVel
        ) this.xVel += this.acc
        else if (this.xVel < 0) this.xVel += this.acc
        else if (this.xVel > 0) this.xVel -= this.acc

        // this.yVel += 0.1
        if (this.airborne)
            if (this.yVel < this.maxVel)
                this.yVel += this.acc

        if (
            keys.w.pressed
            && !this.airborne
        ) {
            this.yVel = -3
            this.airborne = true
        }

        this.xVel = Number(this.xVel.toFixed(2))
        this.yVel = Number(this.yVel.toFixed(2))


        let objs = []

        // if (this.xVel > 0) {
        //     const rect0 = {
        //         ...this.rect,
        //         left: this.rect.left + this.xVel,
        //         right: this.rect.right + this.right
        //     }
        //     objs = solidObjects.filter(obj => {
        //         colliding(rect0, obj.rect)
        //     })
        //     objs.forEach(obj => {
        //         if ()
        //     })
        // }

        this.x += this.xVel
        objs = solidObjects.filter(obj =>
            colliding(this.rect, obj.rect))

        objs.forEach(obj => {
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

        this.y += this.yVel
        this.airborne = true

        objs = solidObjects.filter(obj =>
            colliding(this.rect, obj.rect))

        objs.forEach(obj => {
            if (
                this.yVel > 0
                && this.bottom > obj.rect.top
            ) {
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

        console.log(this.rect)
    }
}
