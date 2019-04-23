const {log} = require('../utils')
const {
    session,
    currentUser,
    template,
    headerFromMapper,
    redirect,
    loginRequired,
} = require('./main')
const Todo = require('../models/todo')

const index = (request) => {
    const headers = {
        'Content-Type': 'text/html'
    }
    const u = currentUser(request)
    const models = Todo.all()
    const body = template('todo_index.html', {
        todos: models,
    })
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const add = (request) => {
    if(request.method === 'POST') {
        const form = request.form()
        const u = currentUser(request)
        form.user_id = u.id
        const t = Todo.create(form)
        t.save()
    }
    return redirect('/todo')
}

const edit = (request) => {
    const u = currentUser(request)
    const id = Number(request.query.id)
    const headers = {
        'Content-Type': 'text/html',
    }
    const todo = Todo.get(id)
    const body = template('todo_edit.html', {
        todo: todo
    })
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const del = (request) => {
    const id = Number(request.query.id)
    Todo.remove(id)
    return redirect('/todo')
}

const update = (request) => {
    if(request.method === 'POST') {
        const form = request.form()
        const u = currentUser(request)
        const userId = u.id
        const id = Number(form.id)
        const todo = Todo.get(id)
        const todo_userId = todo.user_id
        log('before', form)
        if(userId === todo_userId) {
            Todo.update(form)
        } else {
            return redirect('/todo')
        }
    }
    return redirect('/todo')
}

const routeMapper = {
    '/todo': loginRequired(index),
    '/todo/add': add,
    '/todo/delete': del,
    '/todo/edit': edit,
    '/todo/update': update,
}
module.exports = routeMapper