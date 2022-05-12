
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');
const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;;

// Get the canvas graphics context
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

// Debounce setCanvasDimention()
window.addEventListener('resize', debounce(40, setCanvasDimensions));

// Animation
let animationFrameRequestId;


// On small screens (e.g. phones), we want to "zoom out" so players can still see at least
// 800 in-game units of width.
function setCanvasDimensions() {
    const scaleRatio = Math.max(1, 800 / window.innerWidth);
    canvas.width = scaleRatio * window.innerWidth;
    canvas.height = scaleRatio * window.innerHeight;
}


// Note : Player itself is located at (canvas.width * 1/2, canvas.height * 1/5)
function render(renderData){
    //const { me, others, bullets } = getCurrentState();
    const mycenterX = canvas.width / 2;
    const mycenterY = canvas.height * 4 / 5;
    
    renderBackground(renderData.me);
    
    // Player
    renderPlayer(renderData.me, renderData.me, 0);

    // Spaces
    renderPlayer(renderData.me, renderData.spaces[0]);

    // Bullets
    //bullets.forEach(renderBullet.bind(null, me));
    renderBullet(renderData.me, renderData.bullets[0]);
    animationFrameRequestId = requestAnimationFrame(render);
}

function renderBackground(me) {
    const { x, y, health, rot } = me;
    // map y to canvas coordinate
    const y_in_canvas = canvas.height - y;
 
    const mycenterX = canvas.width / 2;
    const mycenterY = canvas.height * 4 / 5;
    const background_img = getAsset('background.jpg');
    
    // rotation
    context.save();
    context.translate(mycenterX, mycenterY);
    context.rotate(me.rot);
    context.translate(-mycenterX, -mycenterY);

    // Size of background image
    const bgw = MAP_SIZE + canvas.width  * 2;
    const bgh = MAP_SIZE + canvas.height * 2;
    let edge = MAP_SIZE * 1 / 2;


    context.drawImage(
        background_img,
        x, (MAP_SIZE - y) - edge * 1/5, //top left corner of img (sx, sy), note that MAP_SIZE = (bgh - canvas.height - y)
        canvas.width, canvas.height, //How big of the grab
        -edge , -edge , // put on the left corner on the window
        bgw, bgh + edge //size of what was grabed
    ); 
    context.restore();
    return [x, (MAP_SIZE - y)];
}



function renderPlayer(me, player, character=1) {
    const { x, y, health, rot } = player;
    
    // Rotate around center
    const mycenterX = canvas.width / 2;
    const mycenterY = canvas.height * 4 / 5;
    context.save();
    
    // Player x, y
    const canvasX = mycenterX + (x - me.x);
    const canvasY = mycenterY - (y - me.y);

    // me.rotation is background's job
    if(character != 0){
        context.translate(mycenterX, mycenterY);
        context.rotate(me.rot);
        context.translate(-mycenterX, -mycenterY);

        // rotate itself
        context.translate(canvasX, canvasY );
        context.rotate(- rot);
        context.translate(-canvasX, -canvasY );

    }

    // Health bar
    context.fillStyle = 'red';
    context.fillRect(
        canvasX - PLAYER_RADIUS,
        canvasY + PLAYER_RADIUS + 8,
        PLAYER_RADIUS * 2,
        2,
    );
    context.fillStyle = 'white';
    context.fillRect(
        canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * health/ PLAYER_MAX_HP,
        canvasY + PLAYER_RADIUS + 8,
        PLAYER_RADIUS * 2 * (1 - health / PLAYER_MAX_HP),
        2,
    );
    
    // Draw the ship / airplane, or maybe other (e.g., charcter 2 is alien.svg)
    let img = getAsset('airplane.svg');
    if (character != 0) {
        img = getAsset('ship.svg');
    }
    context.drawImage(
        img,
        canvasX - PLAYER_RADIUS,
        canvasY - PLAYER_RADIUS,
        PLAYER_RADIUS * 2,
        PLAYER_RADIUS * 2,
    );
    context.restore();
  }



function renderBullet(me, bullet) {
    const { x, y, rot } = bullet;

    // Rotate around center
    const mycenterX = canvas.width / 2;
    const mycenterY = canvas.height * 4 / 5;
    context.save();
    context.translate(mycenterX, mycenterY);
    context.rotate(me.rot - rot);
    context.translate(-mycenterX, -mycenterY);
    
    // Bullet x, y
    let canvasX = mycenterX + (x - me.x) - BULLET_RADIUS;
    let canvasY = mycenterY - ((y - me.y) - BULLET_RADIUS);

    // Draw the bullet
    context.drawImage(
        getAsset('bullet.svg'),
        canvasX,
        canvasY,
        BULLET_RADIUS * 10,
        BULLET_RADIUS * 10,
    );
    context.restore();
}



function renderMainMenu() {
    const t = Date.now() / 7500;
    const x = MAP_SIZE / 2 + 800 * Math.cos(t);
    const y = MAP_SIZE / 2 + 800 * Math.sin(t);
    renderBackground(x, y);
  
    // Rerun this render function on the next frame
    animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}

animationFrameRequestId = requestAnimationFrame(renderMainMenu);

// Replaces main menu rendering with game rendering.
export function startRendering(renderData) {
    cancelAnimationFrame(animationFrameRequestId);
    animationFrameRequestId = requestAnimationFrame(render(renderData));
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
    cancelAnimationFrame(animationFrameRequestId);
    animationFrameRequestId = requestAnimationFrame(renderMainMenu);
  }