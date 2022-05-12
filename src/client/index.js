import Client from './client'
import InputManager from './input';
import State from './state';
import render from './render';
import {startRendering} from './render';
import { downloadAssets } from './assets';
import './css/main.css';


// Get the dialog and btn
const playMenu = document.getElementById('dialog');
const playButton = document.getElementById('enter-game-btn');
const usernameInput = document.getElementById('username-input');

const renderData = {
  me: {
      x: 0,
      y: 0,
      rot:0.3,
      health: 90
  },
  spaces: [
      {
          x: 200,
          y: 400,
          rot: 3.14,
          health: 45
      }
  ],
  bullets: [
      {
          x: 0,
          y: 100,
          rot: 3.14
      }
  ]    
};


Promise.all([
  downloadAssets(),
  usernameInput.focus(),
]).then(() => {
  //playButton.onclick = () => {
    // Initialize
    playMenu.classList.add('invisible');
    let state = new State();
    
    //let inputmanager = InputManager();
    //inputmanager.attach();
    
    //startRendering();
    startRendering(renderData);

  //};
}).catch(console.error);

export default function initScript() {
  document.getElementById('enter-game-btn').addEventListener('click', () => {
    document.getElementById('loading-hover').style.display = 'block'
    document.getElementById('error-msg').style.display = 'none'
    const username = document.getElementById('username-input').value
    try {
      new Client(username).start()
    } catch (error) {
      document.getElementById('loading-hover').style.display = 'none'
      document.getElementById('error-msg').style.display = 'block'
      document.getElementById('error-msg').innerText = error.message
    }
    return false
  })
}

window.onload = initScript