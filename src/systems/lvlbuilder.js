import { TestPlatform } from "../gameObjects/testObjects.js"
import {
    OBJ_TYPE_PLAYER,
    OBJ_TYPE_SOLID,
    TILE_SIZE
} from "../common/globals.js"
import { Player } from "../gameObjects/Player.js"

export const testLvl = [
    ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "B", "0", "0", "0", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "B", "0", "0", "0", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "B", "0", "B", "B", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "B", "0", "0", "0", "B"],
    ["B", "0", "0", "0", "B", "B", "B", "B", "0", "0", "0", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "0", "B", "0", "0", "B"],
    ["B", "0", "P", "0", "0", "0", "0", "0", "0", "B", "0", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "B"],
    ["B", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "B"],
    ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B"],
]

export function buildLvl(lvlSchema) {
    const gameObjects = []

    lvlSchema.forEach((row, y) => {
        row.forEach((block, x) => {
            switch (block) {
                case 'B':
                    // Simple block
                    gameObjects.push(new TestPlatform(
                        x * TILE_SIZE,
                        y * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE
                    ))
                    break
                case 'P':
                    gameObjects.push(new Player(
                        x * TILE_SIZE,
                        y * TILE_SIZE
                    ))
            }
        })
    })

    return gameObjects
}

export function getPlayerObject(objects) {
    return objects.find(obj => obj.type.includes(OBJ_TYPE_PLAYER))
}

export function getSolidObjects(objects) {
    return objects.filter(obj => obj.type.includes(OBJ_TYPE_SOLID))
}
