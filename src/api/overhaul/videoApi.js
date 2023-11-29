import request from '@/utils/request'
//添加标记
export function addVideoMarker(data) {
    return request({
        url: '/evo-ims-overhaul/video-image/add',
        method: 'post',
        data
    })
}
///修改标记
export function updateVideoMarker(data) {
    return request({
        url: '/evo-ims-overhaul/video-image/update',
        method: 'post',
        data
    })
}
///删除标记
export function deleteVideoMarker(data) {
    return request({
        url: '/evo-ims-overhaul/video-image/batch-delete',
        method: 'post',
        data
    })
}
///查询单条
export function getVideoMarker(id) {
    return request({
        url: '/evo-ims-overhaul/video-image/query',
        method: 'get',
        data:{id}
    })
}
//分页查询
export function pageVideoMarker(data) {
    return request({
        url: '/evo-ims-overhaul/video-image/page',
        method: 'post',
        data
    })
}