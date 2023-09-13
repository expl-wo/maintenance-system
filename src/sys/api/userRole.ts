import request from "@/_public/utils/request";

export function saveUserRoleDataPermOrg(data){
    return request({
        url: '/api/admin/userRole/saveUserRoleDataPermOrg',
        method: 'POST',
        data
    })
}

export function saveUserRoleDataPermOrgBatch(data){
    return request({
        url: '/api/admin/userRole/saveUserRoleDataPermOrgBatch',
        method: 'POST',
        data
    })
}
