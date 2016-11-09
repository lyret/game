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
        _loader.add(this.pathsToLoad).on("progress", (loader, resource) => {
            console.log('loaded ' +resource.name, loader.progress + '%')
        }).load(callback)
    }
} 

module.exports = new Loader() 