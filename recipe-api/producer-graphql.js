'use strict'
const Fastify = require('fastify')
const mercurius = require('mercurius')
const fs = require('fs')
const path = require('path')
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 4000

const app = Fastify({ logger: true })

const schema = fs.readFileSync(path.join(__dirname, '..', 'shared', 'graphql-schema.gql')).toString()

const resolvers = {
  Query: {
    pid: () => process.pid,
    recipe: async (_obj, { id }) => {
      if (id !== 42) throw new Error(`recipe ${id} not found`)
      return { id, name: 'Chicken Tikka Masala', steps: 'Throw it in a pot' }
    }
  },
  Recipe: {
    ingredients: async (obj) => {
      return (obj.id !== 42)
        ? []
        : [
            { id: 1, name: 'Chicken', quantity: '1 lb' },
            { id: 2, name: 'Sauce', quantity: '2 cups' }
          ]
    }
  }
}
app.register(mercurius, { schema, resolvers })

app.listen(PORT, HOST, () => {
  app.log.info(`Graphql Producer running at http://${HOST}:${PORT}/graphql`)
})
