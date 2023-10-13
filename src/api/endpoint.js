import request from '@/utils/request'
// import requestUpload from '@/utils/requestUpload'

// 单文件上传操作
export function getSingleUpload(data) {
  return request({
    url: '/endpoint/upload/single',
    method: 'POST',
    data
  })
}

// 浏览器获取访问文件的根路径
export function getRooturl() {
  return request({
    url: '/endpoint/comm/reso/rooturl',
    method: 'get'
  })
}
