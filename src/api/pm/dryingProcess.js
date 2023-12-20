import request from '@/utils/request'

const url = {
  planList: '/api/gcproduction/dryingProcess/getList',
  planDeList: '/api/gcproduction/dryingProcess/planDe/getList',
  planAddOrUpdt: '/api/gcproduction/dryingProcess/addOrUpdate',
  planDeAddOrUpdt: '/api/gcproduction/dryingProcess/planDe/addOrUpdate',
  planDelete: '/api/gcproduction/dryingProcess/delete',
  planDeDelete: '/api/gcproduction/dryingProcess/planDe/delete',
  voltageList: '/api/gcproduction/dryingProcess/voltage/getList',
  voltageAddOrUpdt: '/api/gcproduction/dryingProcess/voltage/addOrUpdate',
  voltageDelete: '/api/gcproduction/dryingProcess/voltage/delete',
  tankPlan: '/api/gcproduction/dryingProcess/tankPlan',

}

export default {
  planList(params) {
    return request({
      url: url.planList,
      method: 'get',
      data: params
    })
  },
  planAddOrUpdt(params) {
    return request({
      url: url.planAddOrUpdt,
      method: 'post',
      data: params
    })
  },
  planDelete(params) {
    return request({
      url: url.planDelete,
      method: 'delete',
      data: params
    })
  },
  planDeList(params) {
    return request({
      url: url.planDeList,
      method: 'get',
      data: params
    })
  },
  planDeAddOrUpdt(params) {
    return request({
      url: url.planDeAddOrUpdt,
      method: 'post',
      data: params
    })
  },
  planDeDelete(params) {
    return request({
      url: url.planDeDelete,
      method: 'delete',
      data: params
    })
  },
  voltageList(params) {
    return request({
      url: url.voltageList,
      method: 'get',
      data: params
    })
  },
  voltageAddOrUpdt(params) {
    return request({
      url: url.voltageAddOrUpdt,
      method: 'post',
      data: params
    })
  },
  voltageDelete(params) {
    return request({
      url: url.voltageDelete,
      method: 'delete',
      data: params
    })
  },
  tankPlan(params) {
    return request({
      url: url.tankPlan,
      method: 'get',
      data: params
    })
  },
}
