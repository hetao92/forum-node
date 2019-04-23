const crypto = require('crypto')

const testMd5 = function(s) {
    //选择 md5 摘要算法
    let algorithm = 'md5'
    //创建 hash 对象
    let hash = crypto.createHash(algorithm)
    //更新 hash 对象
    hash.update(s)
    console.log('md5 摘要', hash.digest('hex'))
}

let testSha1 = function (s) {
    let algorithm = 'sha1'
    let hash = crypto.createHash(algorithm)
    hash.update(s)
    console.log('sha1 摘要', hash.digest('hex'))
}

function saltedPassword(password, salt='') {
    function _md5hex(s) {
        let hash = crypto.createHash('md5')
        hash.update(s)
        return hash.digest('hex')
    }
    let hash1 = _md5hex(password)
    let hash2 = _md5hex(hash1 + salt)
    console.log('hashed password', hash1, hash2)
    return hash2
}

let testSalt = function() {
    saltedPassword('12345', '')
    saltedPassword('12345', 'abc')
}

let testRaw = function() {
    function hashedPassword(password) {
        let hash = crypto.createHash('md5')
        hash.update(password)
        let pwd = hash.digest('hex')
        return pwd
    }
    console.time('find password')
    const pwd = '81dc9bdb52d04dc20036dbd8313ed055'
    for (var i = 0; i < 10000; i++) {
        var s = String(i)
        var password = hashedPassword(s)
        if (password === pwd) {
            console.log('原始密码是', s)
            break
        }
    }
    console.timeEnd('find password')
}

let testEncrypt = function(s, key) {
    let algorithm = 'aes-256-cbc'
    let cipher = crypto.createCipher(algorithm, key)
    let c = cipher.update(s, 'utf8', 'hex')
    c += cipher.final('hex')
    console.log('加密后的信息', c)
    return c
}

let testDecrypt = function(c, key) {
    let algorithm = 'aes-256-cbc'
    let decipher = crypto.createDecipher(algorithm, key)
    //必须用这种累加的方式处理
    //调用 update 函数后，返回不一定是加密后的数据
    //所以要调用 update，再调用 final，并累加起来
    let d = decipher.update(c, 'hex', 'utf8')
    d += decipher.final('utf8')
    console.log('原始信息', d)
}

let test = function() {
    // 要加密的是 'gua'
    let s = 'gua'
    testMd5(s)
    testSha1(s)
    testSalt()
    //
    // 对称加密的加密和解密用的是同一个 key
    // let key = 'dududu'
    // let c = testEncrypt(s, key)
    // testDecrypt(c, key)
    //
    // testRaw()

    let hashes = crypto.getHashes()
    let ciphers = crypto.getCiphers()

    // console.log('hashes and ciphers method', hashes, ciphers)
}

test()