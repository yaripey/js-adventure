import { TILE_SIZE } from "../common/globals.js"

export const sprites = {}

const spritesPath = "/media/sprites/"

const spritesPaths = {
    marcusIdleRight: spritesPath + "marcus_idle_right.png",
    marcusIdleLeft: spritesPath + "marcus_idle_left.png",
    marcusWalkingRight: spritesPath + "marcus_walking_right.png",
    marcusWalkingLeft: spritesPath + "marcus_walking_left.png",
    marcusRisingRight: spritesPath + "marcus_rising_right.png",
    marcusRisingLeft: spritesPath + "marcus_rising_left.png",
    marcusFallingRight: spritesPath + "marcus_falling_right.png",
    marcusFallingLeft: spritesPath + "marcus_falling_left.png",
}

export function loadSprites() {
    Object.entries(spritesPaths).forEach(sprPath => {
        const sprite = new Image()
        sprite.src = sprPath[1]
        sprite.onload = () => {
            sprites[sprPath[0]] = {
                sprite,
                frames: sprite.width / TILE_SIZE
            }
        }
    })
}
