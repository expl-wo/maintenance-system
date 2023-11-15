import request from '@/utils/request'
//添加勘查工单
export function addWorkOrder(data) {
    return request({
        url: '/evo-ims-overhaul/work-order/add',
        method: 'post',
        data
    })
}
//编辑
export function editWorkOrder(data) {
    return request({
        url: '/evo-ims-overhaul/work-order/edit',
        method: 'post',
        data
    })
}
//根据ID查询工单详情
export function findWorkOrder(id) {
    return request({
        url: '/evo-ims-overhaul/work-order/find',
        method: 'get',
        data: { id }
    })
}
//分页获取工单
export function getWorkOrderPage(data) {
    return request({
        url: '/evo-ims-overhaul/work-order/page',
        method: 'post',
        data
    })
}
//批量删除工单
export function batchDelWorkOrder(data) {
    return request({
        url: '/evo-ims-overhaul/work-order/batch-delete',
        method: 'post',
        data
    })
}
//设置工单状态
export function setWorkOrderStatus(data) {
    return request({
        url: '/evo-ims-overhaul/work-order/set-status',
        method: 'post',
        data
    })
}

//查询工序树
export function getWorkTree(data) {
    return request({
        url: '/evo-ims-overhaul/work-procedure/tree-info',
        method: 'post',
        data
    })
}