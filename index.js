import { Player } from './src/gameObjects/Player.js'
import { keys, SCREEN_HEIGHT, SCREEN_WIDTH } from './src/common/globals.js'
import { TestPlatform } from './src/gameObjects/testObjects.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
c.webkitImageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;
c.imageSmoothingEnabled = false;

canvas.width = SCREEN_WIDTH
canvas.height = SCREEN_HEIGHT

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w': keys.w.pressed = true; break
        case 'a': keys.a.pressed = true; break
        case 's': keys.s.pressed = true; break
        case 'd': keys.d.pressed = true; break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w': keys.w.pressed = false; break
        case 'a': keys.a.pressed = false; break
        case 's': keys.s.pressed = false; break
        case 'd': keys.d.pressed = false; break
    }
})

const player = new Player(10, 20)
const bottomPlatform = new TestPlatform(10, 100, 50, 20)
const bottomPlatform2 = new TestPlatform(65, 80, 50, 20)

const solidObjects = [bottomPlatform, bottomPlatform2]

let be = Date.now(), fps = 0

const camera = {
    x: 0,
    y: 0,
}

const fpsmeter = document.querySelector("#fps")
const animate = () => {
    // Resetting screen
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)


    player.update(solidObjects, camera)
    bottomPlatform.draw(c, camera)
    bottomPlatform2.draw(c, camera)
    player.draw(c, camera)

    let now = Date.now()
    fpsmeter.value = Math.round(1000 / (now - be))
    be = now



    window.requestAnimationFrame(animate)
}

animate()
