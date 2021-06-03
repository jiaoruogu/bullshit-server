const { createConnection } = require('mysql')
const {MYSQL_CONF} = require('../conf/db')

const con = createConnection(MYSQL_CONF)


con.connect()

function exec(sql) {

  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        reject(err)
        return
      }

      resolve(result)
    })
  })
}

module.exports = {
  exec,
}