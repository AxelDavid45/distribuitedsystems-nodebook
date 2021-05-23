'use strict'
const cluster = require('cluster')
const { join } = require('path')

console.log(`master pid=${process.pid}`)
cluster.setupMaster({
  exec: join(__dirname, 'cluster-fibonacci.js')
})
cluster.fork()
cluster.fork()

cluster
  .on('disconnect', worker => {
    console.log('disconnect', worker.pid)
  })
  .on('exit', (worker, code, signal) => {
    console.log('exit', worker.id, code, signal)
    cluster.fork()
  })
  .on('listening', (worker, { address, port }) => {
    console.log('listening', worker.id, `${address}:${port}`)
  })
