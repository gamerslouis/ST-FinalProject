
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');
const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;;

// Get the canvas graphics context
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let animationFrameRequestId;
export default function render(renderData){
    //const { me, others, bullets } = getCurrentState();
    setCanvasDimensions();
    
    // Draw Player
    renderPlayer(renderData.me, renderData.me, 0);

    renderPlayer(renderData.me, renderData.spaces[0]);

    // Draw bullets
    //bullets.forEach(renderBullet.bind(null, me));
    renderBullet(renderData.me, renderData.bullets[0]);
    
}


function setCanvasDimensions() {
    // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
    // 800 in-game units of width.
    const scaleRatio = Math.max(1, 800 / window.innerWidth);
    canvas.width = scaleRatio * window.innerWidth;
    canvas.height = scaleRatio * window.innerHeight;
}


// Note : Player itself is located at (canvas.width * 1/2, canvas.height * 1/5)
function renderPlayer(me, player, charcter=1) {
    const { x, y, direction } = player;
    const canvasX = canvas.width / 2 + (x - me.x);
    const canvasY = canvas.height - (canvas.height * (1 / 5) + (y - me.y));
  
    // Draw health bar
    context.fillStyle = 'red';
    context.fillRect(
        canvasX - PLAYER_RADIUS,
        canvasY + PLAYER_RADIUS + 8,
        PLAYER_RADIUS * 2,
        2,
    );
    context.fillStyle = 'white';
    context.fillRect(
        canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.health/ PLAYER_MAX_HP,
        canvasY + PLAYER_RADIUS + 8,
        PLAYER_RADIUS * 2 * (1 - player.health / PLAYER_MAX_HP),
        2,
    );

    // Draw ship
    context.save();
    //context.translate(canvasX, canvasY);
    //context.rotate(3.28 - direction);
    let img = getAsset('ship.svg');
    if (charcter == 0) {
        img = getAsset('airplane.svg');
    }
    context.drawImage(
        img,
        canvasX - PLAYER_RADIUS,
        canvasY - PLAYER_RADIUS,
        PLAYER_RADIUS * 2,
        PLAYER_RADIUS * 2,
    );

  }



function renderBullet(me, bullet) {
    const { x, y } = bullet;
    let centerX = canvas.width / 2 + (x - me.x) - BULLET_RADIUS;
    let centerY = canvas.height - (canvas.height * (1 / 5) + (150 - me.y) - BULLET_RADIUS);
    
    // use a grren circle as bullet
    /*
    context.beginPath();
    context.arc(centerX, centerY, BULLET_RADIUS * 2, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    */
    
    // bullet
    context.drawImage(
        getAsset('bullet.svg'),
        centerX,
        centerY,
        BULLET_RADIUS * 10,
        BULLET_RADIUS * 10,
    );
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
export function startRendering() {
    cancelAnimationFrame(animationFrameRequestId);
    animationFrameRequestId = requestAnimationFrame(render);
  }