import request from '@/utils/request'
//根据模板ID查工单详情
export function findDevList(templateId) {
    return request({
        url: '/evo-ims-overhaul/device-list-template/query',
        method: 'get',
        data: { templateId }
    })
}
//分页获取设备清单模板
export function getDevListPage(data) {
    return request({
        url: '/evo-ims-overhaul/device-list-template/page',
        method: 'get',
        data
    })
}
//获取所有设备类型
export function getAllDevType() {
    return request({
        url: '/evo-ims-overhaul/device-list-template/device-model',
        method: 'get',
    })
}
//根据设备类型查设备型号
export function geDevUnitType(deviceModelId) {
    return request({
        url: '/evo-ims-overhaul/device-list-template/device-id',
        method: 'get',
        data: { deviceModelId }
    })
}