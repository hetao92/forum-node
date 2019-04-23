const {
    template,
    httpResponse,
} = require('./main')

const Message = require('../models/message')

const message = (request) => {
    if(request.method === 'POST') {
        const form = request.form()
        const m = Message.create(form)
        m.save()
    }
    const ms = Message.all()
    const body = template('message.html', {
        messages: ms,
    })
    return httpResponse(body)
}

const routeIndex = {
    '/message': message
}

module.exports = routeIndex