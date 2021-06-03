const { createClient } = require('redis');
const { REDIS_CONF } = require('../conf/db');


const client = createClient(REDIS_CONF.port, REDIS_CONF.host)

const set = (key, val) => {
  if(typeof val === 'object') {
    val = JSON.stringify(val)
  }
  client.set(key, val)
}

const get = key => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, val) => {
      if (err) {
        reject(err)
      }
      if (val === null) {
        resolve(null)
      }

      try {
        // 如果存得是对象字符串直接正确返回，如果是字符串catch里面返回
        resolve(JSON.parse(val))
      } catch (error) {
        resolve(val)
      }
    })
  })
}

module.exports = {
  get,
  set,
}
