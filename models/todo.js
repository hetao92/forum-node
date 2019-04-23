const Model = require('./main')
const {log} = require('../utils')

class Todo extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.title = form.title || ''
        this.done = false
        this.user_id = form.user_id
        this.create_time = form.create_time || Date.now()
        this.update_time = form.update_time || Date.now()
    }

    static update(form) {
        const id = Number(form.id)
        const t = this.get(id)
        t.title = form.title
        t.save()
    }
}

//测试用例
const testAdd = () => {
    const form = {
        title: 'test add'
    }
    const t = Todo.create(form)
    t.save()
}

const testDelete = () => {
    const form = {
        title: 'water',
        id: 0
    }
    const t = Todo.create(form)
    t.remove(form.id)
}

const testUpdate = () => {
    const form = {
        title: '睡觉',
        id: 1
    }
    const t = Todo.findOne('id', form.id)
    t.title = form.title
    t.done = false
    t.save()
}

const test = () => {
    testAdd()
    // testDelete()
    // testUpdate()
}
if(require.main === module) {
    test()
}

module.exports = Todo