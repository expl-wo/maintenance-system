import request from '@/utils/request'

const url = {
  planList: '/api/gcplan/dryingProcess/getList',
  planDeList: '/api/gcplan/dryingProcess/planDe/getList',
  planAddOrUpdt: '/api/gcplan/dryingProcess/addOrUpdate',
  planDeAddOrUpdt: '/api/gcplan/dryingProcess/planDe/addOrUpdate',
  planDelete: '/api/gcplan/dryingProcess/delete',
  planDeDelete: '/api/gcplan/dryingProcess/planDe/delete',
  voltageList: '/api/gcplan/dryingProcess/voltage/getList',
  voltageAddOrUpdt: '/api/gcplan/dryingProcess/voltage/addOrUpdate',
  voltageDelete: '/api/gcplan/dryingProcess/voltage/delete',
  tankPlan: '/api/gcplan/dryingProcess/tankPlan',

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
