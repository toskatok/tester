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
const chalk = require('chalk')

if (cluster.isMaster) {
  let components = {}
  let logs = 0

  console.log(`** ${chalk.rgb(0, 255, 127)('Bamboo Tester')} ${process.pid} **`)

  for (let i = 0; i < config.processes; i++) {
    cluster.fork()
  }

  process.on('SIGINT', () => {
    console.log('** Bamboo Tester Result **')

    for (let component in components) {
      console.log(`> ${chalk.rgb(255, 255, 102)(component)}: ${chalk.rgb(246, 105, 134)(components[component])}`)
    }

    console.log(logs)
    process.exit()
  })

  cluster.on('message', (worker, message, handle) => {
    if (message.type === 'tx') {
      logs = logs + 1
    }
    if (message.type === 'rx') {
      if (message.id in components) {
        components[message.id]++
      } else {
        components[message.id] = 0
        console.log(message.id)
      }
    }
  })
} else {
  console.log(`> Bamboo Tester ${process.pid} started`)

  require('./src/tx.js')({
    host: config.connectivity.host,
    port: config.connectivity.port,
    interval: config.interval
  }, () => {
    process.send({
      type: 'tx'
    })
  })

  require('./src/rx.js')({
    host: config.connectivity.host,
    port: config.connectivity.port
  }, (message, id) => {
    process.send({
      type: 'rx',
      id
    })
  })
}
