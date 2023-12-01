import request from '@/utils/request'

// ICC设备树
export function getDeviceTree(data) {
  return request({
    url: '/api/evo-ims-link/icc/dev-tree',
    method: 'post',
    data
  })
}

// 获取设备列表
export function getDeviceList(data) {
  return request({
    url: '/api/evo-ims-link/icc/dev-page-list',
    method: 'post',
    data
  })
}

// 获取通道列表
export function getChannelList(data) {
  return request({
    url: '/api/evo-ims-link/icc/dev-channel-page-list',
    method: 'post',
    data
  })
}