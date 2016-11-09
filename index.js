
//Create the renderer
var renderer = PIXI.autoDetectRenderer(600, 480, {antialias: false, transparent: false, resolution: 1});
//renderer.backgroundColor = 0x061639;

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();



class Player {

    constructor(position, sprite){
        this.position = position;
        this.sprite = sprite;

        this.vx = 0;
        this.vy = 0;
        this.moveSpeed = 10;

        this.keyW = keyboard(87);
        this.keyA = keyboard(65);
        this.keyS = keyboard(83);
        this.keyD = keyboard(68);
    }

    update(){

        this.keyW.press = () => { this.vy -= this.moveSpeed};
        this.keyS.press = () => { this.vy += this.moveSpeed};
        this.keyA.press = () => { this.vx -= this.moveSpeed};
        this.keyD.press = () => { this.vx += this.moveSpeed};
        
        this.keyW.release = () => { this.vy = 0};
        this.keyS.release = () => { this.vy = 0};
        this.keyA.release = () => { this.vx = 0};
        this.keyD.release = () => { this.vx = 0};
        
        this.position.x += this.vx;
        this.position.y += this.vy;
        this.sprite.position = this.position;
    }
}


PIXI.loader.add("images/sprite.png").load(() => {
    var sprite = new PIXI.Sprite(PIXI.loader.resources["images/sprite.png"].texture);
    var playerSprite = new PIXI.Sprite(PIXI.loader.resources["images/sprite.png"].texture);

    let player = new Player({x:100, y:100}, playerSprite);
    
    sprite.visible = false;
    
    stage.addChild(sprite);
    stage.addChild(player.sprite);

    renderer.render(stage);
    setInterval(() => {
        player.update();
        sprite.visible = !sprite.visible;
        renderer.render(stage);
    }, 100);
});




function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}