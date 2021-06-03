const http = require('http');
const querystring = require('querystring')
const fs = require('fs');
const { login,search,add } = require('./src/controller');
const {get, set} = require('./src/db/redis');

const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => {
      data += chunk.toString()
    })

    req.on('end', () => {
      if(!data) {
        resolve({})
      }

      resolve(JSON.parse(data))
    })
  })
}

// 获取cookie的过期时间,
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (5*60*1000))
  return d.toGMTString()
}

const app = http.createServer(async (req, res) => {
  try {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')
    const url = req.url
    const METHOD = req.method
    req.path = url.split('?')[0]
    // 解析query
    req.query = querystring.parse(url.split('?').length > 1 ? url.split('?')[1] : null)
    let postData = {}
    if (METHOD === 'POST') {
      postData = await getPostData(req)
      req.body = postData
    }

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').map(item => {
      if(!item) return 
      const arr = item.split('=')
      const key = arr[0].trim()
      const value = arr[1].trim()
      req.cookie[key] = value
    })


    // 解析session
    let needSetCookie = false
    let userId = req.cookie.userid
    if(!userId) {
      needSetCookie = true
      userId = `${Date.now()}_${Math.random()}`
      // 初始化session
      set(userId, {})
    }


    // 获取session
    req.sessionId = userId
    const sessionResult = await get(req.sessionId)
    if (sessionResult === null) {
      set(req.sessionId, {})
      req.session = {}
    } else {
      req.session = sessionResult
    }



    if (needSetCookie) {
      res.setHeader('set-cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
    }


    if (METHOD === 'GET' && req.path === '/api/search') {
      if(!req.session.username) {
        res.end(JSON.stringify({
          code: -1,
          message: '尚未登录！'
        }))
        return 
      }
      const author = req.session.username || undefined
      const searchResult = await search(author)
      res.end(JSON.stringify(searchResult))
      return
    }
    
    if (METHOD === 'POST' && req.path === '/api/login') {
      const {username, password} = req.body
      const loginResult = await login(username, password)
      
      if (loginResult) {
        req.session.username = loginResult.username
        set(req.sessionId, req.session)
        res.end(JSON.stringify(loginResult))
      } else {
        res.end(JSON.stringify({
          code: -1,
          message: '登录失败！'
        }))
      }
      return
    
    }

    if (METHOD === 'POST' && req.path === '/api/add') {
      if(!req.session.username) {
        res.end(JSON.stringify({
          code: -1,
          message: '尚未登录！'
        }))
        return
      }
      req.body.author = req.session.username
      const addResult = await add(req.body)
    
      res.end(JSON.stringify(addResult))
      return
    
    }

    res.writeHead(404, {'Content-type': 'text/plain'})
    res.write('404')
    res.end()
    
  } catch(e) {
    res.end(JSON.stringify({
      code: -1,
      message: '服务器发生意外错误！'
    }))
    fs.appendFile('error.log', `${new Date().toString()}  ${req.url} ---> ${e.toString()}\n`, err => {
      if(err) console.log('i have no idea');
    })
  }
  

})

app.listen(3000)