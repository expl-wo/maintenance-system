
import request from '@/utils/request'
//查询已配置的业务班组
export function getConfiguredWorkClazz() {
    return request({
        url: '/api/evo-ims-overhaul/business/work-clazz',
        method: 'get',
    })
}
//查询所有班组
export function getWorkClazzList() {
    return request({
        url: '/api/evo-ims-overhaul/business/mes-work-clazz',
        method: 'get',
    })
}
//根据班组的id获取员工信息
export function getPersonByWorkClazz(id) {
    return request({
        url: '/api/evo-ims-overhaul/business/user-info',
        method: 'get',
        data: { id }
    })
}
//分类获取不同状态的人员 空闲繁忙请假等人员
export function getPersonStatusByBusId(busId) {
    return request({
        url: '/api/evo-ims-overhaul/clock-in/user-status',
        method: 'post',
        data: { busId }
    })
}