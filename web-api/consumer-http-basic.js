const server = require('fastify')()
const fetch = require('node-fetch')
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3000
const TARGET = process.env.TARGET || 'localhost:4000'

server.get('/', async (req, reply) => {
  const request = await fetch(`http://${TARGET}/recipes/42`)
  const producerData = await request.json()

  return {
    consumer_pid: process.pid,
    producer_data: producerData
  }
})

server.listen(PORT, HOST, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}`)
})
