const net = require('net')
const fs = require('fs')

const Request = require('./request')
const {error, log} = require('./utils')

const routeIndex = require('./routes/index')
const routeUser = require('./routes/user')
const routeMessage = require('./routes/message')
const routeTodo = require('./routes/todo')
const routeWeibo = require('./routes/weibo')

const responseFor = (raw, request) => {
    const route = {}
    const routes = Object.assign(route, routeIndex, routeUser, routeMessage, routeTodo, routeWeibo)
    const response = routes[request.path] || error
    return response(request)
}

const processRequest = (data, socket) => {
    const raw = data.toString('utf8')
    const request = new Request(raw)
    const response = responseFor(raw, request)
    socket.write(response)
    socket.destroy()
}

const run = (host='', port=3000) => {
    //创建一个服务器
    const server = new net.Server()
    //开启服务器监听连接
    server.listen(port, host, () => {
        const  address = server.address()
    })

    server.on('connection', (s) => {
        s.on('data', (data) => {
            processRequest(data, s)
        })
    })
    server.on('error', (error) => {
        log('server error', error)
    })
    server.on('close', () => {
        log('server closed')
    })
}

const _main = () => {
    run('127.0.0.1', 5000)
}

if(require.main === module) {
    _main()
}