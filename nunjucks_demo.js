const nunjucks = require('nunjucks')

//path 是存放模板的目录
const env =  nunjucks.configure('templates')

const ns = [10, 20, 30]
const us = [
    {
        id: 1,
        name: 'gua',
    },
    {
        id: 2,
        name: 'hetao'
    }
]

const ts = []

//render 方法接收两个参数
//第一个为模板文件的名称
//第二个为相应的数据

const r = env.render('demo.html', {
    name: 'hetao',
    numbers: ns,
    users: us,
    todos: ts,
    show: true,
})

console.log(r)