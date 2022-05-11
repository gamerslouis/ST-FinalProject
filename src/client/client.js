import NetworkManager from './network'
import InputManager from './input'
import State from './state'

//import { startRendering, stopRendering } from './render';
//import { downloadAssets } from './assets';
//import './css/main.css';

export default class Client {
  constructor(username) {
    this.username = username;
    let network = new NetworkManager();
    let input = new InputManager(network.getSocket());
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
