'use strict'
const path = require('path')
const grpc = require('@grpc/grpc-js')
const loader = require('@grpc/proto-loader')
const pkgDef = loader.loadSync(path.join(__dirname, '..', 'shared', 'grpc-recipe.proto'))

const recipe = grpc.loadPackageDefinition(pkgDef).recipe

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 4000

const server = new grpc.Server()
server.addService(recipe.RecipeService.service, {
  getMetaData: (_call, cb) => {
    cb(null, {
      pid: process.pid
    })
  },
  getRecipe: (call, cb) => {
    if (call.request.id !== 42) {
      return cb(new Error(`unknown recipe ${call.request.id}`))
    }
    cb(null, {
      id: 42,
      name: 'Chicken chicken',
      steps: 'Throw it in a pot',
      ingredients: [
        { id: 1, name: 'Chicken', quantity: '1 lb' },
        { id: 2, name: 'Chicken', quantity: '2 cups' }
      ]
    })
  }
})

server.bindAsync(`${HOST}:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err
    server.start()
    console.log(`Producer runnig at http://${HOST}:${PORT}`)
  }
)
