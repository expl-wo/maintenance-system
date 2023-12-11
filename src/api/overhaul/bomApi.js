import request from '@/utils/request'
//修改BOM节点 bom/update-child
export function updateBomNode(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom/update-child',
        method: 'post',
        data
    })
}
//修改bom 模板图片
export function updateBomImgNode(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom/update-child-img',
        method: 'post',
        data
    })
}
//添加BOM节点
export function addBomNode(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom/add-child',
        method: 'post',
        data
    })
}
//新增bom树
export function addBomTree(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom/add',
        method: 'post',
        data
    })
}
//删除bom树节点
export function delBomTreeNode(data) {
    return request({
        url: `/api/evo-ims-overhaul/bom/delete`,
        method: 'post',
        data
    })
}
//分页获取Bom模板
export function getBomTemplate(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom-template/page',
        method: 'post',
        data
    })
}
//通过工单id查询改工单绑定的bom
export function getBomByWorkOrderId(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom/query-tree',
        method: 'post',
        data
    })
}
//根据id查bom详情
export function findBomTemplateById(id) {
    return request({
        url: '/api/evo-ims-overhaul/bom-template/find',
        method: 'get',
        data: { id }
    })
}
//生成二维码内容
export function createQrCodeText(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom/generate-qr-code',
        method: 'post',
        data
    })
}
//获取物料类别 
export function getMaterial(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/material-class',
        method: 'post',
        data: data
    })
}
//获取大部件
export function getBigComponent(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/big-component',
        method: 'post',
        data: data
    })
}
//同步bom
export function syncBom(workId) {
    return request({
        url: `/api/evo-ims-overhaul/bom/sync/${workId}`,
        method: 'get'
    })
}
