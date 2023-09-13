import request from '@/_public/utils/request'

export function getParamList(data) {
    return request({
        url: '/api/admin/param/getList',
        method: 'POST',
        data
    })
}

export function insertOrUpdateParam(data) {
    return request({
        url: '/api/admin/param/insertOrUpdate',
        method: 'POST',
        data
    })
}

export function deleteParam(data) {
    return request({
        url: '/api/admin/param/delete',
        method: 'POST',
        data
    })
}
