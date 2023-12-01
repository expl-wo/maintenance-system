import request from '@/utils/request'

// 查询通知信息
export function getNoticeList(data) {
  return request({
    url: '/api/evo-ims-overhaul/person-center/notice/page',
    method: 'post',
    data
  })
}
// 标记通知
export function markNotice(data) {
  return request({
    url: '/api/evo-ims-overhaul/person-center/notice/set-status',
    method: 'post',
    data
  })
}
// 查询任务信息
export function getTaskList(data) {
  return request({
    url: '/api/evo-ims-overhaul/person-center/task/page',
    method: 'post',
    data
  })
}