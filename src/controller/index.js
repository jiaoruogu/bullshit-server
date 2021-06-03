const { exec } = require('../db/mysql');

const login = (username, password) => {
  let sql = `select username from users where username='${username}' and password='${password}'`;
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const search = (author) => {
  const sql = `select * from dream where author='${author}'`
  return exec(sql)
}

const add = (data) => {
  const {content, author } = data
  const createTime = Date.now()

  const sql = `
    insert into dream
    (content, createtime, author)
    values
    ('${content}', '${createTime}', '${author}')
  `

  return exec(sql).then(insertData => {
    return insertData.insertId
  })
}




module.exports = {
  login,
  search,
  add,
}