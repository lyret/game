import Loader from './loader';

//Create the renderer
var renderer = PIXI.autoDetectRenderer(600, 480, {antialias: false, transparent: false, resolution: 1});
//renderer.backgroundColor = 0x061639;

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();

class player {

    constructor(positions){
        this.position = position;
    }

    update(){

        
    }
}


var path = Loader.addPath("images/sprite.png");

Loader.loadResources(() => {
    console.log('here!');
    var sprite = new PIXI.Sprite(PIXI.loader.resources["images/sprite.png"].texture);
    sprite.visible = false;
    stage.addChild(sprite);
    renderer.render(stage);
    setInterval(() => {
        sprite.visible = !sprite.visible;
        renderer.render(stage);
    }, 100);
});