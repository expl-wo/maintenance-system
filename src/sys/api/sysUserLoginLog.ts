import request from '@/_public/utils/request'

export function getPageList(data) {
    return request({
        url: '/api/admin/sysUserLoginLog/page',
        method: 'POST',
        data
    })
}