import request from '@/_public/utils/request'

export function getPermissionList(data) {
    return request({
        url: '/api/admin/permission/queryTree',
        method: 'GET',
        data
    })
}

export function insertPermissionInfo(params) {
    return request({
        url: '/api/admin/permission/insertOrUpdate',
        method: 'POST',
        data:params
    })
}

export function insertPermRoleInfo(params) {
    return request({
        url: '/api/admin/rolePerm/save',
        method: 'POST',
        data: params
    })
}

export function togglePEnabled(params) {
    return request({
        url: '/api/admin/permission/togglePEnabled',
        method: 'GET',
        data:params
    })
}

export function getRolePermids(params) {
    return request({
        url: '/api/admin/permission/queryIds',
        method: 'GET',
        data:params
    })
}

export function deleteInfo(params) {
    return request({
        url: '/api/admin/permission/remove',
        method: 'GET',
        data: params
    })

}
