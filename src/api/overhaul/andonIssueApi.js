import request from '@/utils/request'
//安灯分类查询
export function getAndonType(data) {
    return request({
        url: '/api/evo-ims-link/andon/query/category',
        method: 'get',
        data
    })
}
//安灯异常项查询
export function getAndonIssue(data) {
    return request({
        url: '/api/evo-ims-link/andon/query/abnormal',
        method: 'get',
        data
    })
}
//查询问题列表
export function getAndonIssuePage(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure-problem/query-page',
        method: 'POST',
        data
    })
}
//安灯状态查询
export function getAndonStatus(data) {
    return request({
        url: '/api/evo-ims-link/andon/triggerList/query',
        method: 'get',
        data
    })
}
