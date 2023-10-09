import request from '@/utils/request'

// 设备分类
export function getEquipCateList() {
    return request({
      url: '/baseConfigWeb/equipCate',
      method: 'get'
    })
}

// 设备台账
export function getEquipAccountList(params) {
    return request({
      url: '/baseConfigWeb/equipAccount',
      method: 'get',
      params: {
        id: params.id // 设备分类的主键id
      }
    })
}

// 产线信息
export function getProductLineList() {
    return request({
      url: '/api/pbproduction/workSpace/productLine',
      method: 'get'
    })
}

// 产线、工位与工位实例与设备
export function getEequipAndWorkspaceList(params) {
    return request({
      url: '/baseConfigWeb/equipAndWorkspace',
      method: 'get',
      params: {
        productLineId: params.productLineId // 要查询的产线主键id
      }
    })
}

// 设备关联
export function getEequipAndWorkspaceUpdate(data) {
    return request({
        url: '/baseConfigWeb/equipAndWorkspace',
        method: 'POST',
        data
    })
}

// 设备解绑
export function deleteEequipAndWorkspace(data) {
    return request({
      url: '/baseConfigWeb/equipAndWorkspace',
      method: 'DELETE',
      data
    })
}

// 班组人员信息
export function getTeamPersonList(params) {
    return request({
      url: '/api/pbproduction/workSpace/teamPerson',
      method: 'get',
      params: {
        name: params.nameCode || '', // 员工姓名或编号
        groupName: params.groupName || ''
      }
    })
}

// 工序类型
export function getOpTypeList() {
    return request({
      url: '/api/pbproduction/workSpace/opType',
      method: 'get'
    })
}
// 工序类型
export function findLineSteps() {
  return request({
    url: '/api/pbproduction/workSpace/findLineSteps',
    method: 'get'
  })
}
// 工序类型
export function lineWork() {
  return request({
    url: '/api/pbproduction/workSpace/lineWorkSpace',
    method: 'get'
  })
}
// 工序类型
export function findInstanceByWork(params) {
  return request({
    url: '/api/pbproduction/workSpace/findInstanceByWork',
    method: 'get',
    params:{
      workSpaceId:params.workspaceId
    }
  })
}
export function changeWorkspace(data) {
  return request({
    url: '/api/pbproduction/workSpace/changeWorkspace',
    method: 'post',
    data
  })
}
// 产线、工位与工位实例与人员
export function getPersonAndworkspaceList(params) {
    return request({
      url: '/api/pbproduction/workSpace/personAndWorkspaceList',
      method: 'get',
      params: {
        productLineId: params.productLineId, // 要查询的产线主键id
        opType: params.opType // 要查询的工序类型
      }
    })
}

export function getPersonWorkSpace(params) {
  return request({
    url: '/api/pbproduction/workSpace/getPersonWorkSpace',
    method: 'get',
    params: {
      pmId: params.pmId,
      workSpaceId:params.workSpaceId,
      isLine:1
    }
  })
}

// 人员解绑
export function deletePersonAndworkspace(data) {
    return request({
      url: '/api/pbproduction/workSpace/personAndWorkspace',
      method: 'DELETE',
      data
    })
}

// 人员关联
export function getPersonAndworkspaceUpdate(data) {
    return request({
        url: '/api/pbproduction/workSpace/personAndWorkspace',
        method: 'POST',
        data
    })
}

// 查询报工原因
export function getReportReasonList(params) {
  return request({
    url: '/report/reason/find',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
    }
  })
}

// 修改新增报工原因
export function saveReportReason(data) {
  return request({
    url: '/report/reason/save',
    method: 'POST',
    data
  })
}

// 删除报工原因
// 人员解绑
export function deletePReportReason(data) {
  return request({
    url: 'report/reason/del',
    method: 'DELETE',
    data
  })
}
