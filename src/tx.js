/*
 * +===============================================
 * | Author:        Parham Alvani <parham.alvani@gmail.com>
 * |
 * | Creation Date: 06-09-2017
 * |
 * | File Name:     src/tx.js
 * +===============================================
 */
const bamboo = require('@ibamboo/rpi.js')

module.exports = function (options) {
  const client = new bamboo.BambooClient(`mqtt://${options.host}:${options.port}`, 'bamboo', 'Tester')
  client.on('ready', () => {
    console.log(client.hash)
  })

  let t = client.addThing('1', '.bamboo.tester')
  setInterval(() => {
    t.log({
      sendTime: Date.now()
    })
  }, options.interval)
}
