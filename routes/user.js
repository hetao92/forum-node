
const { log, randomStr } = require('../utils')
const {
    currentUser,
    template,
    loginRequired,
    redirect,
    httpResponse,
} = require('./main')

const session = require('../models/session')
const User = require('../models/user')

const login = (request) => {
    const headers = {}
    let result
    if(request.method === 'POST') {
        const form = request.form()
        const u = User.findOne('username', form.username)
        if(u !== null && u.validateAuth(form)) {
            const form = {
                uid: u.id,
            }
            const s = session.encrypt(form)
            headers['Set-Cookie'] = `session=${s}`
            result = '登陆成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const u = currentUser(request)
    let username
    if(u === null) {
        username = ''
    } else {
        username = u.username
    }
    let body = template('login.html', {
        username: username,
        result: result,
    })
    return httpResponse(body, headers)
}

const register = (request) => {
    let result
    if(request.method === 'POST') {
        const form = request.form()
        const u = User.register(form)
        if(u !== null) {
            result = `注册成功`
        } else {
            result = '用户名和密码长度必须大于2或者用户名已经存在'
        }
    } else {
        result = ''
    }
    const us = User.all()
    const body = template('register.html', {
        result: result,
        users: us,
    })
    return httpResponse(body)
}

const profile = (request) => {
    const u = currentUser(request)
    let body = template('profile.html', {
        user: u
    })
    return httpResponse(body)
}

const admin_users = (request) => {
    const u = currentUser(request)
    const role = u.role
    if(role === 1) {
        const users = User.all()
        let body = template('admin_users.html', {
            users: users
        })
        return httpResponse(body)
    } else {
        return redirect('/login')
    }
}

const admin_users_update = (request) => {
    if(request.method === 'POST') {
        const form = request.form()
        const id = Number(form.user_id)
        const user = User.findOne('id',id)
        user.password = User.saltedPassword(form.user_password)
        user.save()
        return redirect('/admin/users')
    }
}
const routeUser = {
    '/login': login,
    '/register': register,
    '/profile': loginRequired(profile),
    '/admin/users':admin_users,
    '/admin/user/update':admin_users_update,
}

module.exports = routeUser