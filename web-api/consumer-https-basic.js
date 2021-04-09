const server = require('fastify')({ logger: true })
const fetch = require('node-fetch')
const https = require('https')
const fs = require('fs')
const path = require('path')
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3000
const TARGET = process.env.TARGET || 'localhost:4000'

const options = {
  agent: new https.Agent({
    ca: fs.readFileSync(path.join(__dirname, '..', 'shared', 'tls', 'ca-certificate.cert'))
  })
}
server.get('/', async (req, reply) => {
  const request = await fetch(`https://${TARGET}/recipes/42`, options)
  const producerData = await request.json()

  return {
    consumer_pid: process.pid,
    producer_data: producerData
  }
})

server.listen(PORT, HOST)
