import request from '@/_public/utils/request'

export function getDictList(data) {
    return request({
        url: '/api/admin/dict/getList',
        method: 'POST',
        data
    })
}


export function getListByItemCode(data) {
    return request({
        url: '/api/admin/dict/getListByItemCode',
        method: 'POST',
        data
    })
}

export function insertOrUpdateDict(data) {
    return request({
        url: '/api/admin/dict/insertOrUpdate',
        // url: '/api/admin/dict',
        method: 'POST',
        data
    })
}

export function deleteDict(data) {
    return request({
        url: '/api/admin/dict/delete',
        method: 'POST',
        data
    })
}
