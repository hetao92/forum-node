const fs = require('fs')
const {log} = require('../utils')

//确认操作文件已存在，否则先创建文件
const ensureExists = (path) => {
    if(!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path,data)
    }
}

//保存数据到文件
const save = (data, path) => {
    //格式化为缩进 2 个空格的形式
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

//文件读取
const load = (path) => {
    //指定参数
    const options = {
        encoding: 'utf8',
    }
    //读取前确保文件已存在，否则会报错
    ensureExists(path)
    //读取并返回
    const s = fs.readFileSync(path, options)
    return JSON.parse(s)
}

class Model {
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = require('path')
        const filename = `${classname}.txt`
        // 使用绝对路径
        const p = path.join(__dirname, '../db', filename)
        return p
    }

    static _newFromDict(dict) {
        const cls = this
        const m = new cls(dict)
        return m
    }
    static all() {
        //获取文件路径
        const path = this.dbPath()
        //读取文件
        const models = load(path)
        const ms = models.map((item) => {
            const cls = this
            const instance = cls._newFromDict(item)
            return instance
        })
        return ms
    }

    static create(form={}) {
        const cls = this
        const instance = new cls(form)
        instance.save()
        // save 以后，微博的数据就已经在数据库中了
        return instance
    }

    //查找 key 为 value 的实例，若没有则返回 null
    static findOne(key, value) {
        const all = this.all()
        let m = all.find((e) => {
            return e[key] === value
        })
        if(m === undefined) {
            m = null
        }
        return m
    }

    static find(key, value) {
        const all = this.all()
        const models = all.filter((m) => {
            return m[key] === value
        })
        return models
    }

    //根据id获取数据
    static get(id) {
        id = parseInt(id, 10)
        return this.findOne('id', id)
    }

    save() {
        const cls = this. constructor
        const models = cls.all()
        if(this.id === undefined) {
            if(models.length > 0) {
                const last = models[models.length - 1]
                this.id = last.id + 1
            } else {
                // 0 在 js 中会被处理为 false
                this.id = -1
            }
            models.push(this)
        } else {
            const index = modesl.findIndex((e) => {
                return e.id === this.id
            })
            if(index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save(models, path)
    }

    static remove(id) {
        const cls = this
        const models = cls.all()
        const index = models.findIndex((e) => {
            return e.id === id
        })
        if(index > -1) {
            models.splice(index, 1)
        }
        const path = cls.dbPath()
        save(models, path)
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

module.exports = Model