const Model = require('./main')
const User = require('./user')

class Weibo extends Model {
    constructor(form={}, user_id=-1) {
        super()
        this.id = form.id
        this.content = form.content || ''
        this.user_id = Number(form.user_id || user_id)
    }

    user() {
        const u = User.findOne('id', this.user_id)
        return u
    }

    comments() {
        //如果引用放在最上面，会出现循环引用的情况，导致 Comment 里的 User 为 null
        const Comment = require('./comment')
        const cs = Comment.find('weibo_id', this.id)
        return cs
    }
}

module.exports = Weibo