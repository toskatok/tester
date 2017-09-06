/*
 * +===============================================
 * | Author:        Parham Alvani <parham.alvani@gmail.com>
 * |
 * | Creation Date: 06-09-2017
 * |
 * | File Name:     src/rx.js
 * +===============================================
 */
const BambooComponent = require('@ibamboo/component')

module.exports = function (options, callback) {
  const bc = new BambooComponent({
    mqttHost: options.host,
    mqttPort: options.port,
    name: 'tester',
    subscribes: ['log']
  })
  bc.on('ready', () => {
    console.log(` * MQTT at ${options.host}:${options.port}`)
  })
  bc.on('log', (message) => {
    callback(message, bc.id)
  })
}
