import request from '@/utils/request'
// 查询问题列表
export function getProblemList(data) {
    return request({
        url: '/api/evo-ims-overhaul/problem-base/page',
        method: 'post',
        data
    })
}
// 删除问题
export function delProblem(data) {
    return request({
        url: '/api/evo-ims-overhaul/problem-base/batch-delete',
        method: 'post',
        data: data.id
    })
}