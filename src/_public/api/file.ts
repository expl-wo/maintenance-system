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

export function initMultipart (data, config={}) {
    return request({
        url: '/api/file/multipart/create',
        method: 'post',
        data,
    })
}

export function completeMultipart (data, config={}) {
    return request({
        url: '/api/file/multipart/complete',
        method: 'post',
        data,
    })
}

export function list (data) {
    return request({
        url: '/api/file/pageList',
        method: 'post',
        data,
    })
}

export function deleteFile (data) {
    return request({
        url: '/api/file/delete',
        method: 'post',
        data,
    })
}