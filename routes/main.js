const fs = require('fs')
const { log } = require('../utils')

const nunjucks = require('nunjucks')
const crypto = require('crypto')

const User = require('../models/user')
const session = require('../models/session')

//配置 loader，nunjucks会从目录中加载模板
const loader = new nunjucks.FileSystemLoader('templates', {
    //noCache: true 是关闭缓存，每次都会重新计算模板
    noCache: true,
})
//用 loader 创建一个环境，用这个环境可以读取模板文件
const env = new nunjucks.Environment(loader)

const currentUser = (request) => {
    const s = request.cookies.session || ''
    if(s.length > 0) {
        const r = session.decrypt(s)
        const uid = r.uid
        const u = User.findOne('id', uid)
        return u
    } else {
        return null
    }
}

const template = (path, data) => {
    const s = env.render(path, data)
    return s
}

const headerFromMapper = (mapper={}, code=200) => {
    let base = `HTTP/1.1 ${code} OK\r\n`
    const keys = Object.keys(mapper)
    const s = keys.map((k) => {
        const v = mapper[k]
        const h = `${k}: ${v}\r\n`
        return h
    }).join('')
    const header = base + s
    return header
}

const httpResponse = (body, headers=null) => {
    let mapper = {
        'Content-Type': 'text/html',
    }
    if(headers !== null) {
        mapper = Object.assign(mapper, headers)
    }
    const header = headerFromMapper(mapper)
    const res = header + '\r\n' + body
    return res
}
//图片响应
const static = (request) => {
    const filename = request.query.file || 'doge.gif'
    const path = `../static/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper()
    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

//重定向
//当浏览器收到 302响应时候会从 header 里获取 location 字段自动请求新 url
const redirect = (url) => {
    const headers = {
        Location: url,
    }
    const header = headerFromMapper(headers, 302)
    const r = header + '\r\n' + ''
    return r
}

//检测是否用户登陆
const loginRequired = (routeFunc) => {
    const func = (request) => {
        const u = currentUser(request)
        if(u === null) {
            return redirect('/login')
        } else {
            return routeFunc(request)
        }
    }
    return func
}

module.exports = {
    currentUser: currentUser,
    template: template,
    headerFromMapper: headerFromMapper,
    static: static,
    redirect: redirect,
    loginRequired: loginRequired,
    httpResponse: httpResponse,
}
