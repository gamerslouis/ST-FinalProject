import { io } from 'socket.io-client'

const socketProtocol = window.location.protocol.includes('https') ? 'wss' : 'ws'

class NetworkManager {
  async connect() {
    this.socket = io(`${socketProtocol}://${window.location.host}`, {
      reconnection: false,
    })
    this.connectedPromise = new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        console.log('Connected to server!')
        resolve()
      })
      this.socket.on('connect_error', (err) => {
        reject(err)
      })
    })
    await this.connectedPromise
  }

  getSocket() {
    return this.socket
  }
}

export default async function connect() {
  const manager = new NetworkManager()
  await manager.connect()
  return manager
}
