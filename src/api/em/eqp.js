import request from '@/utils/request'

// 查询鉴定类别列表
export function findIntegrityAppraisalList(params) {
  return request({
    url: '/api/equipment/integrityAppraisal/findList',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10,
      pg_pagenum: params.pg_pagenum || 1,
      name: params.name || ''
    }
  })
}

// 新增或编辑鉴定类别
export function addOrUpdateIntegrityAppraisal(data) {
    return request({
        url: '/api/equipment/integrityAppraisal/addOrUpdate',
        method: 'POST',
        data
    })
}

// 鉴定类别删除
export function deleteIntegrityAppraisal(data) {
    return request({
      url: '/api/equipment/integrityAppraisal/delete',
      method: 'DELETE',
      data
    })
}

// 新增/修改鉴定内容
export function addOrUpdateIntegrityAppraisalDe(data) {
    return request({
        url: '/api/equipment/integrityAppraisal/addOrUpdateDe',
        method: 'POST',
        data
    })
}

// 鉴定内容删除
export function deleteIntegrityAppraisalDe(data) {
    return request({
      url: '/api/equipment/integrityAppraisal/deleteDe',
      method: 'DELETE',
      data
    })
}

// 图片上传
export function imageUpload(data) {
    return request({
        url: '/api/equipment/integrityAppraisal/imageUpload',
        method: 'POST',
        data
    })
}

// 查询鉴定设备列表
export function findQualificationEquipmentList(params) {
  return request({
    url: '/api/equipment/integrityAppraisal/queryEquipmentList',
    method: 'get',
    params: {
      em31Id: params.em31Id || ''
    }
  })
}

// 查询可选择设备
export function equipList(params) {
  return request({
    url: '/api/equipment/integrityAppraisal/equipList',
    method: 'get',
    params: params
  })
}

// 新增或编辑鉴定类别
export function addOrUpdateEquipment(data) {
    return request({
        url: '/api/equipment/integrityAppraisal/addOrUpdateEquipment',
        method: 'POST',
        data
    })
}

// 鉴定类别删除
export function deleteEquipment(data) {
    return request({
      url: '/api/equipment/integrityAppraisal/deleteEquipment',
      method: 'DELETE',
      data
    })
}

// 查询鉴定任务列表
export function findTaskList(params) {
  return request({
    url: '/api/equipment/integrityAppraisal/queryTaskList',
    method: 'get',
    params: {
      search: params.search || '',
      usingDepId: params.usingDepId || '',
      eqpName: params.eqpName || '',
      eqpClazz: params.eqpClazz || '',
      status: params.status,
      pageSize: params.pg_pagesize,
      pageNum:params.pg_pagenum
    }
  })
}
//删除鉴定任务
export function deleteTask(data) {
  return request({
    url: '/api/equipment/integrityAppraisal/deleteTask',
    method: 'post',
    data:{
      id:data
    }
  })
}
//获取工序工步
export function getWorkStep(params) {
  return request({
    url: '/dncEqp/getWorkStep',
    method: 'get',
    params: {
      workshop: params.workshop || ''
    }
  })
}

//绝缘DNC-数据查询
export function getAllData(params) {
  return request({
    url: '/dncEqp/getAllData',
    method: 'get',
    params: {
      productNo: params.productNo || '',
      gx: params.gx || '',
      pg_pagesize: params.pageSize || 10,
      pg_pagenum: params.pageNum || 1,
    }
  })
}

//绝缘DNC-下发
export function confirm(data) {
  return request({
    url: '/dncEqp/confirm',
    method: 'POST',
    data
  })
}
export function confirm2(data) {
  return request({
    url: '/dncEqp/confirm2',
    method: 'POST',
    data
  })
}

//导入设备点检数据
export function integrityImport(data) {
    return request({
        url: '/endpoint/qrcodeexcel/integrityImport',
        method: 'POST',
        data
    })
}
