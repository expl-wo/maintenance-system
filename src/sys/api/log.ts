import request from "@/_public/utils/request";

export function page(data) {
    return request({
        url: '/api/admin/log/page',
        method: 'post',
        data
    })
}