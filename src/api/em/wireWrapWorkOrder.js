/**
 * Created by fp
 */
import request from '@/utils/request'

const url = {
  //新增 	POST
  addOrUpdate: '/wireWrapWorkOrder',
  //新增 	POST
  finish: '/wireWrapWorkOrder/finish',
  //获取最近一次
  findLatelyWorkOrder: '/wireWrapWorkOrder/findLatelyWorkOrder',
}

export default {
  url: url,
  addOrUpdate(params) {
    return request({
      url: url.addOrUpdate,
      method: 'post',
      data: params
    })
  },
  finish(params){
    return request({
      url: url.finish,
      method: 'post',
      data: params
    })
  },
  findLatelyWorkOrder(params) {
    return request({
      url: url.findLatelyWorkOrder,
      method: 'post',
      data: params
    })
  },
}
