import request from '@/utils/request'

// 查询登录者待响应问题列表
export function getAndonList(data) {
  debugger
  return request({
    url: '/api/andon/LngList/query',
    method: 'get',
    data: data
  })
}

// 问题响应 /response/save
export function responseSave(data) {
  return request({
    url: '/api/andon/response/save',
    method: 'post',
    data
  })
}

// 问题解决 /solve/save
export function solveSave(data) {
  return request({
    url: '/api/andon/solve/save',
    method: 'post',
    data
  })
}

// 问题驳回 /reject/save
export function rejectSave(data) {
  return request({
    url: '/api/andon/reject/save',
    method: 'post',
    data
  })
}

// 关闭/close/save
export function closeSave(data) {
  return request({
    url: '/api/andon/close/save',
    method: 'post',
    data
  })
}

// 转办 /transfer/save
export function transferSave(data) {
  return request({
    url: '/api/andon/transfer/save',
    method: 'post',
    data
  })
}

// 安灯照片
export function getAndonPicture(params) {
  return request({
    url: '/api/andon/triggerPicture/query',
    method: 'get',
    data: {
      triggerId: params.id
    }
  })
}

// 部门人员查询
export function getDepartmentPersons(params) {
  return request({
    url: '/api/pbpermissions/userInfo/getDepartmentPersons',
    method: 'get',
    data: {
      searchKey: params.searchKey,
      pg_pagesize: params.pg_pagesize,
      pg_pagenum: params.pg_pagenum
    }
  })
}

// 指派
export function assignSave(data) {
  return request({
    url: '/api/andon/assign/save',
    method: 'post',
    data
  })
}



// 所有异常类型
export function getAbnormalNameList() {
    return request({
      url: '/andonResponse/abnormalName',
      method: 'get'
    })
}

// 所有安灯状态
export function getAndonStatusList() {
    return request({
      url: '/andonResponse/status',
      method: 'get'
    })
}

// 安灯问题记录详细信息
export function getTriggerDetailsList(params) {
  return request({
    url: '/andonResponse/triggerDetails',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 触发人或响应人
      abnormalId: params.abnormalId || '-1', // 查询的异常类别, “-1”代表查询所有，其余为异常类别id
      status: params.status || '-1', // 状态,”-1”代表查询所有，其余为对应的枚举值 {0:”触发”,1:”响应”,2:”关闭”}
      startDate: params.startDate || '', // 触发时间的搜索开始时间
      endDate: params.endDate || '', // 触发时间的搜索结束时间,
      isReward: params.isReward,
      andonNum: params.andonNum
    }
  })
}

// 查看异常关键点信息
export function getKeyParameterList(params) {
  return request({
    url: '/andonResponse/keyParameter',
    method: 'get',
    data: {
      id: params.id || '' // 主键id
    }
  })
}

// 升级提醒记录查询
export function getUpgradeRecordList(params) {
  return request({
    url: '/andonResponse/upgradeRecord',
    method: 'get',
    data: {
      triggerId: params.triggerId || '' // 待查询的安灯记录的id
    }
  })
}

export function delAndonRecord(params) {
  return request({
    url: '/andonResponse/delrecord',
    method: 'DELETE',
    data: {
      id: params.id
    }
  })
}

export function checkReward(data) {
  return request({
    url: '/andonResponse/checkReward',
    method: 'post',
    data
  })
}

