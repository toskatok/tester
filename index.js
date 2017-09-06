/*
 * +===============================================
 * | Author:        Parham Alvani <parham.alvani@gmail.com>
 * |
 * | Creation Date: 06-09-2017
 * |
 * | File Name:     index.js
 * +===============================================
 */
const config = require('config')
const cluster = require('cluster')

if (cluster.isMaster) {
  let components = {}
  console.log(`** Bamboo Tester ${process.pid} **`)

  for (let i = 0; i < config.processes; i++) {
    cluster.fork()
  }

  process.on('SIGINT', () => {
    console.log('** Bamboo Tester Result **')
    console.log(components)
    process.exit()
  })

  cluster.on('message', (worker, message, handle) => {
    if (message.id in components) {
      components[message.id]++
    } else {
      components[message.id] = 0
      console.log(message.id)
    }
  })
} else {
  console.log(`> Bamboo Tester ${process.pid} started`)

  require('./src/tx.js')({
    host: config.connectivity.host,
    port: config.connectivity.port,
    interval: config.interval
  })

  require('./src/rx.js')({
    host: config.connectivity.host,
    port: config.connectivity.port
  }, (message, id) => {
    process.send({
      id
    })
  })
}
