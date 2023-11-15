/**
 * Created by fp
 */
import request from '@/utils/request'

const url = {
  //单文件上传	post
  uploadSingle: '/endpoint/upload/single',
  //多文件上传 POST
  uploadMultiple: '/endpoint/upload/multiple'
}

export default {
  url: url,
  uploadSingle(params) {
    return request({
      url: url.uploadSingle,
      method: 'post',
      data: params
    })
  },
  uploadMultiple(params) {
    return request({
      url: url.uploadMultiple,
      method: 'post',
      data: params
    })
  },
}
