import * as React from 'react'
import * as ReactDom from 'react-dom'

import { Loop, Stage, Sprite, World, Body } from 'react-game-kit'
// import { Component } from './component'

class Character extends React.Component {
    update() {
        console.log("test")
    }
    render() {
        return (
            <Sprite
                repeat={true}
                src="images/sprite.png"
                scale={this.context.scale * 2}
                state={0}
                steps={[0]}
            />
        )
    }
}

class Game extends React.Component<{}, {}>
{
    body: any

    render() {
        return (
            <Loop>
                <Stage>
                    <World>
                        <Body args={[0, 0, 75, 75]} ref={(b) => this.body = b.body}>
                            <Character />
                        </Body>
                    </World>
                </Stage>
            </Loop >
        )
    }
}


// Render the react tree to the HTML document
ReactDom.render(<Game />, document.getElementById("game"));


// class Player {

//     constructor(position, sprite){
//         this.position = position;
//         this.sprite = sprite;

//         this.vx = 0;
//         this.vy = 0;
//         this.moveSpeed = 10;

//         this.keyW = keyboard(87);
//         this.keyA = keyboard(65);
//         this.keyS = keyboard(83);
//         this.keyD = keyboard(68);
//     }

//     update(){

//         this.keyW.press = () => { this.vy -= this.moveSpeed};
//         this.keyS.press = () => { this.vy += this.moveSpeed};
//         this.keyA.press = () => { this.vx -= this.moveSpeed};
//         this.keyD.press = () => { this.vx += this.moveSpeed};

//         this.keyW.release = () => { this.vy = 0};
//         this.keyS.release = () => { this.vy = 0};
//         this.keyA.release = () => { this.vx = 0};
//         this.keyD.release = () => { this.vx = 0};

//         this.position.x += this.vx;
//         this.position.y += this.vy;
//         this.sprite.position = this.position;
//     }
// }


// var path = Loader.addPath("images/sprite.png");
// var player;

// Loader.loadResources(() => {
//     console.log('here!');
//     var sprite = new PIXI.Sprite(PIXI.loader.resources["images/sprite.png"].texture);
//     var playerSprite = new PIXI.Sprite(PIXI.loader.resources["images/sprite.png"].texture);

//     player = new Player({x:100, y:100}, playerSprite);

//     //sprite.visible = false;

//     stage.addChild(sprite);
//     stage.addChild(player.sprite);

//     gameLoop();
// });
// /*
// function setup(){
//     console.log("setup");
//     gameLoop();
// }
// */
// function gameLoop(){
//     requestAnimationFrame(gameLoop);

//     player.update(); // FIX: for each gameobject update

//     renderer.render(stage);
// }





// function keyboard(keyCode) {
//   var key = {};
//   key.code = keyCode;
//   key.isDown = false;
//   key.isUp = true;
//   key.press = undefined;
//   key.release = undefined;
//   //The `downHandler`
//   key.downHandler = function(event) {
//     if (event.keyCode === key.code) {
//       if (key.isUp && key.press) key.press();
//       key.isDown = true;
//       key.isUp = false;
//     }
//     event.preventDefault();
//   };

//   //The `upHandler`
//   key.upHandler = function(event) {
//     if (event.keyCode === key.code) {
//       if (key.isDown && key.release) key.release();
//       key.isDown = false;
//       key.isUp = true;
//     }
//     event.preventDefault();
//   };

//   //Attach event listeners
//   window.addEventListener(
//     "keydown", key.downHandler.bind(key), false
//   );
//   window.addEventListener(
//     "keyup", key.upHandler.bind(key), false
//   );
//   return key;
// }