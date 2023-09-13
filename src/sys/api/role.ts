import request from '@/_public/utils/request'

export function getRoleList(data) {
    return request({
        url: '/api/admin/role/queryList',
        method: 'POST',
        data
    })
}

export function getUserRoleList(data) {
    return request({
        url: '/api/admin/userRole/queryList',
        method: 'POST',
        data
    })
}

export function insertRoleInfo(params) {
    return request({
        url: '/api/admin/role/insertOrUpdate',
        method: 'POST',
        data:params
    })
}

export function insertUserRoleInfo(params) {
    return request({
        url: '/api/admin/userRole/insertOrUpdate',
        method: 'POST',
        data:params
    })
}

export function deleteInfo(params) {
    return request({
        url: '/api/admin/role/delete',
        method: 'POST',
        data: params
    })
}

export function deleteUserRoleInfo(params) {
    return request({
        url: '/api/admin/userRole/delete',
        method: 'POST',
        data: params
    })
}
