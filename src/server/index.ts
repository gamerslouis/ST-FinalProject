import app from './server'
import io from './socket'

const port = process.env.PORT || 3000
const server = app.listen(port)
io.attach(server)
console.log(`Server listening on port ${port}`)
