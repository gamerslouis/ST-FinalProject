import NetworkManager from './network'
import InputManager from './input'
import State from './state'

//import { startRendering, stopRendering } from './render';
//import { downloadAssets } from './assets';
//import './css/main.css';

export default class Client {
  constructor(username) {
    this.username = username;
    this.network = new NetworkManager();
    this.input = new InputManager(this.network.getSocket());
  }

  start() {
    Promise.all([
      network.connect(),
      //downloadAssets(),
    ]).then(() => {
      let state = new State();
      input.attach();
      //startRendering();
    });
  }

  gameOver() {
    input.dettach();
    //stopRendering();
  }
}
