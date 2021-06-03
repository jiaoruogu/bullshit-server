const env = process.env.NODE_ENV

let MYSQL_CONF, REDIS_CONF

if (env === 'development') {
  MYSQL_CONF = {  
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'bullshit',
  }

  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
} else {
  MYSQL_CONF = {
    host: '172.19.0.2',
    user: 'root',
    password: 'secret',
    port: '3306',
    database: 'myblog',
  }

  REDIS_CONF = {
    port: 6379,
    host: '172.19.0.5'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
}