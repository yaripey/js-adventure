import {
    buildLvl,
    getPlayerObject,
    getSolidObjects
} from "./lvlbuilder.js"

export class ObjectManager {
    constructor() {
        this.objects = []
        this.player = null
        this.solidObjects = []
    }

    initLvl(lvlSchema) {
        this.objects = buildLvl(lvlSchema)
        this.player = getPlayerObject(this.objects)
        this.solidObjects = getSolidObjects(this.objects)
    }
}
