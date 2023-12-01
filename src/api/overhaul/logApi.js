import request from '@/utils/request'
// 查询打卡日志
export function getClockInList(data) {
    return request({
        url: '/api/evo-ims-overhaul/clock-in/page',
        method: 'post',
        data
    })
}
// 查询操作日志
export function getOperationList(data) {
  return request({
      url: '/api/evo-ims-overhaul/log/operate/page',
      method: 'post',
      data
  })
}