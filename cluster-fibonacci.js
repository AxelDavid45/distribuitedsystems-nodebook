const server = require('fastify')({ logger: true })
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 4000

server.log.info(`worker pid=${process.pid}`)

server.get('/:limit', (req, reply) => {
  return String(fibonacci(Number(req.params.limit)))
})

server.listen(PORT, HOST, () => {
  server.log.info(`Producer running at http://${HOST}:${PORT}`)
})

function fibonacci (limit) {
  let prev = 1n
  let next = 0n
  let swap
  while (limit) {
    swap = prev
    prev = prev + next
    next = swap
    limit--
  }
  return next
}
