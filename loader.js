const _loader = PIXI.loader;

class Loader
{
    constructor() {
        this.pathsToLoad = [];
    }

    /** Returns a loaded resource as a texture */
    getTexture(path) {
        return _loader.resources[path].texture
    }
    /** Adds a path to load a resource from */
    addPath(path) {
        this.pathsToLoad.push(path);
        return path;
    }

    loadResources(callback) {
        let nrOfLoadedResources = 0;
        _loader.add(this.pathsToLoad).on("progress", () => {
            nrOfLoadedResources += 1;
            console.log('loading', (100/this.pathsToLoad.length)*nrOfLoadedResources + '%')
        }).load(callback)
    }
} 

module.exports = new Loader() 