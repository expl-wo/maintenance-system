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
