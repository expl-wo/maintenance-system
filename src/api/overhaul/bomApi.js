import request from '@/utils/request'
//添加BOM节点
export function addBomNode(data) {
    return request({
        url: '/evo-ims-overhaul/bom/addBomInfo',
        method: 'post',
        data
    })
}
//分页获取Bom模板
export function getBomTemplate(data) {
    return request({
        url: '/evo-ims-overhaul/bom-template/page',
        method: 'post',
        data
    })
}
//根据id查bom详情
export function findBomTemplateById(id) {
    return request({
        url: '/evo-ims-overhaul/bom-template/find',
        method: 'get',
        data: { id }
    })
}
//生成二维码内容
export function createQrCodeText(num) {
    return request({
        url: '/evo-ims-overhaul/bom/generateQRContent',
        method: 'post',
        data: { num }
    })
}
//获取物料类别 
export function getMaterial(data) {
    return request({
        url: '/evo-ims-overhaul/work-order/wms-material-class',
        method: 'post',
        data: data
    })
}
//获取大部件
export function getBigComponent(data) {
    return request({
        url: '/evo-ims-overhaul/work-order/plm-big-component',
        method: 'post',
        data: data
    })
}

