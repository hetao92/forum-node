const net = require('net')
const host = ''
const port = 7500
const client = new net.Socket()
client.connect(port,host,() => {
    console.log('connect to:',host,port)
    const request = 'GET / HTTP/1.1\r\nHost: hetao.com\r\n\r\n'
    client.write(request)
})

client.on('data',(data) => {
    console.log('data:',data.toString())
    client.destroy()
})
client.on('error',(error) => {
    console.log('error:',error)
})
client.on('close',function() {
    console.log('connection closed')
})