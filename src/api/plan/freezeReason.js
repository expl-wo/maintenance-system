import request from '@/utils/request'

const url = {
  //冻结原因配置-新增/修改冻结原因   POST
  insertFreezeReason: '/api/gcplan/planFreeze/insertFreezeReason',
  //冻结原因配置-删除冻结原因  POST
  deleteFreezeReason: '/api/gcplan/planFreeze/deleteFreezeReason',
  //冻结原因配置-查询冻结原因列表  GET
  findAllFreezeReason: '/api/gcplan/planFreeze/findAllFreezeReason'
}

export default {
  findAllFreezeReason(params) {
    return request({
      url: url.findAllFreezeReason,
      method: 'get',
      data: params
    })
  },
  insertFreezeReason(params) {
    return request({
      url: url.insertFreezeReason,
      method: 'post',
      data: params
    })
  },
  deleteFreezeReason(params) {
    return request({
      url: url.deleteFreezeReason,
      method: 'post',
      data: params
    })
  },
}

