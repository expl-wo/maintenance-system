import request from '@/utils/request'

// Andon异常分类分页查询
export function plan(params) {
  return request({
    url: '/inspectionPlan/plan',
    method: 'get',
    params:params
  })
}
export function queryTreeEqp(params) {
  return request({
    url: '/inspectionPlan/queryTreeEqp',
    method: 'get',
    params:params
  })
}
export function addOrUpdate(data) {
  return request({
    url: '/inspectionPlan/addOrUpdate',
    method: 'post',
    data
  })
}
export function deleteData(params) {
  return request({
    url: '/inspectionPlan/delete',
    method: 'post',
    params:params
  })
}

export function eqpInfo(params) {
  return request({
    url: '/api/equipment/eqpCommon/eqpInfo',
    method: 'get',
    params:params
  })
}
//导入
export function importPlan(data) {
    return request({
        url: '/endpoint/qrcodeexcel/inspectionPlanImport',
        method: 'POST',
        data
    })
}

export function getInspectionFileList(params) {
  return request({
    url: '/inspectionPlan/file',
    method: 'get',
    params: {
      id: params.id || '' // 设备id
    }
  })
}
export function getInspectionUpdate(data) {
  return request({
    url: '/inspectionPlan/file',
    method: 'POST',
    data
  })
}
// 设备文件删除
export function deleteInspectionFile(data) {
  return request({
    url: '/inspectionPlan/file',
    method: 'DELETE',
    data
  })
}
// Andon异常分类修改
// export function getAndonConfigCateUpdate(data) {
//   return request({
//     url: '/andonConfig/cate',
//     method: 'POST',
//     data
//   })
// }
