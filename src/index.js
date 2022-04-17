import { keys, SCREEN_HEIGHT, SCREEN_WIDTH } from './common/globals.js'
import { ObjectManager } from './systems/objectManager.js'
import { testLvl } from './systems/lvlbuilder.js'
import { loadSprites } from './systems/imageLoader.js'

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
    switch (e.code) {
        case 'Space': keys.space.pressed = true; break
        case 'KeyA': keys.a.pressed = true; break
        case 'KeyD': keys.d.pressed = true; break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'Space': keys.space.pressed = false; break
        case 'KeyA': keys.a.pressed = false; break
        case 'KeyD': keys.d.pressed = false; break
    }
})

let be = Date.now()

const camera = {
    x: SCREEN_WIDTH / 2,
    y: SCREEN_HEIGHT / 2,
}

const fpsmeter = document.querySelector("#fps")

const objManager = new ObjectManager()
objManager.initLvl(testLvl)

loadSprites()

const animate = () => {
    // Resetting screen
    c.fillStyle = '#333'
    c.fillRect(0, 0, canvas.width, canvas.height)


    objManager.player.update(objManager.solidObjects, camera)
    objManager.objects.forEach(obj => obj.draw(c, camera))

    let now = Date.now()
    fpsmeter.value = Math.round(1000 / (now - be))
    be = now

    window.requestAnimationFrame(animate)
}

animate()
