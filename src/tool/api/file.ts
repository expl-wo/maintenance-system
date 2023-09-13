import request from '@/_public/utils/request'

export function upload (data, config={}) {
    return request({
        url: '/api/file/upload',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data,
        config
    })
}

export function list (data) {
    return request({
        url: '/api/file/pageList',
        method: 'post',
        data,
    })
}
