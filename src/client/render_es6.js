
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

export default class Render {
    constructor(canvas, window) {
        this.window = window;
        this.canvas = canvas;
        this.contex = canvas.getContext('2d');

        // Don't use arrow function : https://localcoder.org/using-es6-arrow-functions-inside-class
        this.render = this.render.bind(this);
        this.startRendering = this.startRendering.bind(this);
        this.stopRendering = this.stopRendering.bind(this);
        
        this.renderBackground = this.renderBackground.bind(this);
        this.renderPlayer = this.renderPlayer.bind(this);
        this.renderBullet = this.renderBullet.bind(this);
    }

    setCanvasDimensions = () => {
        const scaleRatio = Math.max(1, 800 / this.window.innerWidth);
        this.canvas.width = scaleRatio * this.window.innerWidth;
        this.canvas.height = scaleRatio * this.window.innerHeight;
    }

    render(renderData){
        // Note : Player itself is located at (canvas.width * 1/2, canvas.height * 1/5)
        
        //const { me, others, bullets } = getCurrentState();     
        this.renderBackground(renderData.me);
        
        // Player
        this.renderPlayer(renderData.me, renderData.me, 0);

        // Spaces
        this.renderPlayer(renderData.me, renderData.spaces[0]);
        // others.forEach(renderPlayer.bind(null, me));

        // Bullets
        this.renderBullet(renderData.me, renderData.bullets[0]);
        //bullets.forEach(renderBullet.bind(null, me));

        animationFrameRequestId = requestAnimationFrame(this.render);
    }

    renderBackground(me){
        const { x, y, health, rot } = me;
    
        const mycenterX = this.canvas.width / 2;
        const mycenterY = this.canvas.height * 4 / 5;
        const background_img = getAsset('background.jpg');
        
        // rotation
        this.context.save();
        this.context.translate(mycenterX, mycenterY);
        this.context.rotate(me.rot);
        this.context.translate(-mycenterX, -mycenterY);

        // Size of background image
        const bgw = MAP_SIZE + this.canvas.width  * 2;
        const bgh = MAP_SIZE + this.canvas.height * 2;
        const edge = MAP_SIZE * 1 / 2;

        this.context.drawImage(
            background_img,
            x, (MAP_SIZE - y) - edge * 1 / 5, //top left corner of img (sx, sy), note that MAP_SIZE = (bgh - canvas.height - y)
            this.canvas.width, this.canvas.height, //How big of the grab
            -edge , -edge , // put on the left corner on the window
            bgw, bgh + edge //size of what was grabed
        ); 
        this.context.restore();
        return [x, (MAP_SIZE - y)];
    }

    renderPlayer(me, player, character=1) {
        const { x, y, health, rot } = player;
        
        // Rotate around center
        const mycenterX = this.canvas.width / 2;
        const mycenterY = this.canvas.height * 4 / 5;
        this.context.save();
        
        // Player x, y
        const canvasX = mycenterX + (x - me.x);
        const canvasY = mycenterY - (y - me.y);

        // me.rotation is background's job
        if(character != 0){
            this.context.translate(mycenterX, mycenterY);
            this.context.rotate(me.rot);
            this.context.translate(-mycenterX, -mycenterY);

            // rotate itself
            this.context.translate(canvasX, canvasY );
            this.context.rotate(- rot);
            this.context.translate(-canvasX, -canvasY );

        }

        // Health bar
        this.context.fillStyle = 'red';
        this.context.fillRect(
            canvasX - PLAYER_RADIUS,
            canvasY + PLAYER_RADIUS + 8,
            PLAYER_RADIUS * 2,
            2,
        );
        this.context.fillStyle = 'white';
        this.context.fillRect(
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
        this.context.drawImage(
            img,
            canvasX - PLAYER_RADIUS,
            canvasY - PLAYER_RADIUS,
            PLAYER_RADIUS * 2,
            PLAYER_RADIUS * 2,
        );
        this.context.restore();
    }

    renderBullet(me, bullet) {
        const { x, y, rot } = bullet;

        // Rotate around center
        const mycenterX = this.canvas.width / 2;
        const mycenterY = this.canvas.height * 4 / 5;

        // Rotate
        this.context.save();
        this.context.translate(mycenterX, mycenterY);
        this.context.rotate(me.rot - rot);
        this.context.translate(-mycenterX, -mycenterY);
        
        // Get Bullet x, y
        let canvasX = mycenterX + (x - me.x) - BULLET_RADIUS;
        let canvasY = mycenterY - ((y - me.y) - BULLET_RADIUS);

        // Draw the bullet
        this.context.drawImage(
            getAsset('bullet.svg'),
            canvasX,
            canvasY,
            BULLET_RADIUS * 10,
            BULLET_RADIUS * 10,
        );
        this.context.restore();
    }


    renderMainMenu() {
        const t = Date.now() / 7500;
        const x = MAP_SIZE / 2 + 800 * Math.cos(t);
        const y = MAP_SIZE / 2 + 800 * Math.sin(t);
        this.renderBackground(x, y);
    
        // Rerun this render function on the next frame
        animationFrameRequestId = requestAnimationFrame(this.renderMainMenu);
    }

    animationFrameRequestId = requestAnimationFrame(this.renderMainMenu);

    // Replaces main menu rendering with game rendering.
    startRendering(renderData) {
        cancelAnimationFrame(animationFrameRequestId);
        animationFrameRequestId = requestAnimationFrame(this.render(renderData));
    }

    // Replaces game rendering with main menu rendering.
    stopRendering() {
        cancelAnimationFrame(animationFrameRequestId);
        animationFrameRequestId = requestAnimationFrame(this.renderMainMenu);
    }
}
