import request from '@/utils/request'
//返厂清单列表分页
export function getReturnList(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom-examine/page',
        method: 'post',
        data
    })
}
//导出列表清单数量
export function exportReturnListNum(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom-examine/export-count',
        method: 'post',
        data
    })
}
//导出列表清单
export function exportReturnList(data) {
    return request({
        url: '/api/evo-ims-overhaul/bom-examine/export',
        method: 'post',
        data,
        config: { responseType: 'blob' }
    })
}
