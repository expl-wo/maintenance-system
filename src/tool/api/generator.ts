import request from '@/_public/utils/request'

export function page (query) {
    return request({
        url: '/api/generator/code/generator/page',
        method: 'post',
        data: query
    })
}

export function dbs () {
    return request({
        url: '/api/generator/code/generator/dbs',
        method: 'get'
    })
}

export function generateCode (tables) {
    const data = { tables }
    return request({
        url: '/api/generator/code/generator/build',
        method: 'post',
        data,
        config: {
            responseType: 'blob' // 表明返回服务器返回的数据类型'
        }
    })
}
