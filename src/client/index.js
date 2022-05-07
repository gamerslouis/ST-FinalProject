import Client from './client'

export default function initScript() {
  document.getElementById('enter-game-btn').addEventListener('click', ()=>{
    new Client().connect()
  })
}

window.onload = initScript
