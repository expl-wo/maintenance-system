
import request from '@/utils/request'
//查询已配置的业务班组
export function getConfiguredWorkClazz() {
    return request({
        url: '/evo-ims-overhaul/business/work-clazz',
        method: 'get',
    })
}
//查询所有班组
export function getWorkClazzList() {
    return request({
        url: '/evo-ims-overhaul/business/mes-work-clazz',
        method: 'get',
    })
}
//根据班组的id获取员工信息
export function getPersonByWorkClazz(id) {
    return request({
        url: '/evo-ims-overhaul/mes-work-clazz/user-info',
        method: 'get',
        data: { id }
    })
}