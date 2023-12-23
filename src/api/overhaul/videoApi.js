import request from '@/utils/request'
//添加标记
export function addVideoMarker(data) {
    return request({
        url: '/api/evo-ims-overhaul/video-image/add',
        method: 'post',
        data
    })
}
///修改标记
export function updateVideoMarker(data) {
    return request({
        url: '/api/evo-ims-overhaul/video-image/update',
        method: 'post',
        data
    })
}
///删除标记
export function deleteVideoMarker(data) {
    return request({
        url: '/api/evo-ims-overhaul/video-image/batch-delete',
        method: 'post',
        data
    })
}
///查询单条
export function getVideoMarker(id) {
    return request({
        url: `/api/evo-ims-overhaul/video-image/query/${id}`,
        method: 'get',
    })
}
//分页查询
export function pageVideoMarker(data) {
    return request({
        url: '/api/evo-ims-overhaul/video-image/page',
        method: 'post',
        data
    })
}
//获取当前通道关联的工序
export function getWorkByChannel(data) {
    return request({
        url: '/api/evo-ims-overhaul/video-image/work-procedure',
        method: 'post',
        data
    })
}
//获取icc鉴权信息
export function getUserToIcc() {
    return request({
        url: '/api/evo-ims-overhaul/user-info/query',
        method: 'get',
        data
    })
}