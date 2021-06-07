const { createConnection, createPool } = require('mysql')
const {MYSQL_CONF} = require('../conf/db')

// const con = createConnection(MYSQL_CONF)


// con.connect()

// function exec(sql) {

//   return new Promise((resolve, reject) => {
//     con.query(sql, (err, result) => {
//       if (err) {
//         console.error(err);
//         reject(err)
//         return
//       }

//       resolve(result)
//     })
//   })
// }


// 连接池的形式连接
const pool = createPool({
  connectionLimit: 10,
  ...MYSQL_CONF
})

function exec(sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, con) => {
      if(err) {
        reject(err)
        return
      }
      con.query(sql, (error, result) => {
        con.release()
        resolve(result)
        if (error) reject(error)

      })
    })
  });
}
module.exports = {
  exec,
}